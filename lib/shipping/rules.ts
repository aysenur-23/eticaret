/**
 * Shipping Rules Engine
 * Calculates shipping costs based on weight, volume, category, and other factors
 */

export interface ShippingRule {
  id: string
  name: string
  priority: number // Higher priority rules are evaluated first
  conditions: {
    weightMin?: number // grams
    weightMax?: number // grams
    volumeMin?: number // cm³
    volumeMax?: number // cm³
    categoryIds?: string[]
    isDangerous?: boolean // For batteries, hazardous materials
    isFragile?: boolean
  }
  cost: {
    base: number // Base shipping cost
    perKg?: number // Additional cost per kg
    perVolume?: number // Additional cost per cm³
    freeThreshold?: number // Free shipping if order total >= this
  }
  carriers?: string[] // Available carriers for this rule
}

export interface ShippingCalculationInput {
  items: Array<{
    weightG: number
    volumeCm3?: number
    categoryId?: string
    isDangerous?: boolean
    isFragile?: boolean
  }>
  orderTotal: number
  shippingAddress: {
    city: string
    district?: string
    country: string
  }
}

export interface ShippingCalculationResult {
  cost: number
  estimatedDays: number
  carrier?: string
  ruleId: string
  freeShipping: boolean
}

// Default shipping rules
const defaultRules: ShippingRule[] = [
  {
    id: 'free_shipping',
    name: 'Ücretsiz Kargo',
    priority: 100,
    conditions: {},
    cost: {
      base: 0,
      freeThreshold: 1000, // 1000 TL üzeri ücretsiz
    },
  },
  {
    id: 'standard',
    name: 'Standart Kargo',
    priority: 50,
    conditions: {
      weightMax: 5000, // 5 kg
    },
    cost: {
      base: 50,
      perKg: 5,
    },
  },
  {
    id: 'heavy',
    name: 'Ağır Paket',
    priority: 60,
    conditions: {
      weightMin: 5000,
      weightMax: 20000, // 20 kg
    },
    cost: {
      base: 100,
      perKg: 8,
    },
  },
  {
    id: 'dangerous',
    name: 'Tehlikeli Madde (Akü)',
    priority: 90,
    conditions: {
      isDangerous: true,
    },
    cost: {
      base: 150,
      perKg: 10,
    },
  },
]

export class ShippingRulesEngine {
  private rules: ShippingRule[]

  constructor(customRules?: ShippingRule[]) {
    this.rules = customRules || defaultRules
    // Sort by priority (descending)
    this.rules.sort((a, b) => b.priority - a.priority)
  }

  calculate(input: ShippingCalculationInput): ShippingCalculationResult {
    const totalWeight = input.items.reduce((sum, item) => sum + item.weightG, 0)
    const totalVolume = input.items.reduce((sum, item) => sum + (item.volumeCm3 || 0), 0)
    const hasDangerous = input.items.some((item) => item.isDangerous)
    const hasFragile = input.items.some((item) => item.isFragile)

    // Check free shipping threshold first
    const freeShippingRule = this.rules.find(
      (rule) => rule.cost.freeThreshold && input.orderTotal >= rule.cost.freeThreshold
    )

    if (freeShippingRule) {
      return {
        cost: 0,
        estimatedDays: 3,
        ruleId: freeShippingRule.id,
        freeShipping: true,
      }
    }

    // Find matching rule
    for (const rule of this.rules) {
      if (this.matchesRule(rule, input, totalWeight, totalVolume, hasDangerous, hasFragile)) {
        const cost = this.calculateCost(rule, totalWeight, totalVolume)
        return {
          cost,
          estimatedDays: this.estimateDays(rule, input.shippingAddress),
          carrier: rule.carriers?.[0],
          ruleId: rule.id,
          freeShipping: false,
        }
      }
    }

    // Default fallback
    return {
      cost: 100,
      estimatedDays: 5,
      ruleId: 'default',
      freeShipping: false,
    }
  }

  private matchesRule(
    rule: ShippingRule,
    input: ShippingCalculationInput,
    totalWeight: number,
    totalVolume: number,
    hasDangerous: boolean,
    hasFragile: boolean
  ): boolean {
    const { conditions } = rule

    // Weight check
    if (conditions.weightMin !== undefined && totalWeight < conditions.weightMin) return false
    if (conditions.weightMax !== undefined && totalWeight > conditions.weightMax) return false

    // Volume check
    if (conditions.volumeMin !== undefined && totalVolume < conditions.volumeMin) return false
    if (conditions.volumeMax !== undefined && totalVolume > conditions.volumeMax) return false

    // Category check
    if (conditions.categoryIds && conditions.categoryIds.length > 0) {
      const itemCategories = input.items.map((item) => item.categoryId).filter(Boolean)
      if (!itemCategories.some((cat) => conditions.categoryIds!.includes(cat!))) return false
    }

    // Dangerous check
    if (conditions.isDangerous !== undefined && conditions.isDangerous !== hasDangerous) return false

    // Fragile check
    if (conditions.isFragile !== undefined && conditions.isFragile !== hasFragile) return false

    return true
  }

  private calculateCost(rule: ShippingRule, totalWeight: number, totalVolume: number): number {
    let cost = rule.cost.base || 0

    if (rule.cost.perKg) {
      cost += (totalWeight / 1000) * rule.cost.perKg // Convert grams to kg
    }

    if (rule.cost.perVolume) {
      cost += totalVolume * rule.cost.perVolume
    }

    return Math.round(cost * 100) / 100 // Round to 2 decimals
  }

  private estimateDays(rule: ShippingRule, address: { city: string; country: string }): number {
    // Simple estimation based on location
    if (address.country !== 'Türkiye') {
      return 7 // International
    }

    // Major cities: 2-3 days, others: 3-5 days
    const majorCities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']
    if (majorCities.includes(address.city)) {
      return 2
    }

    return 3
  }
}

