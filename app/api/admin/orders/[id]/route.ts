/**
 * Admin: Tek sipariş detay (GET) ve durum güncelleme (PATCH).
 * Query: source=prisma | firestore, Firestore için userId zorunlu.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFirestore, isFirebaseAdminConfigured } from '@/lib/firebaseAdminServer'
import { checkAdmin } from '@/lib/adminAuth'
import { sendShipmentNotice, sendPaymentConfirmation } from '@/lib/notifications'
import type { NotificationData } from '@/lib/notifications'
import { buildInvoiceDataFromPrisma, buildInvoiceDataFromNormalized } from '@/lib/invoice-data'
import { generateAndSendInvoice } from '@/lib/invoice-send'

function normalizeOrderForResponse(order: {
  id: string
  source: 'prisma' | 'firestore'
  orderId: string
  customer: Record<string, unknown>
  items: Array<{ id?: string; name: string; price: number; quantity: number; productName?: string; unitPrice?: number; lineTotal?: number }>
  pricing: { subtotal?: number; total?: number; tax?: number; shipping?: number }
  status: string
  paymentStatus: string
  createdAt: Date | string
  trackingNumber?: string | null
  userId?: string | null
}) {
  return {
    id: order.id,
    source: order.source,
    orderId: order.orderId,
    customer: order.customer,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name || item.productName || 'Ürün',
      price: item.price ?? item.unitPrice ?? 0,
      quantity: item.quantity,
      lineTotal: item.lineTotal ?? (item.price ?? item.unitPrice ?? 0) * item.quantity,
    })),
    pricing: order.pricing,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: typeof order.createdAt === 'string' ? order.createdAt : order.createdAt?.toISOString?.() ?? new Date().toISOString(),
    trackingNumber: order.trackingNumber ?? undefined,
    userId: order.userId ?? undefined,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'prisma'
  const userId = searchParams.get('userId') || ''

  if (!id) {
    return NextResponse.json({ error: 'Sipariş id gerekli' }, { status: 400 })
  }

  try {
    if (source === 'prisma') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { lines: true, user: { select: { email: true, name: true } } },
      })
      if (!order) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }
      const customer = {
        name: order.shippingName,
        email: order.user?.email ?? '',
        phone: order.shippingPhone,
        addressLine: order.shippingAddress,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
        country: order.shippingCountry,
        billingType: order.billingType,
        companyName: order.billingName,
        taxId: order.billingTaxId,
        taxOffice: order.billingTaxOffice,
      }
      const items = order.lines.map((l) => ({
        id: l.id,
        productName: l.productName,
        name: l.productName,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineTotal: l.lineTotal,
      }))
      const pricing = {
        subtotal: order.subtotal,
        tax: order.vatTotal,
        shipping: order.shippingCost,
        total: order.total,
      }
      return NextResponse.json(
        normalizeOrderForResponse({
          id: order.id,
          source: 'prisma',
          orderId: order.orderNo,
          customer,
          items,
          pricing,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          trackingNumber: order.trackingNumber,
          userId: order.userId,
        })
      )
    }

    if (source === 'firestore') {
      if (!userId) {
        return NextResponse.json({ error: 'Firestore siparişi için userId gerekli' }, { status: 400 })
      }
      const db = isFirebaseAdminConfigured() ? getAdminFirestore() : null
      if (!db) {
        return NextResponse.json({ error: 'Firestore yapılandırılmamış' }, { status: 503 })
      }
      const docSnap = await db.collection('users').doc(userId).collection('orders').doc(id).get()
      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }
      const data = docSnap.data()!
      const createdAt = data.createdAt as { toDate?: () => Date } | undefined
      const createdAtDate = createdAt?.toDate?.() ?? (data.createdAt instanceof Date ? data.createdAt : new Date())
      const customer = (data.customer as Record<string, unknown>) || {}
      const items = (data.items as Array<{ id?: string; name: string; price: number; quantity: number }>) || []
      const pricing = (data.pricing as { subtotal?: number; tax?: number; shipping?: number; total?: number }) || {}
      return NextResponse.json(
        normalizeOrderForResponse({
          id: docSnap.id,
          source: 'firestore',
          orderId: (data.orderId as string) || docSnap.id,
          customer,
          items,
          pricing,
          status: (data.status as string) || 'pending',
          paymentStatus: (data.paymentStatus as string) || 'pending',
          createdAt: createdAtDate,
          trackingNumber: data.trackingNumber as string | undefined,
          userId,
        })
      )
    }

    return NextResponse.json({ error: 'Geçersiz source' }, { status: 400 })
  } catch (error) {
    console.error('Admin order detail error:', error)
    return NextResponse.json(
      { error: 'Sipariş getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'prisma'
  const userId = searchParams.get('userId') || ''

  if (!id) {
    return NextResponse.json({ error: 'Sipariş id gerekli' }, { status: 400 })
  }

  let body: { status?: string; paymentStatus?: string; trackingNumber?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const { status, paymentStatus, trackingNumber } = body

  try {
    if (source === 'prisma') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { lines: true, user: { select: { email: true, name: true } } },
      })
      if (!order) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }

      const updateData: Record<string, unknown> = {}
      if (status !== undefined) updateData.status = status
      if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber

      if (Object.keys(updateData).length > 0) {
        await prisma.order.update({
          where: { id },
          data: updateData as any,
        })
      }

      const customer = {
        name: order.shippingName,
        email: order.user?.email ?? '',
        phone: order.shippingPhone,
        addressLine: order.shippingAddress,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
        country: order.shippingCountry,
      }
      const notificationData: NotificationData = {
        orderId: order.orderNo,
        orderData: {} as any,
        customer,
        config: null,
        choices: null,
        pricing: {
          subtotal: order.subtotal,
          tax: order.vatTotal,
          shipping: order.shippingCost,
          total: order.total,
          items: order.lines.map((l) => ({ id: l.id, name: l.productName, price: l.unitPrice, quantity: l.quantity })),
        },
      }

      if (status === 'shipped' && trackingNumber) {
        await sendShipmentNotice(notificationData, trackingNumber)
      }

      // Admin "Ödendi" işaretlediyse fatura + ödeme onay e-postası gönder (örn. havale kaydı)
      if (paymentStatus === 'PAID') {
        const fullOrder = await prisma.order.findUnique({
          where: { id },
          include: { lines: true, user: { select: { email: true, name: true } } },
        })
        if (fullOrder) {
          const invoiceData = buildInvoiceDataFromPrisma(fullOrder)
          const customerEmail = fullOrder.shippingEmail ?? fullOrder.user?.email ?? ''
          if (customerEmail) {
            try {
              await generateAndSendInvoice(fullOrder.orderNo, invoiceData, customerEmail)
              await sendPaymentConfirmation({
                orderId: fullOrder.orderNo,
                orderData: fullOrder,
                customer: invoiceData.customer,
                config: null,
                choices: null,
                pricing: invoiceData.pricing,
              })
            } catch (e) {
              console.error('Admin mark PAID: invoice/email error', e)
            }
          }
        }
      }

      const updated = await prisma.order.findUnique({
        where: { id },
        include: { lines: true, user: { select: { email: true, name: true } } },
      })
      const items = updated!.lines.map((l) => ({
        id: l.id,
        name: l.productName,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        lineTotal: l.lineTotal,
      }))
      return NextResponse.json({
        success: true,
        order: normalizeOrderForResponse({
          id: updated!.id,
          source: 'prisma',
          orderId: updated!.orderNo,
          customer: { ...customer },
          items,
          pricing: {
            subtotal: updated!.subtotal,
            tax: updated!.vatTotal,
            shipping: updated!.shippingCost,
            total: updated!.total,
          },
          status: updated!.status,
          paymentStatus: updated!.paymentStatus,
          createdAt: updated!.createdAt,
          trackingNumber: updated!.trackingNumber,
          userId: updated!.userId,
        }),
      })
    }

    if (source === 'firestore') {
      if (!userId) {
        return NextResponse.json({ error: 'Firestore siparişi için userId gerekli' }, { status: 400 })
      }
      const db = isFirebaseAdminConfigured() ? getAdminFirestore() : null
      if (!db) {
        return NextResponse.json({ error: 'Firestore yapılandırılmamış' }, { status: 503 })
      }

      const ref = db.collection('users').doc(userId).collection('orders').doc(id)
      const docSnap = await ref.get()
      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }

      const updateData: Record<string, unknown> = {}
      if (status !== undefined) updateData.status = status
      if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber

      if (Object.keys(updateData).length > 0) {
        await ref.update(updateData)
      }

      const data = docSnap.data()!
      const customer = (data.customer as Record<string, unknown>) || {}
      const customerEmail = (customer.email as string) || ''
      if (status === 'shipped' && trackingNumber && customerEmail) {
        const notificationData: NotificationData = {
          orderId: (data.orderId as string) || id,
          orderData: {} as any,
          customer: customer as any,
          config: null,
          choices: null,
          pricing: (data.pricing as any) || {},
        }
        await sendShipmentNotice(notificationData, trackingNumber)
      }

      const updatedSnap = await ref.get()
      const updatedData = updatedSnap.data()!

      // Admin "Ödendi" işaretlediyse (havale) fatura + ödeme onay e-postası gönder
      if (paymentStatus === 'PAID' && customerEmail) {
        try {
          const orderId = (updatedData.orderId as string) || id
          const normalized = {
            customer: updatedData.customer || {},
            items: updatedData.items || [],
            pricing: updatedData.pricing || {},
            status: updatedData.status,
          }
          const invoiceData = buildInvoiceDataFromNormalized(normalized)
          await generateAndSendInvoice(orderId, invoiceData, customerEmail)
          await sendPaymentConfirmation({
            orderId,
            orderData: normalized,
            customer: invoiceData.customer,
            config: null,
            choices: null,
            pricing: invoiceData.pricing,
          })
        } catch (e) {
          console.error('Admin mark PAID (Firestore): invoice/email error', e)
        }
      }
      const createdAt = updatedData.createdAt as { toDate?: () => Date } | undefined
      const createdAtDate = createdAt?.toDate?.() ?? new Date()
      const items = (updatedData.items as any[]) || []
      const pricing = (updatedData.pricing as any) || {}
      return NextResponse.json({
        success: true,
        order: normalizeOrderForResponse({
          id: updatedSnap.id,
          source: 'firestore',
          orderId: (updatedData.orderId as string) || updatedSnap.id,
          customer: updatedData.customer || {},
          items,
          pricing,
          status: (updatedData.status as string) || 'pending',
          paymentStatus: (updatedData.paymentStatus as string) || 'pending',
          createdAt: createdAtDate,
          trackingNumber: updatedData.trackingNumber as string | undefined,
          userId,
        }),
      })
    }

    return NextResponse.json({ error: 'Geçersiz source' }, { status: 400 })
  } catch (error) {
    console.error('Admin order PATCH error:', error)
    return NextResponse.json(
      { error: 'Sipariş güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
