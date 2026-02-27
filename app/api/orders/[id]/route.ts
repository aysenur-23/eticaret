import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusUpdate, sendShipmentNotice } from '@/lib/notifications'

// Static export için gerekli - Next.js 14 nested route support
export function generateStaticParams() {
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, trackingNumber, notes } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (notes !== undefined) updateData.notes = notes

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData
    })

    // Send email notifications if status changed
    if (status && status !== order.status) {
      const notificationData = {
        orderId: order.orderNo,
        orderData: order,
        customer: {
          name: order.shippingName,
          email: order.shippingEmail ?? '',
        },
      }

      // Send status update email
      await sendOrderStatusUpdate(notificationData, status)

      // If shipped, send tracking info
      if (status === 'shipped' && trackingNumber) {
        await sendShipmentNotice(notificationData, trackingNumber)
      }
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

