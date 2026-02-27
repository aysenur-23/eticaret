/**
 * Admin: Sipariş faturasını oluşturup müşteri e-postasına gönderir.
 * POST body: { source: 'prisma' | 'firestore', userId?: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFirestore, isFirebaseAdminConfigured } from '@/lib/firebaseAdminServer'
import { checkAdmin } from '@/lib/adminAuth'
import { buildInvoiceDataFromPrisma, buildInvoiceDataFromNormalized } from '@/lib/invoice-data'
import { generateAndSendInvoice } from '@/lib/invoice-send'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await checkAdmin(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params
  let body: { source?: string; userId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON' }, { status: 400 })
  }

  const source = body.source || 'prisma'
  const userId = body.userId || ''

  if (!id) {
    return NextResponse.json({ error: 'Sipariş id gerekli' }, { status: 400 })
  }

  try {
    if (source === 'prisma') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { lines: true, user: { select: { email: true } } },
      })
      if (!order) {
        return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
      }
      const customerEmail = order.user?.email || ''
      if (!customerEmail) {
        return NextResponse.json({ error: 'Siparişte müşteri e-postası yok' }, { status: 400 })
      }
      const invoiceData = buildInvoiceDataFromPrisma(order)
      const result = await generateAndSendInvoice(order.orderNo, invoiceData, customerEmail)
      if (result.sent) {
        return NextResponse.json({ success: true, message: 'Fatura e-posta ile gönderildi.' })
      }
      return NextResponse.json({ success: false, error: result.error || 'Gönderilemedi' }, { status: 500 })
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
      const customer = (data.customer as Record<string, string>) || {}
      const customerEmail = customer.email || ''
      if (!customerEmail) {
        return NextResponse.json({ error: 'Siparişte müşteri e-postası yok' }, { status: 400 })
      }
      const orderId = (data.orderId as string) || id
      const normalized = {
        customer: data.customer || {},
        items: data.items || [],
        pricing: data.pricing || {},
        status: data.status,
      }
      const invoiceData = buildInvoiceDataFromNormalized(normalized)
      const result = await generateAndSendInvoice(orderId, invoiceData, customerEmail)
      if (result.sent) {
        return NextResponse.json({ success: true, message: 'Fatura e-posta ile gönderildi.' })
      }
      return NextResponse.json({ success: false, error: result.error || 'Gönderilemedi' }, { status: 500 })
    }

    return NextResponse.json({ error: 'Geçersiz source' }, { status: 400 })
  } catch (error) {
    console.error('Send invoice error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fatura gönderilirken hata oluştu' },
      { status: 500 }
    )
  }
}
