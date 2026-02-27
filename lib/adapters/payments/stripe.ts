/**
 * Stripe Payment Adapter
 * Implements PaymentAdapter interface for Stripe payments
 */

import Stripe from 'stripe'
import { PaymentAdapter, PaymentInitInput, PaymentInitResult, PaymentWebhookResult } from './base'

// Lazy initialization for static export compatibility
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  }
  return stripeInstance
}

export class StripeAdapter implements PaymentAdapter {
  async initPayment(input: PaymentInitInput): Promise<PaymentInitResult> {
    try {
      const stripe = getStripe()
      const amountCents = Math.round(input.amount * 100)

      if (input.successUrl && input.cancelUrl) {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: input.currency.toLowerCase(),
                unit_amount: amountCents,
                product_data: {
                  name: `Sipariş ${input.metadata?.orderNo || input.orderId}`,
                  description: 'Batarya Kit sipariş ödemesi',
                },
              },
              quantity: 1,
            },
          ],
          customer_email: input.customer.email,
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: {
            orderId: input.orderId,
            ...input.metadata,
          },
        })
        return {
          redirectUrl: session.url || undefined,
          providerRef: session.id,
          requiresRedirect: true,
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: input.currency.toLowerCase(),
        receipt_email: input.customer.email,
        metadata: {
          orderId: input.orderId,
          ...input.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        clientSecret: paymentIntent.client_secret || undefined,
        providerRef: paymentIntent.id,
        requiresRedirect: false,
      }
    } catch (error) {
      console.error('Stripe payment init error:', error)
      throw new Error(`Stripe payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async verifyWebhook(req: Request): Promise<PaymentWebhookResult> {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe webhook signature or secret')
    }

    const body = await req.text()

    try {
      const stripe = getStripe()
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = (session.metadata?.orderId as string) || ''
        return {
          orderId,
          status: 'PAID',
          providerRef: (session.payment_intent as string) || session.id,
          amount: (session.amount_total || 0) / 100,
          currency: (session.currency || 'try').toUpperCase(),
        }
      }
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        return {
          orderId: paymentIntent.metadata.orderId || '',
          status: 'PAID',
          providerRef: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        return {
          orderId: paymentIntent.metadata.orderId || '',
          status: 'FAILED',
          providerRef: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
        }
      }

      throw new Error(`Unhandled event type: ${event.type}`)
    } catch (error) {
      console.error('Stripe webhook verification error:', error)
      throw new Error(`Webhook verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentWebhookResult> {
    try {
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.retrieve(providerRef)
      
      let status: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING'
      if (paymentIntent.status === 'succeeded') {
        status = 'PAID'
      } else if (paymentIntent.status === 'canceled' || paymentIntent.status === 'payment_failed') {
        status = 'FAILED'
      }

      return {
        orderId: paymentIntent.metadata.orderId || '',
        status,
        providerRef: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
      }
    } catch (error) {
      console.error('Stripe get payment status error:', error)
      throw new Error(`Failed to get payment status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async refund(providerRef: string, amount?: number): Promise<{ success: boolean; refundRef?: string }> {
    try {
      const stripe = getStripe()
      const refund = await stripe.refunds.create({
        payment_intent: providerRef,
        amount: amount ? Math.round(amount * 100) : undefined,
      })

      return {
        success: refund.status === 'succeeded',
        refundRef: refund.id,
      }
    } catch (error) {
      console.error('Stripe refund error:', error)
      return { success: false }
    }
  }
}

