/**
 * Elektromarketim.com ürün linkinden görsel + açıklama çeker; electromarketim-by-url/{SKU}/ altına yazar.
 *
 * Kullanım:
 *   Tek URL:  npx tsx scripts/fetch-electromarketim-by-url.ts "https://www.elektromarketim.com/urun-slug"
 *   Dosyadan: npx tsx scripts/fetch-electromarketim-by-url.ts --file scripts/electromarketim-urls.txt
 *   (Dosyada satır başına bir URL; tekrarlar ve geçersiz satırlar atlanır.)
 */

import * as fs from 'fs'
import * as path from 'path'

const DELAY_MS = 500
const OUT_DIR_NAME = 'electromarketim-by-url'
/** Ürün başına en fazla bu kadar görsel indirilir (sayfada 1–N olabilir). */
const MAX_IMAGES = 20

function cleanProductUrl(url: string): string {
  try {
    const u = new URL(url)
    u.search = ''
    let s = u.toString()
    if (s.endsWith('/')) s = s.slice(0, -1)
    return s
  } catch {
    return url.split('?')[0].replace(/\/$/, '')
  }
}

/** Dosyadan URL listesi okur; boş ve geçersiz satırları atlar, tekrarları kaldırır. */
function readUrlsFromFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const seen = new Set<string>()
  const out: string[] = []
  for (const line of lines) {
    if (!line.includes('elektromarketim.com')) continue
    const normalized = cleanProductUrl(line)
    if (seen.has(normalized)) continue
    seen.add(normalized)
    out.push(normalized)
  }
  return out
}

function parseProductCode(html: string): string | null {
  const m = html.match(/Ürün\s*Kodu\s*[:\s]*([A-Za-z0-9-]+)/i)
  return m ? m[1].trim() : null
}

function parseTitle(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (og?.[1]) return og[1].trim()
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1?.[1]) return h1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return ''
}

const CSS_LIKE_KEYS = /^(left|right|width|height|color|padding|margin|display|position|top|bottom|url|https|float|align|background|size|weight|radius|overflow|shadow|type|dataType|success|error|scrollTop|day|month|year|slideCtrl|showCtrl|wrapCtrl|nextBtn|prevBtn|changeOnMouse|slidePaging|wrapPaging|changeFn|slideType|slideMove|slideDirection|visibleItem|touchEnabled|zoomType|easing|scrollZoom|zoomWindowPosition|productThumbs|pWin|email|item|ftitle|spacing|decoration)$/i

/**
 * Ürün Özellikleri tablosu (görseldeki gibi): satırlar
 * col-4 fw700 = anahtar, col-1 = ":", col-7 = değer.
 */
function parseSpecifications(html: string): Record<string, string> {
  const specs: Record<string, string> = {}
  const rowRegex = /<div class="box col-4 fw700">([^<]+)<\/div>\s*<div[^>]*>:\s*<\/div>\s*<div class="box col-7">([^<]*)<\/div>/gi
  let m: RegExpExecArray | null
  while ((m = rowRegex.exec(html)) !== null) {
    const key = m[1].replace(/\s+/g, ' ').trim()
    const value = m[2].replace(/\s+/g, ' ').trim()
    if (!key || key === 'Ürün Özellikleri') continue
    specs[key] = value
  }
  return specs
}

const JUNK_IN_DESC = /(\d{1,2}\.\d{2}\s*₺|Sepete Ekle|Hemen Al|Adet\s*$|Kargoda|Gelince Haber Ver|HAVALE|İNDİRİM|Bayilerimizi|Planlanan Teslimat|Yarın|ÜCRETSİZ KARGO|ÖZEL TEKLİF|Menüyü Kapat|Kategoriler|Anasayfa Aydınlatma|Özel indirimlerden|Fırsatlarla dolu|schema\.org|productId|aggregateRating|Kişisel verilerin|Aydınlatma ve Rıza|Daha Sonra Evet|Mobil uygulamamız|Çalışma Saatleri|destek@elektromarketim|elektroblog|Sosyal Medya|Tümünü Gör|Ampuller|Rustik|Buji|Kapsül|data-start|data-end)/gi

