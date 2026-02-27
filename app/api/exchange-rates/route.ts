/**
 * Resmi kur (TCMB) – TRY bazlı. Saatlik önbellek.
 * Öncelik: TCMB today.xml (gösterge niteliğindeki kurlar), yedek: open.er-api.com
 */

import { NextResponse } from 'next/server'

const CACHE_MAX_AGE = 60 * 60 // 1 saat (saniye)
const TCMB_XML = 'https://www.tcmb.gov.tr/kurlar/today.xml'
const FALLBACK_API = 'https://open.er-api.com/v6/latest/TRY'

export type ExchangeRatesResponse = {
  base: 'TRY'
  rates: { TRY: number; USD: number; EUR: number }
  updatedAt: string
}

let cached: ExchangeRatesResponse | null = null
let cachedAt = 0

/** TCMB XML'den ForexSelling değerini al (1 USD = x TRY => 1 TRY = 1/x USD) */
function parseTcmbRate(xml: string, kod: string): number | null {
  const re = new RegExp(`Kod="${kod}"[\\s\\S]*?ForexSelling>([\\d,]+)<`, 'i')
  const m = xml.match(re)
  if (!m) return null
  const str = m[1].replace(',', '.')
  const tryPerUnit = parseFloat(str)
  if (!Number.isFinite(tryPerUnit) || tryPerUnit <= 0) return null
  return 1 / tryPerUnit // 1 TRY = x USD/EUR
}

async function fetchTcmbRates(): Promise<{ USD: number; EUR: number } | null> {
  const res = await fetch(TCMB_XML, {
    headers: { Accept: 'application/xml, text/xml' },
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  const xml = await res.text()
  const usd = parseTcmbRate(xml, 'USD')
  const eur = parseTcmbRate(xml, 'EUR')
  if (usd == null || eur == null) return null
  return { USD: usd, EUR: eur }
}

async function fetchFallbackRates(): Promise<{ USD: number; EUR: number }> {
  const res = await fetch(FALLBACK_API, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Fallback API error')
  const data = await res.json()
  if (data.result !== 'success' || !data.rates) throw new Error('Invalid fallback response')
  return {
    USD: Number(data.rates.USD) || 0.028,
    EUR: Number(data.rates.EUR) || 0.026,
  }
}

export async function GET() {
  const now = Date.now()
  if (cached && now - cachedAt < CACHE_MAX_AGE * 1000) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=3600` },
    })
  }

  try {
    let usd: number
    let eur: number
    const tcmb = await fetchTcmbRates()
    if (tcmb) {
      usd = tcmb.USD
      eur = tcmb.EUR
    } else {
      const fallback = await fetchFallbackRates()
      usd = fallback.USD
      eur = fallback.EUR
    }

    const rates = { TRY: 1, USD: usd, EUR: eur }
    cached = {
      base: 'TRY',
      rates,
      updatedAt: new Date().toISOString(),
    }
    cachedAt = now

    return NextResponse.json(cached, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=3600`,
      },
    })
  } catch (e) {
    console.error('Exchange rates fetch error:', e)
    const fallback: ExchangeRatesResponse = cached ?? {
      base: 'TRY',
      rates: { TRY: 1, USD: 0.028, EUR: 0.026 },
      updatedAt: new Date().toISOString(),
    }
    return NextResponse.json(fallback, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60' },
    })
  }
}
