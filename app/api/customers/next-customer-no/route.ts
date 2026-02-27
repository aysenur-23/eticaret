/**
 * Sonraki unique müşteri numarasını döner (CUS-NNNNN).
 * Firestore kullanıcıları ilk siparişte veya profilde bu numarayı alıp users/{uid}.customerNo olarak kaydeder.
 */

import { NextResponse } from 'next/server'
import { getNextCustomerNo } from '@/lib/sequence'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    if (isRateLimited(request as any, 'next-customer-no', 20, 60_000)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen kısa süre sonra tekrar deneyin.' },
        { status: 429 }
      )
    }
    const customerNo = await getNextCustomerNo()
    return NextResponse.json({ customerNo })
  } catch (error) {
    console.error('Next customer no error:', error)
    return NextResponse.json(
      { error: 'Müşteri numarası alınamadı' },
      { status: 500 }
    )
  }
}