/**
 * Açıklama: Ürün Özellikleri sekmesi (id="productDetailTab") içinden "bu model / bu adaptör /
 * markasının üretmiş..." açıklama metnini alır; Ürün Özellikleri tablosu başlamadan keser.
 */
function parseFullDescription(html: string, _productTitle: string): string {
  const stripTags = (s: string) =>
    s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
  const tabStart = html.indexOf('id="productDetailTab"')
  if (tabStart < 0) return ''
  let block = html.slice(tabStart, tabStart + 35000)
  const tableStart = block.search(/<div class="box col-12 fw700">\s*Ürün Özellikleri\s*<\/div>/i)
  if (tableStart >= 0) block = block.slice(0, tableStart)
  let out = stripTags(block).replace(JUNK_IN_DESC, ' ').replace(/\s+/g, ' ').trim()
  const productNameStart = out.search(/Hims\s+[\w\-]+.*?Uyumlu|Hims\s+[\w\-]+.*?Adaptörü|Hims\s+bir\s*elektromarketim/i)
  const descStart = out.search(/markasının\s*üretmiş|Bu\s+model|bu\s+adaptör|bu\s+V2L/i)
  const start =
    productNameStart >= 0 && (descStart < 0 || productNameStart <= descStart)
      ? productNameStart
      : descStart >= 0
        ? descStart
        : productNameStart
  if (start >= 0) out = out.slice(start)
  if (out.length < 80) return ''
  if (out.length > 6000) out = out.slice(0, 6000) + '…'
  return out
}

/** ✓ ile başlayan maddeleri features dizisine çıkar. */
function parseFeatures(html: string): string[] {
  const features: string[] = []
  const block = html.match(/Ürün\s*Özellikleri[\s\S]*?(?=Ürün\s*Etiketleri|Ortalama\s*Puan)/i)?.[0] || html
  const regex = /✓\s*([^\n<✓]+)/g
  let m
  while ((m = regex.exec(block)) !== null) {
    const t = m[1].replace(/\s+/g, ' ').trim()
    if (t.length > 10) features.push(t)
  }
  return features
}

/** Ürün görseli sayılmayacak URL kalıpları (logo, sosyal, slider, loading) – urundetay ürün galerisi olabileceği için hariç. */
const NON_PRODUCT_IMAGE = /loading\/|lazy-510|notice-bar|elektropuan|seffaf-kafa|logo\.(png|webp|jpg)|favicon|facebook|twitter|instagram|youtube|tiktok|linkedin|content\/se-|content\/mobil-pop|biseysorcaktim|hergun-urundetay/i

/**
 * Sadece bu sayfadaki ürün galerisi görsellerini döndürür:
 * - id="productImage" içindeki data-href / data-standard (büyük görsel, -B.jpg)
 * - og:image, schema.org Product image
 * Sayı ürüne göre 1–N; sıra galeri sırasına göre.
 */
