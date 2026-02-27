/**
 * Elektromarketim ürün sayfalarından ürün özellikleri tablosu ve açıklama metnini çeker.
 * Çıktı: scripts/elektromarketim-specs.json (SKU, fullDescription, specifications)
 * Kullanım: npx tsx scripts/fetch-elektromarketim-specs.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const BASE = 'https://www.elektromarketim.com'

/** products-mock'ta eşleşecek ürünler için URL listesi (benzersiz). HCB4010 + kategori sayfalarından çıkarılanlar. */
const PRODUCT_URLS: string[] = [
  `${BASE}/hims-hcb4010-elektrikli-arac-sarj-kablosu-cantasi`,
  `${BASE}/weidmuller-2791350000-ca-t2wb-55m-11/3p-r-bbg-istasyon-kablosu`,
  `${BASE}/hims-hcc-22t2-10-22kw-destekli-10m-elektrikli-arac-sarj-kablosu-115570`,
  `${BASE}/hims-hcc-22t2-7-22kw-destekli-7m-elektrikli-arac-sarj-kablosu-115569`,
  `${BASE}/hims-hctk-22-g-tf-22kw-tip-2-soketli-quiksiz-tasinabilir-elektrikli-arac-sarj-cihazi`,
  `${BASE}/hims-hctk-22-g-22kw-gumus-tasinabilir-elektrikli-arac-sarj-cihazi`,
  `${BASE}/hims-hcdkb-22-22kw-destekli-5m-kablolu-smart-beyaz-elektrikli-arac-sarj-istasyonu`,
  `${BASE}/hims-hcdks-22-siyah-22kw-5m-kablolu-smart-elektrikli-arac-sarj-istasyonu`,
  `${BASE}/hims-emef-22t2-sb-2-22kw-destekli-2m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-3-22kw-destekli-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-5-beyaz-soketli-22kw-siyah-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-7-beyaz-soketli-22kw-siyah-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-8-22kw-destekli-8m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-10-beyaz-soketli-22kw-siyah-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-15-22kw-destekli-15m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-16-22kw-destekli-16m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-20-22kw-destekli-20m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-2-siyah-soketli-22kw-siyah-2m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-3-siyah-soketli-22kw-siyah-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-5-siyah-soketli-22kw-siyah-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-7-siyah-soketli-22kw-siyah-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-8-siyah-soketli-22kw-siyah-8m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-10-siyah-soketli-22kw-siyah-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-15-siyah-soketli-22kw-siyah-15m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-16-siyah-soketli-22kw-siyah-16m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-20-siyah-soketli-22kw-siyah-20m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-tb-5-beyaz-soketli-22kw-turuncu-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-tb-7-beyaz-soketli-22kw-turuncu-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-tb-10-beyaz-soketli-22kw-turuncu-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-gb-5-beyaz-soketli-22kw-gri-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-gb-7-beyaz-soketli-22kw-gri-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-gb-10-beyaz-soketli-22kw-gri-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-yb-5-beyaz-soketli-22kw-yesil-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-yb-7-beyaz-soketli-22kw-yesil-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-yb-10-beyaz-soketli-22kw-yesil-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-mb-5-beyaz-soketli-22kw-mavi-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-mb-7-beyaz-soketli-22kw-mavi-7m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-mb-10-beyaz-soketli-22kw-mavi-10m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-gb-3-beyaz-soketli-22kw-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-tb-3-beyaz-soketli-22kw-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-yb-3-beyaz-soketli-22kw-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-mb-3-beyaz-soketli-22kw-3m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ts-5-siyah-soketli-22kw-turuncu-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-11t2-ss-5-11kw-tip-2-siyah-soketli-5m-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-10-22kw-tip-2-soketli-10m-cantali-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-10-22kw-tip-2-soketli-10m-cantali-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-7-22kw-tip-2-soketli-7m-cantali-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-7-22kw-tip-2-soketli-7m-cantali-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-ss-3-22kw-tip-2-soketli-3m-cantali-elektrikli-arac-sarj-kablosu`,
  `${BASE}/hims-emef-22t2-sb-3-22kw-tip-2-soketli-3m-cantali-elektrikli-arac-sarj-kablosu`,
]

export interface ScrapedProduct {
  url: string
  sku: string
  fullDescription: string
  specifications: Record<string, string>
  features?: string[]
}

