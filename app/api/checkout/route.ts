/**
 * Checkout API Route
 * Handles order creation and payment initiation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getPaymentAdapter, PaymentProvider } from '@/lib/adapters/payments'
import { calculateCartTotals } from '@/lib/utils/cart'
import { ShippingRulesEngine } from '@/lib/shipping/rules'

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      cartItems,
      shippingAddress,
      billingAddress,
      billingType,
      paymentProvider,
      couponCode,
    } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Get user if authenticated
    let user = null
    // TODO: Re-enable when NextAuth is properly configured
    // if (session?.user?.email) {
    //   user = await prisma.user.findUnique({
    //     where: { email: session.user.email },
    //   })
    // }

    // Fetch variants and calculate totals
    const variants = await prisma.variant.findMany({
      where: {
        id: { in: cartItems.map((item: any) => item.variantId) },
      },
      include: {
        product: true,
        stock: true,
      },
    })

    const cartItemsWithData = cartItems.map((item: any) => {
      const variant = variants.find((v: any) => v.id === item.variantId)
      if (!variant) throw new Error(`Variant not found: ${item.variantId}`)

      return {
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: Number(variant.price),
        vatRate: Number(variant.vatRate),
        moq: (variant.product as any).moq || undefined,
        orderStep: (variant.product as any).orderStep || undefined,
        availableStock: ((variant.stock as any)?.onHand || 0) - ((variant.stock as any)?.reserved || 0),
      }
    })

    // Calculate shipping
    const shippingEngine = new ShippingRulesEngine()
    const shippingResult = shippingEngine.calculate({
      items: cartItemsWithData.map((item) => ({
        weightG: (variants.find((v: any) => v.id === item.variantId)?.weightG as number) || 0,
        categoryId: (variants.find((v: any) => v.id === item.variantId)?.product as any)?.categoryId || undefined,
        isDangerous: true, // Assume batteries are dangerous
      })),
      orderTotal: 0, // Will be calculated
      shippingAddress,
    })

    // Calculate cart totals
    const totals = calculateCartTotals(cartItemsWithData, shippingResult.cost, 0)

    if (totals.errors.length > 0) {
      return NextResponse.json({ errors: totals.errors }, { status: 400 })
    }

    // Generate order number
    const orderNo = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNo: orderNo,
        userId: user?.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingName: shippingAddress.name,
        shippingPhone: shippingAddress.phone,
        shippingAddress: shippingAddress.addressLine,
        shippingCity: shippingAddress.city,
        shippingDistrict: shippingAddress.district || '',
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country || 'Türkiye',
        billingType: billingType || 'individual',
        billingName: billingAddress.name,
        billingTaxId: billingAddress.taxId,
        billingTaxOffice: billingAddress.taxOffice,
        billingAddress: billingAddress.address,
        billingCity: billingAddress.city,
        billingDistrict: billingAddress.district,
        billingPostalCode: billingAddress.postalCode,
        billingCountry: billingAddress.country || 'Türkiye',
        subtotal: totals.subtotal,
        vatTotal: totals.vatTotal,
        shippingCost: totals.shippingCost,
        discount: totals.discount,
        total: totals.total,
        lines: {
          create: totals.items.map((item) => {
            const variant = variants.find((v: any) => v.id === item.variantId)!
            return {
              variantId: variant.id,
              productName: (variant.product as any).name,
              variantMatrix: variant.matrix,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              vatRate: item.vatRate,
              lineTotal: item.lineTotal,
            }
          }),
        },
      },
    })

    // Reserve stock
    for (const item of cartItemsWithData) {
      await prisma.stock.update({
        where: { variantId: item.variantId },
        data: {
          reserved: { increment: item.quantity },
        },
      })
    }

    // Initialize payment
    if (paymentProvider) {
      const adapter = getPaymentAdapter(paymentProvider as PaymentProvider)
      const paymentResult = await adapter.initPayment({
        orderId: order.id,
        amount: Number(totals.total),
        currency: 'TRY',
        customer: {
          email: user?.email || shippingAddress.email,
          name: shippingAddress.name,
          phone: shippingAddress.phone,
        },
        billing: billingAddress,
        metadata: {
          orderNo: order.orderNo,
        },
      })

      // Update order with payment reference
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: paymentProvider,
          paymentProviderRef: paymentResult.providerRef,
        },
      })

      return NextResponse.json({
        orderId: order.id,
        orderNo: order.orderNo,
        payment: paymentResult,
      })
    }

    return NextResponse.json({
      orderId: order.id,
      orderNo: order.orderNo,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

