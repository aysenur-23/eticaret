import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'
import { isRateLimited } from '@/lib/rate-limit'
import { getPaymentAdapter } from '@/lib/adapters/payments'
import type { PaymentProvider } from '@/lib/adapters/payments'
import { getNextOrderNo, getNextCustomerNo } from '@/lib/sequence'
import { getUserIdFromRequest } from '@/lib/customerAuth'

const VAT_RATE = 20

/**
 * Misafir veya basit sipariş: cart items (ürün + teklif kalemi) ile Prisma Order oluşturur.
 * Body: { customer, items: [{ id, name, price, quantity, variantId? }], pricing: { subtotal, tax, shipping, total }, userId?, config?, choices? }
 */
export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request, 'orders', 20, 60_000)) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla sipariş isteği. Lütfen kısa süre sonra tekrar deneyin.' },
        { status: 429 }
      )
    }
    const body = await request.json()

    const {
      customer,
      config,
      choices,
      pricing,
      paymentMethod = 'pending',
      paymentId,
      paymentProvider,
      userId,
      items = [],
    } = body

    if (!customer || !pricing) {
      return NextResponse.json(
        { success: false, error: 'Müşteri ve fiyat bilgisi gerekli' },
        { status: 400 }
      )
    }

    // Müşteri numarası: Prisma userId varsa ve customerNo yoksa otomatik ata
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { customerNo: true },
      })
      if (user && !user.customerNo) {
        const customerNo = await getNextCustomerNo()
        await prisma.user.update({
          where: { id: userId },
          data: { customerNo },
        })
      }
    }

    const orderNo = await getNextOrderNo()

    const subtotal = Number(pricing.subtotal) || 0
    const tax = Number(pricing.tax) ?? subtotal * (VAT_RATE / 100)
    const shipping = Number(pricing.shipping) || 0
    const total = Number(pricing.total) || subtotal + tax + shipping

    const orderLines = (Array.isArray(items) ? items : []).map((item: { id?: string; name: string; price: number; quantity: number; variantId?: string }) => {
      const qty = Math.max(1, Number(item.quantity) || 1)
      const unitPrice = Number(item.price) || 0
      const lineSubtotal = unitPrice * qty
      const lineVat = lineSubtotal * (VAT_RATE / 100)
      const lineTotal = Math.round((lineSubtotal + lineVat) * 100) / 100
      return {
        variantId: item.variantId || null,
        productName: (item.name || 'Ürün').slice(0, 500),
        quantity: qty,
        unitPrice,
        vatRate: VAT_RATE,
        lineTotal,
      }
    })

    const order = await prisma.order.create({
      data: {
        orderNo,
        userId: userId || null,
        status: 'PENDING',
        paymentStatus: paymentId ? 'PAID' : 'PENDING',
        paymentMethod: paymentProvider ? (paymentProvider as string) : paymentMethod,
        paymentProviderRef: paymentId || null,
        shippingName: customer.name || '',
        shippingEmail: customer.email || null,
        shippingPhone: customer.phone || '',
        shippingAddress: customer.addressLine || '',
        shippingCity: customer.city || '',
        shippingDistrict: customer.district || '',
        shippingPostalCode: customer.postalCode || '',
        shippingCountry: customer.country || 'Türkiye',
        billingType: customer.billingType || 'individual',
        billingName: customer.billingName || customer.name || '',
        billingTaxId: customer.taxId || null,
        billingTaxOffice: customer.taxOffice || null,
        billingAddress: customer.address || customer.addressLine || null,
        billingCity: customer.city || null,
        billingDistrict: customer.district || null,
        billingPostalCode: customer.postalCode || null,
        billingCountry: customer.billingCountry || customer.country || 'Türkiye',
        subtotal: Math.round(subtotal * 100) / 100,
        vatTotal: Math.round(tax * 100) / 100,
        shippingCost: Math.round(shipping * 100) / 100,
        discount: 0,
        total: Math.round(total * 100) / 100,
        currency: 'TRY',
        notes: [config, choices].filter(Boolean).length ? JSON.stringify({ config, choices }) : null,
        lines: {
          create: orderLines,
        },
      },
      include: { lines: true },
    })

    const notificationData = {
      orderId: order.orderNo,
      orderData: { ...order, customer, config, choices, pricing: { ...pricing, items } },
      customer: {
        name: customer.name,
        email: customer.email,
      },
    }

    try {
      await sendOrderConfirmation(notificationData)
      await sendAdminNewOrderNotification(notificationData)
    } catch (e) {
      console.error('Order notification error:', e)
    }

    let paymentResult: { redirectUrl?: string; clientSecret?: string; requiresRedirect: boolean } | undefined
    if (paymentProvider && (paymentProvider === 'stripe' || paymentProvider === 'paytr')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || (request.headers.get('origin') || 'https://bataryakit.com')
        const successUrl = `${baseUrl.replace(/\/$/, '')}/checkout/success?order_id=${order.orderNo}&session_id={CHECKOUT_SESSION_ID}`
        const cancelUrl = `${baseUrl.replace(/\/$/, '')}/checkout/cancel`
        const adapter = getPaymentAdapter(paymentProvider as PaymentProvider)
        const init = await adapter.initPayment({
          orderId: order.id,
          amount: total,
          currency: 'TRY',
          customer: {
            email: customer.email || '',
            name: customer.name,
            phone: customer.phone,
          },
          successUrl,
          cancelUrl,
          billing: {
            name: customer.billingName || customer.name || '',
            address: customer.addressLine || customer.address,
            city: customer.city,
            district: customer.district,
            postalCode: customer.postalCode,
            country: customer.country || 'Türkiye',
            taxId: customer.taxId,
          } as any,
          metadata: { orderNo: order.orderNo },
        })
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentProviderRef: init.providerRef },
        })
        paymentResult = {
          redirectUrl: init.redirectUrl,
          clientSecret: init.clientSecret,
          requiresRedirect: init.requiresRedirect,
        }
      } catch (e) {
        console.error('Payment init error:', e)
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderNo,
      order,
      payment: paymentResult,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

/**
 * Müşterinin kendi siparişleri (Prisma). Auth zorunlu; sadece userId eşleşen siparişler döner.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500)
    const status = searchParams.get('status')

    const where: { userId: string; status?: any } = { userId }
    if (status) where.status = status as any

    const orders = await prisma.order.findMany({
      where,
      include: { lines: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Siparişler getirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
