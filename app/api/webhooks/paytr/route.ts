/**
 * PayTR Webhook Handler
 * Processes PayTR payment webhooks. PAID durumunda fatura oluşturup gönderir ve ödeme onay e-postası atar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPaymentAdapter } from '@/lib/adapters/payments'
import { prisma } from '@/lib/prisma'
import { buildInvoiceDataFromPrisma } from '@/lib/invoice-data'
import { generateAndSendInvoice } from '@/lib/invoice-send'
import { sendPaymentConfirmation } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const adapter = getPaymentAdapter('paytr')
    const result = await adapter.verifyWebhook(request)

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: result.orderId },
          { paymentProviderRef: result.providerRef },
        ],
      },
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: result.status === 'PAID' ? 'PAID' : 'FAILED',
          status: result.status === 'PAID' ? 'PAID' : 'PENDING',
        },
      })

      if (result.status === 'PAID') {
        const fullOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: { lines: true, user: { select: { email: true } } },
        })
        if (fullOrder) {
          const invoiceData = buildInvoiceDataFromPrisma(fullOrder)
          const customerEmail = invoiceData.customer.email?.trim()
          if (customerEmail) {
            await generateAndSendInvoice(fullOrder.orderNo, invoiceData, customerEmail)
            await sendPaymentConfirmation({
              orderId: fullOrder.orderNo,
              orderData: fullOrder,
              customer: invoiceData.customer,
              config: {},
              choices: {},
              pricing: invoiceData.pricing,
            })
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayTR webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}


