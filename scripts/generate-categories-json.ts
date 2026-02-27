/**
 * Static export için ürünü olan kategorileri public/data/categories-with-products.json
 * olarak yazar. Build sırasında çalıştırılır; menü (header/sidebar) bu dosyayı kullanır.
 * Çalıştırma: npx tsx scripts/generate-categories-json.ts
 */

import fs from 'fs'
import path from 'path'
import { mockProducts } from '../lib/products-mock'
import { ALL_CATEGORY_VALUES } from '../lib/categories'

const rootDir = process.cwd()
const outPath = path.join(rootDir, 'public', 'data', 'categories-with-products.json')

const categoryValues = [
  ...new Set(mockProducts.map((p) => p.category).filter(Boolean)),
]
const list = categoryValues.length > 0 ? categoryValues : [...ALL_CATEGORY_VALUES]

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify({ categoryValues: list }, null, 2), 'utf8')
console.log('✅ public/data/categories-with-products.json yazıldı (' + list.length + ' kategori)')
