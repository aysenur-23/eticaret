/**
 * electromarketim-by-url altındaki aciklama.json verilerini siteye uygular:
 * - Mevcut mock ürünleri (SKU ile eşleşen) günceller (fullDescription, specifications, features, images, productFamilyKey).
 * - Mock'ta olmayan SKU'lar için lib/products-mock-electromarketim.ts üretir ve görselleri public/images/products/ altına kopyalar.
 *
 * Kullanım: npx tsx scripts/apply-electromarketim-by-url-to-mock.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const BY_URL_DIR = path.join(__dirname, 'electromarketim-by-url')
const MOCK_PATH = path.join(__dirname, '..', 'lib', 'products-mock.ts')
const ELECTROMARKETIM_MOCK_PATH = path.join(__dirname, '..', 'lib', 'products-mock-electromarketim.ts')
const PUBLIC_IMAGES = path.join(__dirname, '..', 'public', 'images', 'products')

interface Aciklama {
  url: string
  sku: string
  title: string
  fullDescription?: string
  specifications?: Record<string, string>
  features?: string[]
}

/** Aynı modelin farklı renk/varyantlarını gruplamak için base key (örn. EMEF-11T2-SS-5 → EMEF-11T2). */
function deriveProductFamilyKey(sku: string): string {
  const parts = sku.split('-')
  if (parts.length >= 3 && /^\d+$/.test(parts[parts.length - 1]) && /^[A-Za-z]{2,3}$/.test(parts[parts.length - 2])) {
    return parts.slice(0, -2).join('-')
  }
  return sku
}

/** Mock product id (slug): hims-xxx veya elektromarketim-xxx. */
function slugFromSku(sku: string, title: string): string {
  const prefix = /hims/i.test(title || sku) ? 'hims-' : 'elektromarketim-'
  const slug = sku.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return prefix + slug
}

function escapeSingleQuotes(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function isCleanDescription(s: string | undefined): boolean {
  if (!s || s.length < 40 || s.length > 8000) return false
  if (s.includes('Menüyü Kapat') || s.includes('Kategoriler Anasayfa')) return false
  return /[\u00C0-\u017F]/.test(s)
}

function cleanSpecs(specs: Record<string, string> | undefined): Record<string, string> {
  if (!specs) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(specs)) {
    if (k === 'Ana Kapsayıcı' || k === 'Örn') continue
    if (v.includes('*/') || v.length > 200) continue
    out[k] = v
  }
  return out
}

function specToTs(specs: Record<string, string>): string {
  if (Object.keys(specs).length === 0) return '{}'
  const lines = Object.entries(specs).map(([k, v]) => `      '${escapeSingleQuotes(k)}': '${escapeSingleQuotes(v)}'`)
  return `{\n${lines.join(',\n')}\n    }`
}

/** products-mock.ts içindeki tüm sku değerlerini döndürür. */
function getExistingMockSkus(mockContent: string): Set<string> {
  const set = new Set<string>()
  const re = /sku:\s*['"]([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(mockContent)) !== null) set.add(m[1])
  return set
}

/** electromarketim-by-url altındaki tüm aciklama.json dosya yollarını döndürür. */
function listAciklamaPaths(): string[] {
  if (!fs.existsSync(BY_URL_DIR)) return []
  const dirs = fs.readdirSync(BY_URL_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())
  const out: string[] = []
  for (const d of dirs) {
    const p = path.join(BY_URL_DIR, d.name, 'aciklama.json')
    if (fs.existsSync(p)) out.push(p)
  }
  return out
}

/** Görselleri productDir'den public/images/products/{id}-1.jpg ... olarak kopyalar; dönen paths. */
function copyProductImages(productDir: string, id: string): string[] {
  const out: string[] = []
  const files = fs.readdirSync(productDir).filter((f) => /^\d+\.(jpg|jpeg|png|webp)$/i.test(f))
  const sorted = files.sort((a, b) => {
    const nA = parseInt(a.replace(/\D/g, ''), 10) || 0
    const nB = parseInt(b.replace(/\D/g, ''), 10) || 0
    return nA - nB
  })
  fs.mkdirSync(PUBLIC_IMAGES, { recursive: true })
  for (let i = 0; i < sorted.length; i++) {
    const ext = path.extname(sorted[i])
    const destName = `${id}-${i + 1}${ext}`
    const destPath = path.join(PUBLIC_IMAGES, destName)
    fs.copyFileSync(path.join(productDir, sorted[i]), destPath)
    out.push(`/images/products/${destName}`)
  }
  return out
}

/** Mock dosyasında sku'ya ait bloğu günceller (fullDescription, specifications, features, images, productFamilyKey). */
function patchMockForSku(
  mockContent: string,
  sku: string,
  updates: {
    fullDescription?: string
    specifications?: Record<string, string>
    features?: string[]
    images?: string[]
    productFamilyKey?: string
  }
): string {
  const skuIndex = mockContent.indexOf(`sku: '${sku}'`)
  if (skuIndex === -1) return mockContent

  const blockStart = mockContent.lastIndexOf('\n  {', skuIndex)
  const blockEnd = mockContent.indexOf('\n  },', skuIndex) + 4
  if (blockStart === -1 || blockEnd <= blockStart) return mockContent

  let block = mockContent.slice(blockStart, blockEnd)

  if (updates.fullDescription !== undefined && isCleanDescription(updates.fullDescription)) {
    const escaped = escapeSingleQuotes(updates.fullDescription)
    block = block.replace(/fullDescription:\s*'((?:[^'\\]|\\.)*)'/, `fullDescription: '${escaped}'`)
  }

  if (updates.specifications !== undefined && Object.keys(updates.specifications).length > 0) {
    const specTs = specToTs(updates.specifications)
    block = block.replace(/specifications:\s*\{[\s\S]*?\},?\s*\n/, `specifications: ${specTs},\n`)
  }

  if (updates.features !== undefined && updates.features.length > 0) {
    const featLines = updates.features.map((f) => `      '${escapeSingleQuotes(f)}'`)
    const featBlock = `[\n${featLines.join(',\n')}\n    ]`
    block = block.replace(/features:\s*\[[\s\S]*?\],?\s*\n/, `features: ${featBlock},\n`)
  }

  if (updates.images !== undefined && updates.images.length > 0) {
    const imgLines = updates.images.map((u) => `      '${escapeSingleQuotes(u)}'`)
    const imgBlock = `[\n${imgLines.join(',\n')}\n    ]`
    if (block.includes('images:')) {
      block = block.replace(/images:\s*\[[\s\S]*?\],?\s*\n/, `images: ${imgBlock},\n`)
    } else {
      block = block.replace(/(\s+)(image:)/, `$1images: ${imgBlock},\n$1$2`)
    }
    if (block.includes('image:') && updates.images[0]) {
      block = block.replace(/image:\s*'[^']*'/, `image: '${escapeSingleQuotes(updates.images[0])}'`)
    }
  }

  if (updates.productFamilyKey !== undefined) {
    if (block.includes('productFamilyKey:')) {
      block = block.replace(/productFamilyKey:\s*'[^']*'/, `productFamilyKey: '${escapeSingleQuotes(updates.productFamilyKey)}'`)
    } else {
      block = block.replace(/(\s+)(category:)/, `$1productFamilyKey: '${escapeSingleQuotes(updates.productFamilyKey)}',\n$1$2`)
    }
  }

  return mockContent.slice(0, blockStart) + block + mockContent.slice(blockEnd)
}

