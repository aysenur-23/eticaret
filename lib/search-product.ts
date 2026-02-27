/**
 * Ürün araması için ortak helper'lar.
 * Türkçe karakter normalizasyonu ve aranacak metin oluşturma.
 */

export type ProductLike = {
  id?: string
  name?: string
  description?: string
  category?: string
  sku?: string
  tags?: string[]
  brand?: string
  slogan?: string
  fullDescription?: string
  specifications?: Record<string, string>
}

/** Arama için Türkçe karakterleri normalize eder (ı→i, ğ→g, ş→s, ü→u, ö→o, ç→c). */
export function normalizeForSearch(str: string): string {
  if (!str || typeof str !== 'string') return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
}

/** Ürünün aranacak tek metnini oluşturur (name, description, brand, slogan, fullDescription, specifications). */
export function buildSearchableText(product: ProductLike): string {
  const parts: string[] = [
    product.name,
    product.description,
    product.category,
    product.sku,
    product.id,
    product.brand,
    product.slogan,
    product.fullDescription,
    ...(product.tags || []),
  ].filter(Boolean) as string[]

  if (product.specifications && typeof product.specifications === 'object') {
    const specText = Object.entries(product.specifications)
      .flat()
      .filter(Boolean)
      .join(' ')
    if (specText) parts.push(specText)
  }

  return parts.join(' ')
}

/** Normalize edilmiş arama metni, normalize edilmiş searchableText içinde geçiyor mu? */
export function productMatchesQuery(product: ProductLike, query: string): boolean {
  const q = normalizeForSearch(query)
  if (!q) return true
  const text = buildSearchableText(product)
  const normalizedText = normalizeForSearch(text)
  return normalizedText.includes(q)
}
