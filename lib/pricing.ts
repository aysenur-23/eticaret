/**
 * Fiyat hesaplama (konfigüratör). Stub / gerçek implementasyon burada.
 */

export interface PricingResult {
  subtotal: number
  total?: number
  [key: string]: unknown
}

export function computePricing(_config: unknown, _choices: unknown): PricingResult {
  return { subtotal: 0, total: 0 }
}