function extractImageUrls(html: string, baseUrl: string): string[] {
  const base = new URL(baseUrl).origin
  const normalize = (u: string) => {
    let url = u.trim()
    if (url.startsWith('//')) url = 'https:' + url
    if (url.startsWith('/')) url = base + url
    return url.startsWith('http') ? url : ''
  }
  const isProductImage = (url: string) =>
    /\.(jpg|jpeg|png|webp)$/i.test(url.split('?')[0]) && !NON_PRODUCT_IMAGE.test(url)

  const seen = new Set<string>()
  const add = (url: string): boolean => {
    const n = normalize(url)
    if (!n || !isProductImage(n)) return false
    const key = n.split('?')[0]
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }

  const out: string[] = []

  // 1) Ana galeri: id="productImage" veya product detail alanı içindeki data-href, data-standard, data-src, src
  const galleryStart = html.indexOf('id="productImage"')
  const detailStart = html.indexOf('id="productDetailTab"') >= 0 ? html.indexOf('id="productDetailTab"') : 0
  const searchStart = galleryStart >= 0 ? galleryStart : Math.min(html.indexOf('class="product'), detailStart) || 0
  const chunkStart = searchStart >= 0 ? searchStart : 0
  const chunk = html.slice(chunkStart, chunkStart + 20000)
  const dataUrlRegex = /(?:data-(?:href|standard|src)=["']([^"']+)["']|(?:src)=["']([^"']+)["'])/gi
  let m: RegExpExecArray | null
  while ((m = dataUrlRegex.exec(chunk)) !== null) {
    const url = normalize(m[1] || m[2] || '')
    if (url && isProductImage(url) && add(url)) out.push(url)
  }
  // productImage varsa ayrıca sadece o blokta da tara (önce galeri öncelikli)
  if (galleryStart >= 0) {
    const galleryChunk = html.slice(galleryStart, galleryStart + 15000)
    const galleryDataRegex = /data-(?:href|standard)=["']([^"']+)["']/gi
    while ((m = galleryDataRegex.exec(galleryChunk)) !== null) {
      const url = normalize(m[1])
      if (url && isProductImage(url) && add(url)) out.push(url)
    }
  }

  // 2) og:image (ana ürün görseli) – galeride yoksa ekle
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (ogMatch?.[1]) {
    const url = normalize(ogMatch[1])
    if (url && add(url)) out.unshift(url)
  }

  // 3) schema.org Product "image" (tek veya dizi)
  const schemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
  if (schemaMatch?.[1]) {
    try {
      const json = JSON.parse(schemaMatch[1])
      const img = json?.image
      const arr = Array.isArray(img) ? img : img ? [img] : []
      for (const u of arr) {
        const url = normalize(String(u))
        if (url && add(url)) out.push(url)
      }
    } catch {
      /* ignore */
    }
  }

  // Aynı fotoğrafın farklı boyutlarını (-B, -K, -O) tek say: base key ile dedupe, büyük (B) tercih et
  const baseKey = (url: string) => url.replace(/-[BKO]\.(jpg|jpeg|png|webp)$/i, '-X.$1').split('?')[0]
  const byBase = new Map<string, string>()
  for (const url of out) {
    const key = baseKey(url)
    const existing = byBase.get(key)
    if (!existing) byBase.set(key, url)
    else if (/-\d+-[0-9]+-B\./i.test(url) && !/-\d+-[0-9]+-B\./i.test(existing)) byBase.set(key, url)
  }
  return Array.from(byBase.values()).slice(0, MAX_IMAGES)
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(cleanProductUrl(url), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch (e) {
    console.error('Fetch hatası', url, e)
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

/** Tek URL işler; skipExisting true ise bu SKU için klasör ve aciklama.json varsa atlar. */
async function processOneUrl(
  url: string,
  outDir: string,
  options: { skipExisting?: boolean } = {}
): Promise<{ success: boolean; sku?: string }> {
  const html = await fetchHtml(url)
  if (!html) return { success: false }

  const sku = parseProductCode(html) || path.basename(new URL(cleanProductUrl(url)).pathname).replace(/\/$/, '') || 'urun'
  const safeSku = sku.replace(/[/\\?*:|"]/g, '-')
  const productDir = path.join(outDir, safeSku)
  const aciklamaPath = path.join(productDir, 'aciklama.json')

  if (options.skipExisting && fs.existsSync(aciklamaPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(aciklamaPath, 'utf-8'))
      if (existing.url === cleanProductUrl(url)) return { success: true, sku }
    } catch {
      /* ignore */
    }
  }

  const title = parseTitle(html)
  const fullDescription = parseFullDescription(html, title || '')
  const specifications = parseSpecifications(html)
  const features = parseFeatures(html)

  fs.mkdirSync(productDir, { recursive: true })

  const imageUrls = extractImageUrls(html, url)
  if (imageUrls.length === 0 && html.includes('data-href=')) {
    // Yedek: data-href ve data-standard değerlerini doğrudan tara (büyük görsel -B.jpg tercih)
    const directRegex = /data-(?:href|standard)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi
    const direct: string[] = []
    let dm: RegExpExecArray | null
    while ((dm = directRegex.exec(html)) !== null) {
      const u = dm[1].trim()
      if (!NON_PRODUCT_IMAGE.test(u)) direct.push(u)
    }
    const byBase = new Map<string, string>()
    const baseKey = (u: string) => u.replace(/-[BKO]\.(jpg|jpeg|png|webp)$/i, '-X.$1').split('?')[0]
    for (const u of direct) {
      const key = baseKey(u)
      if (!byBase.has(key)) byBase.set(key, u)
      else if (/-\d+-[0-9]+-B\./i.test(u)) byBase.set(key, u)
    }
    imageUrls.push(...Array.from(byBase.values()).slice(0, MAX_IMAGES))
  }
  let downloaded = 0
  for (let j = 0; j < imageUrls.length; j++) {
    const num = String(j + 1).padStart(2, '0')
    const filePath = path.join(productDir, `${num}.jpg`)
    const ok = await downloadImage(imageUrls[j], filePath)
    if (ok) downloaded++
    await new Promise((r) => setTimeout(r, 200))
  }

  const aciklama = {
    url: cleanProductUrl(url),
    sku,
    title,
    fullDescription,
    specifications,
    features,
  }
  fs.writeFileSync(aciklamaPath, JSON.stringify(aciklama, null, 2), 'utf-8')
  return { success: true, sku }
}

async function main() {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const skipExisting = args.includes('--skip-existing')
  const scriptDir = __dirname
  const outDir = path.join(scriptDir, OUT_DIR_NAME)

  let urls: string[]

  if (fileIdx >= 0 && args[fileIdx + 1]) {
    const filePath = path.isAbsolute(args[fileIdx + 1]) ? args[fileIdx + 1] : path.join(process.cwd(), args[fileIdx + 1])
    if (!fs.existsSync(filePath)) {
      console.error('Dosya bulunamadı:', filePath)
      process.exit(1)
    }
    urls = readUrlsFromFile(filePath)
    if (urls.length === 0) {
      console.log('Dosyada geçerli URL yok.')
      process.exit(0)
    }
    console.log(`${urls.length} benzersiz URL işlenecek.`)
  } else {
    const url = args[0]
    if (!url || !url.includes('elektromarketim.com')) {
      console.log('Kullanım: npx tsx scripts/fetch-electromarketim-by-url.ts "https://www.elektromarketim.com/urun-slug"')
      console.log('   veya: npx tsx scripts/fetch-electromarketim-by-url.ts --file scripts/electromarketim-urls.txt [--skip-existing]')
      process.exit(1)
    }
    urls = [cleanProductUrl(url)]
  }

  let ok = 0
  let fail = 0
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    process.stdout.write(`[${i + 1}/${urls.length}] ${url.slice(0, 60)}... `)
    try {
      const result = await processOneUrl(url, outDir, { skipExisting })
      if (result.success) {
        ok++
        console.log(result.sku ? `OK (${result.sku})` : 'OK (atlandı)')
      } else {
        fail++
        console.log('Sayfa alınamadı.')
      }
    } catch (e) {
      fail++
      console.log('Hata:', (e as Error).message)
    }
    if (i < urls.length - 1) await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  if (urls.length > 1) {
    console.log('\n--- Özet ---')
    console.log('Başarılı:', ok, 'Başarısız:', fail)
  }
}

main().catch(console.error)
