/**
 * iyzico Payment Adapter
 * Implements PaymentAdapter interface for iyzico payments
 * Note: This is a mock implementation for development
 */

import crypto from 'crypto'
import { PaymentAdapter, PaymentInitInput, PaymentInitResult, PaymentWebhookResult } from './base'

export class IyzicoAdapter implements PaymentAdapter {
  private apiKey: string
  private secretKey: string

  constructor() {
    this.apiKey = process.env.IYZICO_API_KEY || 'mock_api_key'
    this.secretKey = process.env.IYZICO_SECRET_KEY || 'mock_secret_key'
  }

  private generateHash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + this.secretKey)
      .digest('hex')
  }

  async initPayment(input: PaymentInitInput): Promise<PaymentInitResult> {
    // Mock implementation - in production, this would call iyzico API
    const conversationId = `CONV_${input.orderId}_${Date.now()}`
    const hashStr = `${this.apiKey}${conversationId}${Math.round(input.amount * 100)}${this.secretKey}`
    const hash = this.generateHash(hashStr)

    // In production, make actual API call to iyzico
    // For now, return a mock redirect URL
    const mockRedirectUrl = process.env.NODE_ENV === 'development'
      ? `/api/payments/iyzico/mock?conversationId=${conversationId}&hash=${hash}`
      : `https://sandbox-api.iyzipay.com/payment/auth?conversationId=${conversationId}&hash=${hash}`

    return {
      redirectUrl: mockRedirectUrl,
      providerRef: conversationId,
      requiresRedirect: true,
    }
  }

  async verifyWebhook(req: Request): Promise<PaymentWebhookResult> {
    const body = await req.json()
    const { conversationId, paymentStatus, paidPrice, hash } = body

    // Verify hash
    const hashStr = `${this.apiKey}${conversationId}${paymentStatus}${paidPrice}${this.secretKey}`
    const calculatedHash = this.generateHash(hashStr)

    if (calculatedHash !== hash) {
      throw new Error('Invalid iyzico webhook hash')
    }

    // Extract order ID from conversationId (format: CONV_{orderId}_{timestamp})
    const orderId = conversationId.split('_')[1]

    let paymentStatusEnum: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING'
    if (paymentStatus === 'SUCCESS') {
      paymentStatusEnum = 'PAID'
    } else if (paymentStatus === 'FAILURE') {
      paymentStatusEnum = 'FAILED'
    }

    return {
      orderId,
      status: paymentStatusEnum,
      providerRef: conversationId,
      amount: parseFloat(paidPrice) / 100,
      currency: 'TRY',
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentWebhookResult> {
    // In production, call iyzico API to get payment status
    // For now, return mock data
    return {
      orderId: providerRef.split('_')[1] || '',
      status: 'PENDING',
      providerRef,
      amount: 0,
      currency: 'TRY',
    }
  }
}

