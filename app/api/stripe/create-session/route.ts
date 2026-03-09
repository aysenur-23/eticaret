import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe yapılandırılmamış. STRIPE_SECRET_KEY eksik.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { orderNo, total, customerEmail, customerName } = body

    if (!orderNo || !total || !customerEmail) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'try',
            unit_amount: Math.round(total * 100), // Kuruş cinsinden
            product_data: {
              name: `Sipariş ${orderNo}`,
              description: 'IMORA sipariş ödemesi',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?order_id=${orderNo}&payment=stripe`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        orderNo,
        customerName: customerName || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe bağlantı hatası' },
      { status: 500 }
    )
  }
}
