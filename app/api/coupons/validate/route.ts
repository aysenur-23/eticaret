/**
 * Kupon kodu doğrulama.
 * POST body: { code: string, subtotal?: number }
 * Döner: { valid: boolean, discount?: number, type?: 'percent' | 'fixed', message?: string }
 * type 'percent' ise discount 0-100 arası yüzde; 'fixed' ise sabit TL indirim.
 */

import { NextRequest, NextResponse } from 'next/server'

// Örnek kuponlar (gerçek uygulamada DB veya env'den)
const COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; label?: string }> = {
  WELCOME10: { type: 'percent', value: 10, label: '%10 hoş geldin indirimi' },
  HOSGELDIN: { type: 'percent', value: 10, label: '%10 hoş geldin indirimi' },
  KARGO50: { type: 'fixed', value: 50, label: '50 TL indirim' },
  INDIRIM20: { type: 'percent', value: 20, label: '%20 indirim' },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const code = (body.code as string)?.trim()?.toUpperCase()
    const subtotal = typeof body.subtotal === 'number' ? body.subtotal : 0

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Kupon kodu girin.' }, { status: 400 })
    }

    const coupon = COUPONS[code]
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Geçersiz kupon kodu.' })
    }

    let discountAmount = 0
    if (coupon.type === 'percent') {
      discountAmount = Math.round((subtotal * (coupon.value / 100)) * 100) / 100
    } else {
      discountAmount = Math.min(coupon.value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      type: coupon.type,
      value: coupon.value,
      message: coupon.label || 'Kupon uygulandı.',
    })
  } catch (error) {
    console.error('Coupon validate error:', error)
    return NextResponse.json({ valid: false, message: 'Bir hata oluştu.' }, { status: 500 })
  }
}
