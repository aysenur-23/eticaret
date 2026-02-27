import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/customerAuth'

/**
 * Sipariş detayı – orderNo ile (misafir siparişi için, örn. ORD-xxx).
 * İsteğe bağlı: ?phone= ile sorgu verilirse, siparişin shippingPhone ile eşleşme kontrol edilir (son 4 rakam veya tam).
 */
function normalizePhone(s: string | null | undefined): string {
  if (!s || typeof s !== 'string') return ''
  return s.replace(/\s+/g, '').replace(/-/g, '')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params
    if (!orderNo) {
      return NextResponse.json({ error: 'orderNo gerekli' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: { lines: true },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    const userId = getUserIdFromRequest(request)
    if (order.userId && userId && order.userId === userId) {
      return NextResponse.json({ success: true, order })
    }

    const phoneParam = request.nextUrl.searchParams.get('phone')
    if (phoneParam && order.shippingPhone) {
      const orderPhone = normalizePhone(order.shippingPhone)
      const provided = normalizePhone(phoneParam)
      const last4 = provided.slice(-4)
      const match =
        orderPhone === provided ||
        (last4.length >= 4 && orderPhone.length >= 4 && orderPhone.slice(-4) === last4)
      if (!match) {
        return NextResponse.json(
          { success: false, error: 'Bu siparişi görüntülemek için yetkiniz yok.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Error fetching order by orderNo:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
