/**
 * Site kataloğu: mockProducts + ProductOverride + StockOverride merge.
 * Admin catalog API ve public products API bu helper'ı kullanır.
 */

import { mockProducts, type MockProduct } from '@/lib/products-mock'
import { prisma } from '@/lib/prisma'

export type MergedProduct = MockProduct & { id: string }

function applyOverride(base: MergedProduct, override: {
  name?: string | null
  slug?: string | null
  description?: string | null
  fullDescription?: string | null
  price?: number | null
  image?: string | null
  images?: unknown
  category?: string | null
  stock?: number | null
  featured?: boolean | null
  specifications?: unknown
  features?: unknown
  variants?: unknown
  brand?: string | null
  sku?: string | null
  tags?: unknown
  slogan?: string | null
  warranty?: string | null
}): void {
  if (override.name != null) base.name = override.name
  if (override.slug != null) base.slug = override.slug
  if (override.description != null) base.description = override.description
  if (override.fullDescription != null) base.fullDescription = override.fullDescription
  if (override.price != null) base.price = override.price
  if (override.image != null) base.image = override.image
  if (override.images != null) base.images = override.images as string[] | undefined
  if (override.category != null) base.category = override.category
  if (override.stock != null) base.stock = override.stock
  if (override.featured != null) base.featured = override.featured
  if (override.specifications != null) base.specifications = override.specifications as Record<string, string> | undefined
  if (override.features != null) base.features = override.features as string[] | undefined
  if (override.variants != null) base.variants = override.variants as MockProduct['variants']
  if (override.brand != null) base.brand = override.brand
  if (override.sku != null) base.sku = override.sku
  if (override.tags != null) base.tags = override.tags as string[] | undefined
  if (override.slogan != null) base.slogan = override.slogan
  if (override.warranty != null) base.warranty = override.warranty
}

/** Mock product'tan MergedProduct kopyası (override uygulanmamış). */
function mockToMerged(p: MockProduct): MergedProduct {
  return {
    ...p,
    id: p.id,
  }
}

/** ProductOverride kaydından sadece override'ta olan (yeni) ürün için MergedProduct üretir. */
function overrideOnlyToMerged(override: {
  productId: string
  name?: string | null
  slug?: string | null
  description?: string | null
  fullDescription?: string | null
  price?: number | null
  image?: string | null
  images?: unknown
  category?: string | null
  stock?: number | null
  featured?: boolean | null
  specifications?: unknown
  features?: unknown
  variants?: unknown
  brand?: string | null
  sku?: string | null
  tags?: unknown
  slogan?: string | null
  warranty?: string | null
}): MergedProduct {
  const id = override.productId
  return {
    id,
    sku: override.sku ?? id,
    name: override.name ?? 'İsimsiz ürün',
    description: override.description ?? '',
    price: override.price ?? 0,
    image: override.image ?? undefined,
    images: override.images as string[] | undefined,
    category: override.category ?? 'Taşınabilir Şarj İstasyonları',
    stock: override.stock ?? 0,
    featured: override.featured ?? false,
    isVariantProduct: Array.isArray(override.variants) && override.variants.length > 0,
    fullDescription: override.fullDescription,
    features: override.features as string[] | undefined,
    specifications: override.specifications as Record<string, string> | undefined,
    variants: override.variants as MockProduct['variants'],
    brand: override.brand ?? undefined,
    tags: override.tags as string[] | undefined,
    slogan: override.slogan,
    warranty: override.warranty,
  }
}

/**
 * Tüm ürünleri mock + ProductOverride + StockOverride ile birleştirir.
 * Sadece ProductOverride'da olan (mock'ta olmayan) ürünler de listeye eklenir.
 */
export async function getMergedProducts(): Promise<MergedProduct[]> {
  const [overrides, stockOverrides] = await Promise.all([
    prisma.productOverride.findMany({ orderBy: { productId: 'asc' } }),
    prisma.stockOverride.findMany(),
  ])

  const stockMap = new Map(stockOverrides.map((s) => [s.productId, s.stock]))
  const overrideMap = new Map(overrides.map((o) => [o.productId, o]))

  const mockIds = new Set(mockProducts.map((p) => p.id))
  const result: MergedProduct[] = []

  for (const mock of mockProducts) {
    const merged = mockToMerged(mock)
    const override = overrideMap.get(mock.id)
    if (override) {
      applyOverride(merged, override)
      overrideMap.delete(mock.id)
    }
    const stockOverride = stockMap.get(mock.id)
    if (stockOverride != null) merged.stock = stockOverride
    result.push(merged)
  }

  for (const [, override] of overrideMap) {
    const merged = overrideOnlyToMerged(override)
    const stockOverride = stockMap.get(override.productId)
    if (stockOverride != null) merged.stock = stockOverride
    result.push(merged)
  }

  return result
}

/**
 * Tek ürünü id ile getirir (mock + override + stock). Yoksa null.
 */
export async function getMergedProductById(productId: string): Promise<MergedProduct | null> {
  const mock = mockProducts.find((p) => p.id === productId)
  const [override, stockRow] = await Promise.all([
    prisma.productOverride.findUnique({ where: { productId } }),
    prisma.stockOverride.findUnique({ where: { productId } }),
  ])

  if (mock) {
    const merged = mockToMerged(mock)
    if (override) applyOverride(merged, override)
    if (stockRow != null) merged.stock = stockRow.stock
    return merged
  }

  if (override) {
    const merged = overrideOnlyToMerged(override)
    if (stockRow != null) merged.stock = stockRow.stock
    return merged
  }

  return null
}