/** URL slug'ından veya HTML'deki "Ürün Kodu"ndan SKU türet. */
function skuFromUrl(url: string): string {
  const pathname = url.replace(BASE, '').replace(/^\//, '')
  // hims-hcb4010-... -> HCB4010
  if (pathname.includes('hcb4010')) return 'HCB4010'
  // weidmuller-2791350000-... -> 2791350000
  if (pathname.startsWith('weidmuller-2791350000')) return '2791350000'
  // hims-hcc-22t2-10-... veya ...-115570 -> HCC-22T2-10
  if (pathname.includes('hcc-22t2-10')) return 'HCC-22T2-10'
  if (pathname.includes('hcc-22t2-7')) return 'HCC-22T2-7'
  if (pathname.includes('hctk-22-g-tf')) return 'HCTK-22-G-TF'
  if (pathname.includes('hctk-22-g-22kw')) return 'HCTK-22-G'
  if (pathname.includes('hcdkb-22')) return 'HCDKB-22'
  if (pathname.includes('hcdks-22')) return 'HCDKS-22'
  // EMEF-22T2-XY-N
  const emefMatch = pathname.match(/emef-22t2-(sb|ss|tb|gb|yb|mb|ts)-(\d+)/i)
  if (emefMatch) return `EMEF-22T2-${emefMatch[1].toUpperCase()}-${emefMatch[2]}`
  const emef11Match = pathname.match(/emef-11t2-ss-5/i)
  if (emef11Match) return 'EMEF-11T2-SS-5'
  return pathname.split('-').slice(0, 5).join('-').toUpperCase()
}

/** HTML'den "Ürün Kodu : XXX" çıkar. */
function parseProductCode(html: string): string | null {
  const m = html.match(/Ürün\s*Kodu\s*[:\s]*([A-Za-z0-9-]+)/i)
  return m ? m[1].trim() : null
}

const CSS_LIKE_KEYS = /^(left|right|width|height|color|padding|margin|display|position|top|bottom|url|https|float|align|background|size|weight|radius|overflow|shadow|type|dataType|success|error|scrollTop|day|month|year|slideCtrl|showCtrl|wrapCtrl|nextBtn|prevBtn|changeOnMouse|slidePaging|wrapPaging|changeFn|slideType|slideMove|slideDirection|visibleItem|touchEnabled|zoomType|easing|scrollZoom|zoomWindowPosition|productThumbs|pWin|email|item|ftitle|spacing|decoration)$/i

/** Ürün özellik tablosu başlıkları (Şarj Kablosu Özellikleri, Çanta Özellikleri, Ürün Özellikleri). */
const SPEC_SECTION_HEADERS = /(Şarj\s*Kablosu\s*Özellikleri|Çanta\s*Özellikleri|Ürün\s*Özellikleri)/gi

/** Geçerli teknik özellik anahtarları (Türkçe ürün alanları). */
const VALID_SPEC_KEYS = /^(Çalışma\s*Akımı|Güç\s*Aktarım\s*Kapasitesi|Çalışma\s*Gerilimi|Çalışma\s*Frekansı|Çalışma\s*Sıcaklığı|Nem|Kontak\s*Kaplama|İletken|Depolama\s*Sıcaklığı|Ürün\s*Kablo\s*Uzunluğu|Ürün\s*Kablo\s*Kesiti|Ölçü|Kumaş\s*Tipi|Kumaş|Model|Marka|Ürün\s*Modeli|Gerilim|Güç|Uzunluk|Renk|Tip|Soket|Uygun|Montaj|Ağırlık|Boyut|Garanti|Fiyat|Kapasite|Dış|İç|Kablo|Beden|Adet|Faz\s*Sayısı|Nominal\s*Gerilim|Maksimum\s*Çıkış|Standart|Sertifika|Led|Kaçak\s*Akım|Akım\s*Ayarı|RFID|Wifi|Koruma\s*Derecesi|Soğutma|Beklemede\s*Kullandığı)$/i

/**
 * HTML'den teknik özellik tablolarını parse et.
 * "Şarj Kablosu Özellikleri", "Çanta Özellikleri", "Ürün Özellikleri" başlıklı bölümlerdeki
 * "Anahtar : Değer" satırlarını toplar.
 */
function parseSpecifications(html: string): Record<string, string> {
  const specs: Record<string, string> = {}
  // Önce tüm özellik bölümlerini bul (Şarj Kablosu Özellikleri, Çanta Özellikleri, Ürün Özellikleri)
  const sectionStarts: number[] = []
  let match: RegExpExecArray | null
  const re = new RegExp(SPEC_SECTION_HEADERS.source, 'gi')
  while ((match = re.exec(html)) !== null) sectionStarts.push(match.index)
  const sections: string[] = []
  for (let i = 0; i < sectionStarts.length; i++) {
    const start = sectionStarts[i]
    const end = sectionStarts[i + 1] ?? html.length
    sections.push(html.slice(start, Math.min(start + 4000, end)))
  }
  // Eğer başlık bulunamadıysa eski davranış: "Ürün Özellikleri" ile tek blok
  if (sections.length === 0) {
    const fallback = html.match(/Ürün\s*Özellikleri\s*<\/[^>]+>[\s\S]*?(?=Ürün\s*Etiketleri|<\/table|$)/i)?.[0]
      || html.match(/Ürün\s*Özellikleri[\s\S]*?(?=Ürün\s*Etiketleri|$)/i)?.[0] || ''
    sections.push(fallback)
  }
  const rowRegex = /([\w\s\u00C0-\u017F\/]+?)\s*:\s*([^\n<]+?)(?=\s*[\n<]|$)/g
  for (const section of sections) {
    let m
    while ((m = rowRegex.exec(section)) !== null) {
      const key = m[1].replace(/\s+/g, ' ').trim()
      const value = m[2].replace(/\s+/g, ' ').trim()
      if (!key || !value || key.length < 2 || key.length > 80) continue
      if (key.startsWith('Ürün Etiket') || /^Örn\.?$/i.test(key) || key === 'Ana Kapsayıcı') continue
      if (CSS_LIKE_KEYS.test(key) || value.includes('px') || value.includes('!important') || value.includes('function') || value.includes('=>')) continue
      if (/^[a-z]+$/.test(key) && key.length < 10) continue
      if (value.length > 200) continue
      if (/[\u00C0-\u017F]/.test(key) || VALID_SPEC_KEYS.test(key)) specs[key] = value
    }
  }
  return specs
}

const JUNK_PATTERNS = /(\d{1,2}\.\d{2}\s*₺|Sepete Ekle|Hemen Al|Adet\s*$|Kargoda|Gelince Haber Ver|HAVALE|İNDİRİM|Bayilerimizi|Planlanan Teslimat|Yarın|ÜCRETSİZ KARGO|ÖZEL TEKLİF|Menüyü Kapat|Kategoriler|Anasayfa Aydınlatma|Özel indirimlerden|Fırsatlarla dolu|schema\.org|productId|aggregateRating|Kişisel verilerin|Aydınlatma ve Rıza|Daha Sonra Evet|Mobil uygulamamız|Çalışma Saatleri|destek@elektromarketim)/gi

/**
 * HTML'den detaylı ürün açıklamasını al.
 * Hedef: (1) Ürün başlığı + paket notu, (2) Kablo açıklaması (Hims 22kW Xm Araç Şarj Kablosu),
 * (3) Çanta açıklaması (Hims Araç Şarj Kablo Çantası). "Şarj Kablosu Özellikleri" tablosundan önce kes.
 */
function parseFullDescription(html: string): string {
  const stripTags = (s: string) =>
    s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

  const endMarker = /Şarj\s*Kablosu\s*Özellikleri|Çanta\s*Özellikleri|Ürünün\s*Tüm\s*Özellikleri|Ürün\s*Özellikleri\s*<\/[^>]+>/i
  const endIdx = html.search(endMarker)
  const beforeSpecs = endIdx >= 0 ? html.slice(0, endIdx) : html
  let block = stripTags(beforeSpecs)

  let out = block.replace(JUNK_PATTERNS, ' ').replace(/\s+/g, ' ').trim()
  const parts = out.split(/\s*-->\s*/)
  const descPart = parts.find((p) => p.length > 100 && (p.includes('elektrikli araç') || p.includes('şarj') || p.includes('Hims') || p.includes('paket içeriğinde')))
  if (descPart) out = descPart.replace(JUNK_PATTERNS, ' ').replace(/\s+/g, ' ').trim()

  if (!/[\u00C0-\u017F]/.test(out) || out.length < 60) return ''
  if (out.length > 4000) out = out.slice(0, 4000) + '…'
  return out
}

/** ✓ ile başlayan maddeleri features dizisine çıkar. */
function parseFeatures(html: string): string[] {
  const features: string[] = []
  const block = html.match(/Ürün\s*Özellikleri[\s\S]*?(?=Ürün\s*Özellikleri\s*$|Ürün\s*Etiketleri)/i)?.[0] || html
  const regex = /✓\s*([^\n<✓]+)/g
  let m
  while ((m = regex.exec(block)) !== null) {
    const t = m[1].replace(/\s+/g, ' ').trim()
    if (t.length > 10) features.push(t)
  }
  return features
}

async function fetchOne(url: string): Promise<ScrapedProduct | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    if (!res.ok) return null
    const html = await res.text()
    const code = parseProductCode(html)
    const sku = code || skuFromUrl(url)
    const specifications = parseSpecifications(html)
    const fullDescription = parseFullDescription(html)
    const features = parseFeatures(html)
    return { url, sku, fullDescription, specifications, features: features.length ? features : undefined }
  } catch (e) {
    console.error('Fetch error', url, e)
    return null
  }
}

async function main() {
  const outPath = path.join(__dirname, 'elektromarketim-specs.json')
  const results: ScrapedProduct[] = []
  const uniqueUrls = [...new Set(PRODUCT_URLS)]

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i]
    process.stdout.write(`[${i + 1}/${uniqueUrls.length}] ${url.slice(BASE.length)}...`)
    const data = await fetchOne(url)
    if (data) {
      results.push(data)
      console.log(' OK')
    } else {
      console.log(' FAIL')
    }
    await new Promise((r) => setTimeout(r, 800))
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8')
  console.log(`\nWrote ${results.length} products to ${outPath}`)
}

main().catch(console.error)
