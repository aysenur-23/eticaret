/**
 * PayTR Payment Adapter
 * Implements PaymentAdapter interface for PayTR payments
 * Note: This is a mock implementation for development
 */

import crypto from 'crypto'
import { PaymentAdapter, PaymentInitInput, PaymentInitResult, PaymentWebhookResult } from './base'

export class PayTRAdapter implements PaymentAdapter {
  private merchantId: string
  private merchantKey: string
  private merchantSalt: string

  constructor() {
    this.merchantId = process.env.PAYTR_MERCHANT_ID || 'mock_merchant_id'
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY || 'mock_merchant_key'
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'mock_merchant_salt'
  }

  private generateHash(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + this.merchantSalt)
      .digest('base64')
  }

  async initPayment(input: PaymentInitInput): Promise<PaymentInitResult> {
    // Mock implementation - in production, this would call PayTR API
    const merchantOid = `ORDER_${input.orderId}_${Date.now()}`
    const hashStr = `${this.merchantId}${merchantOid}${input.customer.email}${Math.round(input.amount * 100)}${this.merchantSalt}`
    const hash = this.generateHash(hashStr)

    // In production, make actual API call to PayTR
    // For now, return a mock redirect URL
    const mockRedirectUrl = process.env.NODE_ENV === 'development'
      ? `/api/payments/paytr/mock?merchantOid=${merchantOid}&hash=${hash}`
      : `https://www.paytr.com/odeme?merchantOid=${merchantOid}&hash=${hash}`

    return {
      redirectUrl: mockRedirectUrl,
      providerRef: merchantOid,
      requiresRedirect: true,
    }
  }

  async verifyWebhook(req: Request): Promise<PaymentWebhookResult> {
    const body = await req.json()
    const { merchant_oid, status, total_amount, hash } = body

    // Verify hash
    const hashStr = `${merchant_oid}${this.merchantSalt}${status}${total_amount}`
    const calculatedHash = this.generateHash(hashStr)

    if (calculatedHash !== hash) {
      throw new Error('Invalid PayTR webhook hash')
    }

    // Extract order ID from merchant_oid (format: ORDER_{orderId}_{timestamp})
    const orderId = merchant_oid.split('_')[1]

    let paymentStatus: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING'
    if (status === 'success') {
      paymentStatus = 'PAID'
    } else if (status === 'failed') {
      paymentStatus = 'FAILED'
    }

    return {
      orderId,
      status: paymentStatus,
      providerRef: merchant_oid,
      amount: parseFloat(total_amount) / 100,
      currency: 'TRY',
    }
  }

  async getPaymentStatus(providerRef: string): Promise<PaymentWebhookResult> {
    // In production, call PayTR API to get payment status
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

