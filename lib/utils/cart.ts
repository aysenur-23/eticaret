/**
 * Cart Utilities
 * Handles cart calculations including VAT, shipping, MOQ validation, etc.
 */

import { Decimal } from '@prisma/client/runtime/library'

export interface CartItem {
  variantId: string
  quantity: number
  unitPrice: number
  vatRate: number
  moq?: number
  orderStep?: number
  availableStock?: number
}

export interface CartCalculationResult {
  items: Array<{
    variantId: string
    quantity: number
    unitPrice: number
    vatRate: number
    lineSubtotal: number
    lineVat: number
    lineTotal: number
  }>
  subtotal: number
  vatTotal: number
  shippingCost: number
  discount: number
  total: number
  errors: string[]
  warnings: string[]
}

export interface MOQValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate MOQ and order step requirements
 */
export function validateMOQAndStep(
  items: CartItem[]
): MOQValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  items.forEach((item) => {
    // MOQ validation
    if (item.moq && item.quantity < item.moq) {
      errors.push(
        `Minimum sipariş miktarı ${item.moq} adet. Seçilen: ${item.quantity} adet.`
      )
    }

    // Order step validation
    if (item.orderStep && item.orderStep > 1) {
      if (item.quantity % item.orderStep !== 0) {
        errors.push(
          `Sipariş miktarı ${item.orderStep}'in katı olmalıdır. Seçilen: ${item.quantity} adet.`
        )
      }
    }

    // Stock validation
    if (item.availableStock !== undefined && item.quantity > item.availableStock) {
      errors.push(
        `Yeterli stok yok. Mevcut: ${item.availableStock} adet, İstenen: ${item.quantity} adet.`
      )
    }

    // Low stock warning
    if (item.availableStock !== undefined && item.availableStock < 10 && item.availableStock > 0) {
      warnings.push(`Düşük stok uyarısı: Sadece ${item.availableStock} adet kaldı.`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Calculate cart totals with VAT
 */
export function calculateCartTotals(
  items: CartItem[],
  shippingCost: number = 0,
  discount: number = 0
): CartCalculationResult {
  const calculatedItems = items.map((item) => {
    const lineSubtotal = item.unitPrice * item.quantity
    const lineVat = lineSubtotal * (item.vatRate / 100)
    const lineTotal = lineSubtotal + lineVat

    return {
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      vatRate: item.vatRate,
      lineSubtotal: Math.round(lineSubtotal * 100) / 100,
      lineVat: Math.round(lineVat * 100) / 100,
      lineTotal: Math.round(lineTotal * 100) / 100,
    }
  })

  const subtotal = calculatedItems.reduce((sum, item) => sum + item.lineSubtotal, 0)
  const vatTotal = calculatedItems.reduce((sum, item) => sum + item.lineVat, 0)
  const total = subtotal + vatTotal + shippingCost - discount

  // Validate MOQ and stock
  const validation = validateMOQAndStep(items)

  return {
    items: calculatedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    vatTotal: Math.round(vatTotal * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    errors: validation.errors,
    warnings: validation.warnings,
  }
}

/**
 * Format price with VAT indicator
 */
export function formatPriceWithVAT(price: number, vatRate: number, includeVAT: boolean = true): string {
  const finalPrice = includeVAT ? price * (1 + vatRate / 100) : price
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(finalPrice)
}


