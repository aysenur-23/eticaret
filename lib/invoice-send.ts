/**
 * Fatura PDF oluşturur, isteğe bağlı storage'a yükler ve müşteriye e-posta ile gönderir (PDF ekli).
 */

import { generateInvoicePDF } from './pdf'
import { uploadInvoice } from './storage'
import { sendEmail } from './email'
import type { InvoiceData } from './invoice-data'

export async function generateAndSendInvoice(
  orderId: string,
  orderData: InvoiceData,
  customerEmail: string
): Promise<{ sent: boolean; invoiceUrl?: string; error?: string }> {
  if (!customerEmail?.trim()) {
    return { sent: false, error: 'Müşteri e-postası yok' }
  }

  try {
    const pdfBuffer = await generateInvoicePDF(orderId, orderData)

    let invoiceUrl: string | undefined
    try {
      invoiceUrl = await uploadInvoice(orderId, pdfBuffer)
    } catch (e) {
      console.warn('Fatura storage yüklenemedi, e-posta eki ile gönderiliyor:', e)
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Faturanız</h2>
        <p>Merhaba ${orderData.customer.name},</p>
        <p><strong>Sipariş No:</strong> ${orderId}</p>
        <p>Faturanız ektedir.${invoiceUrl ? ` İndirmek için: <a href="${invoiceUrl}">Fatura PDF</a>` : ''}</p>
        <p>İyi günler,<br>Batarya Kit</p>
      </div>
    `

    const result = await sendEmail(
      customerEmail,
      `Fatura - ${orderId}`,
      htmlBody,
      [{ filename: `fatura-${orderId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    )

    if (result.success) {
      return { sent: true, invoiceUrl }
    }
    return { sent: false, error: result.error }
  } catch (error) {
    console.error('generateAndSendInvoice error:', error)
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Fatura gönderilemedi',
    }
  }
}
