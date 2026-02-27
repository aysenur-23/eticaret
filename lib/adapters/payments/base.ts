/**
 * Payment Adapter Base Interface
 * All payment providers (Stripe, PayTR, iyzico) must implement this interface
 */

export interface PaymentInitInput {
  orderId: string
  amount: number
  currency: string
  customer: {
    email: string
    name?: string
    phone?: string
  }
  /** Redirect URL after successful payment (Stripe Checkout Session kullanımı için) */
  successUrl?: string
  /** Redirect URL when payment is cancelled */
  cancelUrl?: string
  billing?: {
    name: string
    address?: string
    city?: string
    district?: string
    postalCode?: string
    country?: string
    taxId?: string
  }
  metadata?: Record<string, string>
}

export interface PaymentInitResult {
  redirectUrl?: string // For redirect-based flows (PayTR, iyzico)
  clientSecret?: string // For Stripe Elements
  providerRef: string // Provider's transaction reference
  requiresRedirect: boolean
}

export interface PaymentWebhookResult {
  orderId: string
  status: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED'
  providerRef: string
  amount: number
  currency: string
  metadata?: Record<string, any>
}

export interface PaymentAdapter {
  /**
   * Initialize a payment session
   */
  initPayment(input: PaymentInitInput): Promise<PaymentInitResult>

  /**
   * Verify and process webhook from payment provider
   */
  verifyWebhook(req: Request): Promise<PaymentWebhookResult>

  /**
   * Get payment status by provider reference
   */
  getPaymentStatus(providerRef: string): Promise<PaymentWebhookResult>

  /**
   * Refund a payment (if supported)
   */
  refund?(providerRef: string, amount?: number): Promise<{ success: boolean; refundRef?: string }>
}

