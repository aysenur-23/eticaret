/**
 * elektromarketim-specs.json içeriğini lib/products-mock.ts içindeki ilgili ürünlere uygular.
 * Sadece temiz fullDescription ve geçerli specifications uygulanır.
 * Kullanım: npx tsx scripts/apply-elektromarketim-to-mock.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { mockProducts, MANUAL_PRODUCT_IDS } from '../lib/products-mock'

const SPECS_PATH = path.join(__dirname, 'elektromarketim-specs.json')
const MOCK_PATH = path.join(__dirname, '..', 'lib', 'products-mock.ts')

/** Manuel ürünlerin SKU listesi; çekilen veriyle güncellenmez (MANUAL_PRODUCT_IDS ile tutarlı). */
const SKIP_SKUS = [...new Set(MANUAL_PRODUCT_IDS.map((id) => mockProducts.find((p) => p.id === id)?.sku).filter(Boolean))] as string[]

interface Scraped {
  url: string
  sku: string
  fullDescription: string
  specifications: Record<string, string>
  features?: string[]
}

function escapeSingleQuotes(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function isCleanDescription(s: string): boolean {
  if (!s || s.length < 40 || s.length > 1200) return false
  if (s.includes('Menüyü Kapat') || s.includes('Kategoriler Anasayfa')) return false
  if (s.includes('Özel indirimlerden ilk siz haberdar')) return false
  return /[\u00C0-\u017F]/.test(s)
}

function cleanSpecs(specs: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(specs)) {
    if (k === 'Ana Kapsayıcı' || k === 'Örn') continue
    if (v.includes('*/') || v.includes('schema.org')) continue
    if (v.length > 200) continue
    out[k] = v
  }
  return out
}

function specToTs(specs: Record<string, string>): string {
  if (Object.keys(specs).length === 0) return '{}'
  const lines = Object.entries(specs).map(([k, v]) => `      '${escapeSingleQuotes(k)}': '${escapeSingleQuotes(v)}'`)
  return `{\n${lines.join(',\n')}\n    }`
}

function main() {
  const data = JSON.parse(fs.readFileSync(SPECS_PATH, 'utf-8')) as Scraped[]
  let mock = fs.readFileSync(MOCK_PATH, 'utf-8')
  let applied = 0

  for (const item of data) {
    if (SKIP_SKUS.includes(item.sku)) continue
    const cleanDesc = isCleanDescription(item.fullDescription) ? item.fullDescription : null
    const specs = cleanSpecs(item.specifications)
    const hasSpecs = Object.keys(specs).length > 0
    if (!cleanDesc && !hasSpecs) continue

    const skuPattern = new RegExp(`sku:\\s*['"]${item.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')
    if (!skuPattern.test(mock)) continue

    const skuIndex = mock.indexOf(`sku: '${item.sku}'`)
    if (skuIndex === -1) continue

    const blockStart = mock.lastIndexOf('\n  {', skuIndex)
    const blockEnd = mock.indexOf('\n  },', skuIndex) + 4
    if (blockStart === -1 || blockEnd <= blockStart) continue
    let block = mock.slice(blockStart, blockEnd)
    let changed = false

    if (cleanDesc) {
      const fullDescRegex = /fullDescription:\s*'((?:[^'\\]|\\.)*)'/
      if (fullDescRegex.test(block)) {
        const escaped = escapeSingleQuotes(cleanDesc)
        block = block.replace(fullDescRegex, `fullDescription: '${escaped}'`)
        changed = true
      }
    }

    if (hasSpecs) {
      const specRegex = /specifications:\s*\{[\s\S]*?\},?\s*\n/
      if (specRegex.test(block)) {
        block = block.replace(specRegex, `specifications: ${specToTs(specs)}`)
        changed = true
      }
    }

    if (changed) {
      mock = mock.slice(0, blockStart) + block + mock.slice(blockEnd)
      applied++
    }
  }

  fs.writeFileSync(MOCK_PATH, mock, 'utf-8')
  console.log(`Applied ${applied} product updates to products-mock.ts`)
}

main()
