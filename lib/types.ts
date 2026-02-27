/**
 * Özet paneli ve fiyat hesaplama için tip tanımları
 */

export interface SummaryConfig {
  s?: number
  p?: number
  chemistry?: string
  cellFamily?: string
}

export interface SummaryElectrical {
  vNom?: number
  ah?: number
  wh?: number
  iContAvail?: number
  iPeakAvail?: number
}

export interface SummaryMechanical {
  cells?: number
  weightG?: number
  holder?: {
    L: number
    W: number
    H: number
  }
}

export interface SummaryData {
  config?: SummaryConfig
  electrical?: SummaryElectrical
  mechanical?: SummaryMechanical
}

export interface Evaluation {
  contOK?: boolean
  peakOK?: boolean
  energyConsistencyOK?: boolean
  weightOK?: boolean
  regulationNote?: string
  regulationRequired?: boolean
  hasBMS?: boolean
  hasConnector?: boolean
  hasCharger?: boolean
  contMessage?: string
  peakMessage?: string
  energyConsistencyMessage?: string
  weightMessage?: string
  regulationMessage?: string
  bmsMessage?: string
  connectorMessage?: string
  chargerMessage?: string
}

export interface PriceItem {
  sku: string
  title: string
  qty: number
  unitPrice: number
  subtotal: number
}

export interface PriceTotals {
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: 'TRY'
}

export interface PriceData {
  items: PriceItem[]
  totals: PriceTotals
}

export interface ActionResponse {
  summary: SummaryData
  evaluation: Evaluation
  price?: PriceData
  warnings?: string[]
  errors?: string[]
}