/** Yeni ürün için TypeScript nesne kodu üretir. */
function toMockProductTs(aciklama: Aciklama, id: string, imagePaths: string[], productFamilyKey: string): string {
  const name = aciklama.title || aciklama.sku
  const specs = cleanSpecs(aciklama.specifications)
  const specTs = Object.keys(specs).length > 0 ? specToTs(specs) : '{}'
  const features = (aciklama.features || []).filter((f) => f.length > 2)
  const featTs =
    features.length > 0
      ? `[\n${features.map((f) => `      '${escapeSingleQuotes(f)}'`).join(',\n')}\n    ]`
      : '[]'
  const imgTs =
    imagePaths.length > 0
      ? `[\n${imagePaths.map((u) => `      '${escapeSingleQuotes(u)}'`).join(',\n')}\n    ]`
      : '[]'
  const fullDesc = isCleanDescription(aciklama.fullDescription) ? escapeSingleQuotes(aciklama.fullDescription!) : ''

  return `  {
    id: '${escapeSingleQuotes(id)}',
    sku: '${escapeSingleQuotes(aciklama.sku)}',
    name: '${escapeSingleQuotes(name)}',
    description: '${escapeSingleQuotes((aciklama.fullDescription || '').slice(0, 200))}',
    fullDescription: '${fullDesc}',
    specifications: ${specTs},
    features: ${featTs},
    image: ${imagePaths[0] ? `'${escapeSingleQuotes(imagePaths[0])}'` : 'undefined'},
    images: ${imgTs},
    productFamilyKey: '${escapeSingleQuotes(productFamilyKey)}',
    price: 0,
    category: 'Elektrikli Araç Şarj ve V2L',
    stock: 0,
    featured: false,
    isVariantProduct: false,
  }`
}

function main() {
  const aciklamaPaths = listAciklamaPaths()
  if (aciklamaPaths.length === 0) {
    console.log('electromarketim-by-url altında aciklama.json bulunamadı.')
    return
  }

  let mockContent = fs.readFileSync(MOCK_PATH, 'utf-8')
  const existingSkus = getExistingMockSkus(mockContent)
  const newProductsTs: string[] = []
  let patched = 0

  for (const aciklamaPath of aciklamaPaths) {
    const productDir = path.dirname(aciklamaPath)
    const aciklama: Aciklama = JSON.parse(fs.readFileSync(aciklamaPath, 'utf-8'))
    const sku = aciklama.sku
    const id = slugFromSku(sku, aciklama.title || '')
    const productFamilyKey = deriveProductFamilyKey(sku)
    const imagePaths = copyProductImages(productDir, id)

    if (existingSkus.has(sku)) {
      mockContent = patchMockForSku(mockContent, sku, {
        fullDescription: aciklama.fullDescription,
        specifications: cleanSpecs(aciklama.specifications),
        features: aciklama.features,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        productFamilyKey,
      })
      patched++
    } else {
      newProductsTs.push(toMockProductTs(aciklama, id, imagePaths, productFamilyKey))
    }
  }

  if (patched > 0) {
    fs.writeFileSync(MOCK_PATH, mockContent, 'utf-8')
    console.log(`Mock'ta ${patched} ürün güncellendi.`)
  }

  const electromarketimContent = `/**
 * Elektromarketim'den çekilen ürünler (apply-electromarketim-by-url-to-mock.ts ile üretilir).
 * products-mock.ts bu diziyi mockProducts ile birleştirir.
 */

import type { MockProduct } from './products-mock'

export const mockProductsElectromarketim: MockProduct[] = [
${newProductsTs.join(',\n')}
]
`
  fs.writeFileSync(ELECTROMARKETIM_MOCK_PATH, electromarketimContent, 'utf-8')
  console.log(`products-mock-electromarketim.ts: ${newProductsTs.length} yeni ürün yazıldı.`)
  console.log('Toplam:', aciklamaPaths.length, 'ürün işlendi.')
}

main()
