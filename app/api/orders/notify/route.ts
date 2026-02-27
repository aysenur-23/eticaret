/**
 * Sipariş bildirimleri (müşteri onay e-postası + admin yeni sipariş bildirimi).
 * Checkout'ta Firestore'a yazılan siparişler için kullanılır.
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, customer, items = [], pricing, config = null, choices = null } = body

    if (!orderId || !customer?.email || !pricing) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgiler: orderId, customer, pricing gerekli' },
        { status: 400 }
      )
    }

    const notificationData = {
      orderId,
      orderData: { customer, config, choices, pricing: { ...pricing, items } },
      customer,
      config,
      choices,
      pricing: { ...pricing, items },
    }

    await sendOrderConfirmation(notificationData)
    await sendAdminNewOrderNotification(notificationData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order notify error:', error)
    return NextResponse.json(
      { success: false, error: 'Bildirim gönderilirken hata oluştu' },
      { status: 500 }
    )
  }
}
