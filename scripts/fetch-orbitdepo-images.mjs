/**
 * Orbitdepo.com'dan ORBİT/DEYE/SRP ürün görsellerini çeker.
 * 1) Arama sayfasından ürün URL'si bulunur, 2) Ürün sayfasından görsel URL'leri çıkarılır, 3) public/images/products/ altına indirilir.
 * Çıktı: scripts/orbitdepo-images-map.json (id -> paths) ve mock güncellemesi için bilgi.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Proje kökü = script'in bir üst dizini; görseller her zaman public/images/products'a yazılır (cwd'den bağımsız)
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'products')
const MAP_PATH = path.join(__dirname, 'orbitdepo-images-map.json')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** id -> orbitdepo arama sorgusu (ilk eşleşen ürün kullanılır) */
const SEARCH_QUERIES = {
  'orbit-12v-100ah-abs': 'Orbit 12 V 100 Ah Lifepo4 Akü-Abs Kasa',
  'orbit-12v-200ah-abs': 'Orbit 12 V 200 Ah Lifepo4 Akü-Abs Kasa',
  'orbit-12v-420ah-abs': 'Orbit 12 V 420 Ah Lifepo4 Akü-Abs Kasa',
  'orbit-12v-100ah-marin': 'Orbit 12 V 100 Ah Lifepo4 Akü-Marin Tip-Vp',
  'orbit-12v-200ah-marin': 'Orbit 12 V 200 Ah Lifepo4 Akü-Marin Tip-Vp',
  'orbit-12v-420ah-marin': 'Orbit 12 V 420 Ah Lifepo4 Akü-Marin Tip-Vp',
  'orbit-24v-100ah-abs': 'Orbit 24 V 100 Ah Lifepo4 Akü-Abs Kasa',
  'orbit-24v-150ah-abs': 'Orbit 24 V 150 Ah Lifepo4',
  'orbit-24v-210ah-abs': 'Orbit 24 V 210 Ah Lifepo4 Akü-Abs',
  'orbit-24v-100ah-marin': 'Orbit 24 V 100 Ah Lifepo4 Akü-Marin Tip-Vp',
  'orbit-24v-210ah-marin': 'Orbit 24 V 210 Ah Lifepo4 Akü-Marin Tip-Vp',
  'orbit-48v-100ah-wall': 'Orbit 48 V 100 Ah Lifepo4 Akü-Ekranlı Duvar Tipi',
  'orbit-48v-100ah-ys': 'Orbit 48 V 100 Ah Lifepo4 Akü-Ekranlı-Metal Kasa',
  'orbit-48v-100ah-ns': 'Orbit 48 V 100 Ah Lifepo4 Akü-Ekransız-Metal Kasa',
  'orbit-51v2-50ah-hv': 'Orbit 51.2 V 050 Ah Lifepo4 Akü-High Voltage',
  'orbit-51v2-100ah-hv': 'Orbit 51.2 V 100 Ah Lifepo4 High Voltage',
  'orbit-51v2-100ah-lv': 'Orbit 51.2 V 100 Ah Lifepo4 Low Voltage',
  'orbit-51v2-280ah-lv-trinity2': 'Orbit 51.2 V 280 Ah Lifepo4 Low Voltage Metal',
  'orbit-51v2-314ah-lv-trinity3': 'Orbit 51.2 V 314 Ah LiFePO4 Akü-Low Voltage-Metal',
  'orbit-6-2kw-offgrid-parallel': 'ORBİT 6.2 KW TAM SİNÜS OFFGRİD İNVERTER-12 PCS PARALLEL',
  'orbit-6-2kw-offgrid-non-parallel': 'ORBİT 6.2 KW TAM SİNÜS OFFGRİD İNVERTER-NON PARALLEL',
  'srp-5kw-offgrid-mf-lv': 'SRP 05 KW Monofaze Off-Grid',
  'deye-5kw-monofaze-hybrid': 'Deye 05 Kw Monofaze Hibrit Inverter',
  'deye-8kw-monofaze-hybrid': 'Deye 8 Kw Monofaze Hibrit',
  'srp-6kw-monofaze-hybrid-lv': 'SRP 06 KW Monofaze Hibrit',
  'deye-12kw-trifaze-hybrid': 'Deye 12 Kw Trifaze Hibrit',
  'deye-20kw-trifaze-hv': 'Deye 20 Kw High Voltage Trifaze',
  'deye-20kw-trifaze-lv': 'Deye 20 Kw Trifaze LV',
  'deye-25kw-trifaze-hv': 'Deye 25 Kw Trifaze HV',
  'deye-50kw-trifaze-hv': 'Deye 50 Kw High Voltage Trifaze Hibrit',
  'deye-80kw-trifaze-hv': 'DEYE 80 KW HIGH VOLTAGE TRİFAZE HİBRİT',
  'srp-15kw-trifaze-lv': 'SRP 15 KW Trifaze Hibrit LV',
  'srp-30kw-trifaze-hv': 'SRP 30 KW Trifaze Hibrit HV',
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    return await res.text()
  } catch (e) {
    console.error('Fetch error', url, e.message)
    return null
  }
}

