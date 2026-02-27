/**
 * GES hesaplama formülleri.
 * Aylık üretim (kWh) = kWp × 30 gün × günlük güneşlenme saati (peak) × PR
 */

import {
  GES_DEFAULT_PR,
  GES_PRICE_PER_KWP_MIN,
  GES_PRICE_PER_KWP_MAX,
  ELECTRICITY_PRICE_TL_PER_KWH_MIN,
  ELECTRICITY_PRICE_TL_PER_KWH_MAX,
  GES_KWP_RANGE_FACTOR_MIN,
  GES_KWP_RANGE_FACTOR_MAX,
} from './ges-constants'

export function suggestedKwp(
  monthlyKwh: number,
  sunHoursPerDay: number,
  performanceRatio: number = GES_DEFAULT_PR
): number {
  if (monthlyKwh <= 0 || sunHoursPerDay <= 0 || performanceRatio <= 0) return 0
  return monthlyKwh / (30 * sunHoursPerDay * performanceRatio)
}

export function estimatedMonthlyProduction(
  kwp: number,
  sunHoursPerDay: number,
  performanceRatio: number = GES_DEFAULT_PR
): number {
  return kwp * 30 * sunHoursPerDay * performanceRatio
}

export function estimatedAnnualProduction(
  kwp: number,
  sunHoursPerDay: number,
  performanceRatio: number = GES_DEFAULT_PR
): number {
  return estimatedMonthlyProduction(kwp, sunHoursPerDay, performanceRatio) * 12
}

export type GesCalcRanges = {
  kwp: number
  kwpMin: number
  kwpMax: number
  annualKwhMin: number
  annualKwhMax: number
  savingsMin: number
  savingsMax: number
  costMin: number
  costMax: number
}

/** Hesaplama sonucu ile birlikte aralıkları (kWp, kWh, yıllık tasarruf TL, kurulum maliyeti TL) döndürür. */
export function gesCalculationRanges(
  monthlyKwh: number,
  sunHoursPerDay: number,
  performanceRatio: number = GES_DEFAULT_PR
): GesCalcRanges {
  const kwp = suggestedKwp(monthlyKwh, sunHoursPerDay, performanceRatio)
  const annualKwh = estimatedAnnualProduction(kwp, sunHoursPerDay, performanceRatio)

  const kwpMin = Math.round(kwp * GES_KWP_RANGE_FACTOR_MIN * 100) / 100
  const kwpMax = Math.round(kwp * GES_KWP_RANGE_FACTOR_MAX * 100) / 100
  const annualKwhMin = Math.round(annualKwh * GES_KWP_RANGE_FACTOR_MIN)
  const annualKwhMax = Math.round(annualKwh * GES_KWP_RANGE_FACTOR_MAX)
  const savingsMin = Math.round(annualKwhMin * ELECTRICITY_PRICE_TL_PER_KWH_MIN)
  const savingsMax = Math.round(annualKwhMax * ELECTRICITY_PRICE_TL_PER_KWH_MAX)
  const costMin = Math.round(kwpMin * GES_PRICE_PER_KWP_MIN)
  const costMax = Math.round(kwpMax * GES_PRICE_PER_KWP_MAX)

  return {
    kwp,
    kwpMin,
    kwpMax,
    annualKwhMin,
    annualKwhMax,
    savingsMin,
    savingsMax,
    costMin,
    costMax,
  }
}
