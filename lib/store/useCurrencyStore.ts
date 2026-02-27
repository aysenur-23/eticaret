import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'TRY' | 'USD' | 'EUR'

interface CurrencyState {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'TRY',
      setCurrency: (code) => set({ currency: code }),
    }),
    { name: 'currency-storage' }
  )
)
