/**
 * Elektromarketim: Sadece Hims markalı ve yerel ürün görseli olmayan ürünleri tarar;
 * SKU eşleşen sayfaların tüm görsellerini SKU bazlı alt klasörlere indirir.
 * Kullanım: npx tsx scripts/fetch-electromarketim-images-by-sku.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { mockProducts } from '../lib/products-mock'

const BASE = 'https://www.elektromarketim.com'
const DELAY_MS = 800
const OUT_DIR_NAME = 'electromarketim-downloaded'

/** HTML'den "Ürün Kodu : XXX" çıkar (fetch-elektromarketim-specs ile aynı). */
function parseProductCode(html: string): string | null {
  const m = html.match(/Ürün\s*Kodu\s*[:\s]*([A-Za-z0-9-]+)/i)
  return m ? m[1].trim() : null
}

/** SKU karşılaştırması için normalize: büyük/küçük harf, tire/boşluk. */
function normalizeSku(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
}

/** Yerel ürün görseli var mı? Varsa bu ürün taranmayacak. */
function hasLocalProductImage(p: { image?: string; images?: string[] }): boolean {
  if (p.image && String(p.image).startsWith('/images/products/')) return true
  if (p.images?.some((x) => String(x).startsWith('/images/products/'))) return true
  return false
}

/** Hims + görseli olmayan aday ürünler. */
function getCandidateProducts(): { id: string; sku: string }[] {
  return mockProducts
    .filter(
      (p) =>
        p.brand === 'Hims' &&
        p.sku &&
        !hasLocalProductImage(p)
    )
    .map((p) => ({ id: p.id, sku: p.sku }))
}

/** specs.json'dan sku -> url map (normalize edilmiş key). Birden fazla key ile kaydeder. */
function loadSpecsMap(specsPath: string): Map<string, string> {
  const map = new Map<string, string>()
  if (!fs.existsSync(specsPath)) return map
  const data = JSON.parse(fs.readFileSync(specsPath, 'utf-8')) as { sku: string; url: string }[]
  for (const row of data) {
    if (!row.sku || !row.url) continue
    const cleanUrl = row.url.split('?')[0]
    const key = normalizeSku(row.sku)
    map.set(key, cleanUrl)
    const withoutHims = key.replace(/^HIMS-?/i, '')
    if (withoutHims !== key) map.set(withoutHims, cleanUrl)
  }
  return map
}

/** Aday SKU için URL'yi specs map'ten bul; birden fazla olası key dene. */
function resolveUrl(sku: string, skuToUrl: Map<string, string>): string | undefined {
  const k1 = normalizeSku(sku)
  if (skuToUrl.has(k1)) return skuToUrl.get(k1)
  const k2 = k1.replace(/^HIMS-?/i, '')
  return skuToUrl.get(k2)
}

/** Arama sayfasından ilk ürün detay linkini dene (specs'te yoksa). */
async function trySearchForUrl(sku: string): Promise<string | null> {
  const searchTerm = encodeURIComponent(sku.replace(/^Hims-?/i, '').trim())
  const searchUrls = [
    `${BASE}/ara?q=${searchTerm}`,
    `${BASE}/arama?q=${searchTerm}`,
    `${BASE}/search?q=${searchTerm}`,
  ]
  for (const searchUrl of searchUrls) {
    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      })
      if (!res.ok) continue
      const html = await res.text()
      const match = html.match(/href=["'](https?:\/\/[^"']*elektromarketim\.com\/[^"']*\/)["']/i)
        || html.match(/href=["'](\/[^"']*\/)["']/i)
      if (match) {
        let url = match[1]
        if (url.startsWith('/')) url = BASE + url
        const clean = cleanProductUrl(url)
        if (clean.includes('elektromarketim.com') && !/ara|arama|search|login|sepet/i.test(clean))
          return clean
      }
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }
  return null
}

/** URL'yi sadece base + pathname (query yok) yap. */
function cleanProductUrl(url: string): string {
  try {
    const u = new URL(url)
    u.search = ''
    return u.toString()
  } catch {
    return url.split('?')[0]
  }
}