function extractProductUrlFromSearch(html) {
  const match = html.match(/href="(https:\/\/orbitdepo\.com\/urun\/[^"]+)\/"/)
  return match ? match[1] + '/' : null
}

function extractImageUrlsFromProductPage(html) {
  const urls = new Set()
  // og:image
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (ogMatch) urls.add(ogMatch[1].trim())

  // img src (product / gallery - wp-content veya uploads)
  const imgRegex = /<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi
  let m
  while ((m = imgRegex.exec(html)) !== null) {
    const u = m[1].trim()
    if ((u.includes('orbitdepo.com') || u.startsWith('/')) && (u.includes('wp-content') || u.includes('uploads') || u.includes('.jpg') || u.includes('.png') || u.includes('.webp'))) {
      const full = u.startsWith('http') ? u : new URL(u, 'https://orbitdepo.com').href
      urls.add(full)
    }
  }
  return [...urls]
}

async function downloadImage(url, filePathWithoutExt) {
  try {
    const fullUrl = url.startsWith('http') ? url : new URL(url, 'https://orbitdepo.com').href
    const res = await fetch(fullUrl, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const ext = path.extname(new URL(fullUrl).pathname) || '.jpg'
    const base = filePathWithoutExt.replace(/\.[a-z]+$/i, '') || filePathWithoutExt
    const finalPath = base + (ext.startsWith('.') ? ext : '.' + ext)
    fs.mkdirSync(path.dirname(finalPath), { recursive: true })
    fs.writeFileSync(finalPath, buf)
    const rel = path.relative(path.join(ROOT, 'public'), finalPath).replace(/\\/g, '/')
    return rel.startsWith('/') ? rel : '/' + rel
  } catch (e) {
    console.error('Download error', url, e.message)
    return null
  }
}

async function processProduct(id, searchQuery) {
  const searchUrl = `https://orbitdepo.com/?s=${encodeURIComponent(searchQuery)}`
  const searchHtml = await fetchHtml(searchUrl)
  if (!searchHtml) return { id, paths: [], error: 'search_fetch_failed' }

  const productUrl = extractProductUrlFromSearch(searchHtml)
  if (!productUrl) return { id, paths: [], error: 'product_url_not_found' }

  const productHtml = await fetchHtml(productUrl)
  if (!productHtml) return { id, paths: [], error: 'product_fetch_failed' }

  const imageUrls = extractImageUrlsFromProductPage(productHtml)
  if (imageUrls.length === 0) return { id, paths: [], error: 'no_images' }

  const paths = []
  for (let i = 0; i < Math.min(imageUrls.length, 5); i++) {
    const outFile = path.join(OUT_DIR, `${id}-${i + 1}.jpg`)
    const rel = await downloadImage(imageUrls[i], path.join(OUT_DIR, `${id}-${i + 1}`))
    if (rel) paths.push(rel.startsWith('/') ? rel : '/' + rel)
  }
  return { id, paths }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('Görseller yazılıyor:', OUT_DIR)
  const results = {}
  const ids = Object.keys(SEARCH_QUERIES)
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const q = SEARCH_QUERIES[id]
    process.stdout.write(`[${i + 1}/${ids.length}] ${id} ... `)
    const r = await processProduct(id, q)
    results[id] = r.paths
    console.log(r.paths.length ? r.paths.length + ' image(s)' : (r.error || '0'))
    await new Promise((resolve) => setTimeout(resolve, 800))
  }
  fs.writeFileSync(MAP_PATH, JSON.stringify(results, null, 2))
  console.log('\nMap written to', MAP_PATH)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
