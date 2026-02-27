/**
 * Bir sonraki unique sipariş numarasını döner (ORD-YYYY-NNNNN).
 * Firestore siparişi (havale) oluşturulurken kullanılır; böylece tüm siparişler aynı numara havuzunu kullanır.
 */

import { NextResponse } from 'next/server'
import { getNextOrderNo } from '@/lib/sequence'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    if (isRateLimited(request as any, 'next-order-no', 30, 60_000)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen kısa süre sonra tekrar deneyin.' },
        { status: 429 }
      )
    }
    const orderNo = await getNextOrderNo()
    return NextResponse.json({ orderNo })
  } catch (error) {
    console.error('Next order no error:', error)
    return NextResponse.json(
      { error: 'Sipariş numarası alınamadı' },
      { status: 500 }
    )
  }
}