/** HTML'den ürün galerisi görsel URL'lerini çıkar. data-src, data-zoom, src; logo/favicon elenir. */
function extractImageUrls(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl).origin
  const seen = new Set<string>()
  const out: string[] = []

  // img src="..." data-src="..." data-zoom="..."
  const srcRegex = /(?:src|data-src|data-zoom)=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = srcRegex.exec(html)) !== null) {
    let url = m[1].trim()
    if (!url || url.startsWith('data:') || url.startsWith('#')) continue
    if (/logo|favicon|icon|sprite|banner|pixel|placeholder/i.test(url)) continue
    if (!/\.(jpg|jpeg|png|webp|gif)/i.test(url) && !/cdn|resim|image|upload|urun|product/i.test(url)) continue
    if (url.startsWith('//')) url = 'https:' + url
    if (url.startsWith('/')) url = base + url
    if (!url.startsWith('http')) continue
    const normalized = url.split('?')[0]
    if (!seen.has(normalized)) {
      seen.add(normalized)
      out.push(url)
    }
  }

  return out
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(cleanProductUrl(url), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch (e) {
    console.error('Fetch error', url, e)
    return null
  }
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    if (!res.ok) return false
    const buf = Buffer.from(await res.arrayBuffer())
    const ext = path.extname(new URL(url).pathname) || '.jpg'
    const finalPath = filePath.replace(/\.[a-z]+$/i, ext) || filePath + ext
    fs.mkdirSync(path.dirname(finalPath), { recursive: true })
    fs.writeFileSync(finalPath, buf)
    return true
  } catch {
    return false
  }
}

async function main() {
  const scriptDir = __dirname
  const specsPath = path.join(scriptDir, 'elektromarketim-specs.json')
  const outDir = path.join(scriptDir, OUT_DIR_NAME)

  const candidates = getCandidateProducts()
  console.log(`Aday Hims ürün sayısı (görseli olmayan): ${candidates.length}`)
  if (candidates.length === 0) {
    console.log('İşlenecek ürün yok.')
    return
  }

  const skuToUrl = loadSpecsMap(specsPath)
  const fetchList: { sku: string; url: string }[] = []
  const seenUrls = new Set<string>()
  for (const { sku } of candidates) {
    let url = resolveUrl(sku, skuToUrl)
    if (!url) {
      url = (await trySearchForUrl(sku)) ?? undefined
    }
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url)
      fetchList.push({ sku, url })
    }
  }
  console.log(`İşlenecek URL sayısı (specs + arama): ${fetchList.length}`)

  let matched = 0
  let totalImages = 0

  for (let i = 0; i < fetchList.length; i++) {
    const { sku, url } = fetchList[i]
    process.stdout.write(`[${i + 1}/${fetchList.length}] ${sku}...`)
    const html = await fetchHtml(url)
    await new Promise((r) => setTimeout(r, DELAY_MS))
    if (!html) {
      console.log(' fetch FAIL')
      continue
    }
    const pageCode = parseProductCode(html)
    const pageKey = pageCode ? normalizeSku(pageCode) : ''
    const candidateKey = normalizeSku(sku)
    if (pageKey !== candidateKey) {
      console.log(' SKU eşleşmedi (sayfa:', pageCode ?? '-', ')')
      continue
    }
    matched++
    const imageUrls = extractImageUrls(html, url)
    if (imageUrls.length === 0) {
      console.log(' görsel yok')
      continue
    }
    const skuDir = path.join(outDir, sku.replace(/[/\\]/g, '-'))
    let count = 0
    for (let j = 0; j < imageUrls.length; j++) {
      const num = String(j + 1).padStart(2, '0')
      const filePath = path.join(skuDir, `${num}.jpg`)
      const ok = await downloadImage(imageUrls[j], filePath)
      if (ok) count++
      await new Promise((r) => setTimeout(r, 200))
    }
    totalImages += count
    console.log(` ${count} görsel indirildi`)
  }

  const absOut = path.resolve(outDir)
  console.log('\n--- Özet ---')
  console.log(`URL bulunan: ${fetchList.length}, SKU eşleşen: ${matched}, İndirilen görsel: ${totalImages}`)
  console.log(`\nGörseller şu klasöre indirildi: ${absOut}`)
  console.log('Kontrol edip onaylıyor musunuz?')
}

main().catch(console.error)
