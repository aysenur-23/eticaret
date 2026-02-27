import { sendEmail } from './email'
import { updateOrderStatus } from './admin'
import OrderConfirmation from '../emails/OrderConfirmation'
import AdminNewOrder from '../emails/AdminNewOrder'
import ShipmentNotice from '../emails/ShipmentNotice'
import RFQAdminNotification from '../emails/RFQAdminNotification'
import RFQCustomerConfirmation from '../emails/RFQCustomerConfirmation'
import QuoteReady from '../emails/QuoteReady'

export interface NotificationData {
  orderId: string
  orderData: any
  customer: any
  config?: any
  choices?: any
  pricing?: any
}

// Sipariş oluşturuldu e-postası: müşteriye "Siparişiniz oluşturuldu" + sipariş numarası
export async function sendOrderConfirmation(data: NotificationData): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.customer.email,
      `Siparişiniz oluşturuldu - ${data.orderId}`,
      OrderConfirmation({
        orderId: data.orderId,
        orderData: data
      })
    )
    
    if (result.success) {
      console.log(`Order confirmation sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send order confirmation:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return false
  }
}

// Send new order notification to admin
export async function sendAdminNewOrderNotification(data: NotificationData): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bataryakit.com'
    
    const result = await sendEmail(
      adminEmail,
      `Yeni Sipariş - ${data.orderId}`,
      AdminNewOrder({
        orderId: data.orderId,
        orderData: data
      })
    )
    
    if (result.success) {
      console.log(`New order notification sent to admin`)
      return true
    } else {
      console.error('Failed to send admin notification:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return false
  }
}

// Send shipment notice to customer
export async function sendShipmentNotice(data: NotificationData, trackingNumber: string): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.customer.email,
      `Kargo Takip Bilgisi - ${data.orderId}`,
      ShipmentNotice({
        orderId: data.orderId,
        orderData: {
          ...data,
          trackingNumber
        }
      })
    )
    
    if (result.success) {
      console.log(`Shipment notice sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send shipment notice:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending shipment notice:', error)
    return false
  }
}

// Send order status update to customer
export async function sendOrderStatusUpdate(data: NotificationData, newStatus: string): Promise<boolean> {
  try {
    const statusMessages = {
      confirmed: {
        subject: `Sipariş Onaylandı - ${data.orderId}`,
        message: 'Siparişiniz onaylanmıştır ve işleme alınmıştır.'
      },
      processing: {
        subject: `Sipariş İşleme Alındı - ${data.orderId}`,
        message: 'Siparişiniz üretim aşamasına geçmiştir.'
      },
      shipped: {
        subject: `Sipariş Kargoya Verildi - ${data.orderId}`,
        message: 'Siparişiniz kargoya verilmiştir.'
      },
      delivered: {
        subject: `Sipariş Teslim Edildi - ${data.orderId}`,
        message: 'Siparişiniz başarıyla teslim edilmiştir.'
      },
      cancelled: {
        subject: `Sipariş İptal Edildi - ${data.orderId}`,
        message: 'Siparişiniz iptal edilmiştir.'
      }
    }

    const statusInfo = statusMessages[newStatus as keyof typeof statusMessages]
    if (!statusInfo) {
      console.warn(`Unknown status: ${newStatus}`)
      return false
    }

    const result = await sendEmail(
      data.customer.email,
      statusInfo.subject,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sipariş Durumu Güncellendi</h2>
          <p>Merhaba ${data.customer.name},</p>
          <p>${statusInfo.message}</p>
          <p><strong>Sipariş No:</strong> ${data.orderId}</p>
          <p><strong>Yeni Durum:</strong> ${newStatus}</p>
          <p>Detaylı bilgi için admin panelimizi ziyaret edebilirsiniz.</p>
          <p>İyi günler,<br>Batarya Kit Ekibi</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`Order status update sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send order status update:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending order status update:', error)
    return false
  }
}

// Send payment confirmation to customer
export async function sendPaymentConfirmation(data: NotificationData): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.customer.email,
      `Ödeme Onayı - ${data.orderId}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ödemeniz Onaylandı</h2>
          <p>Merhaba ${data.customer.name},</p>
          <p>Siparişiniz için yapılan ödeme başarıyla onaylanmıştır.</p>
          <p><strong>Sipariş No:</strong> ${data.orderId}</p>
          <p><strong>Ödeme Tutarı:</strong> ${data.pricing?.total || 0} ₺</p>
          <p>Siparişiniz işleme alınacaktır.</p>
          <p>İyi günler,<br>Batarya Kit Ekibi</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`Payment confirmation sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send payment confirmation:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending payment confirmation:', error)
    return false
  }
}

// Send payment failure notification to customer
export async function sendPaymentFailureNotification(data: NotificationData): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.customer.email,
      `Ödeme Hatası - ${data.orderId}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ödeme İşlemi Başarısız</h2>
          <p>Merhaba ${data.customer.name},</p>
          <p>Siparişiniz için yapılan ödeme işlemi başarısız olmuştur.</p>
          <p><strong>Sipariş No:</strong> ${data.orderId}</p>
          <p>Lütfen ödeme bilgilerinizi kontrol ederek tekrar deneyiniz.</p>
          <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
          <p>İyi günler,<br>Batarya Kit Ekibi</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`Payment failure notification sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send payment failure notification:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending payment failure notification:', error)
    return false
  }
}

// Send refund notification to customer
export async function sendRefundNotification(data: NotificationData, refundAmount: number): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.customer.email,
      `İade İşlemi - ${data.orderId}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>İade İşlemi Tamamlandı</h2>
          <p>Merhaba ${data.customer.name},</p>
          <p>Siparişiniz için iade işlemi başarıyla tamamlanmıştır.</p>
          <p><strong>Sipariş No:</strong> ${data.orderId}</p>
          <p><strong>İade Tutarı:</strong> ${refundAmount} ₺</p>
          <p>İade tutarı 3-5 iş günü içinde hesabınıza yansıyacaktır.</p>
          <p>İyi günler,<br>Batarya Kit Ekibi</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`Refund notification sent to ${data.customer.email}`)
      return true
    } else {
      console.error('Failed to send refund notification:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending refund notification:', error)
    return false
  }
}

// Send low stock notification to admin
export async function sendLowStockNotification(productName: string, currentStock: number, minStock: number): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bataryakit.com'
    
    const result = await sendEmail(
      adminEmail,
      `Düşük Stok Uyarısı - ${productName}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Düşük Stok Uyarısı</h2>
          <p>Merhaba Admin,</p>
          <p>Aşağıdaki ürünün stok seviyesi kritik seviyeye düşmüştür:</p>
          <p><strong>Ürün:</strong> ${productName}</p>
          <p><strong>Mevcut Stok:</strong> ${currentStock}</p>
          <p><strong>Minimum Stok:</strong> ${minStock}</p>
          <p>Lütfen stok takviyesi yapınız.</p>
          <p>İyi günler,<br>Sistem</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`Low stock notification sent to admin`)
      return true
    } else {
      console.error('Failed to send low stock notification:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending low stock notification:', error)
    return false
  }
}

// Send system error notification to admin
export async function sendSystemErrorNotification(error: string, context: string): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bataryakit.com'
    
    const result = await sendEmail(
      adminEmail,
      `Sistem Hatası - ${new Date().toLocaleDateString('tr-TR')}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sistem Hatası Bildirimi</h2>
          <p>Merhaba Admin,</p>
          <p>Sistemde bir hata oluşmuştur:</p>
          <p><strong>Hata:</strong> ${error}</p>
          <p><strong>Bağlam:</strong> ${context}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          <p>Lütfen hatayı inceleyiniz.</p>
          <p>İyi günler,<br>Sistem</p>
        </div>
      `
    )
    
    if (result.success) {
      console.log(`System error notification sent to admin`)
      return true
    } else {
      console.error('Failed to send system error notification:', result.error)
      return false
    }
  } catch (error) {
    console.error('Error sending system error notification:', error)
    return false
  }
}

// RFQ (Teklif Talebi) bildirimleri
export interface RFQNotificationData {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string | null
  targetQty?: number | null
  targetPrice?: number | null
  targetCurrency?: string | null
  notes?: string | null
  createdAt: Date
  items: Array<{
    description: string
    quantity: number
    unitPrice?: number | null
    mpn?: string | null
    sku?: string | null
    notes?: string | null
    serviceSlug?: string
    designFileUrl?: string
  }>
}

export async function sendRFQAdminNotification(data: RFQNotificationData): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL || process.env.SMTP_USER || 'info@bataryakit.com'
    const result = await sendEmail(
      adminEmail,
      `Yeni Teklif Talebi - ${data.companyName}`,
      RFQAdminNotification({
        rfqId: data.id,
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        targetQty: data.targetQty,
        targetPrice: data.targetPrice,
        targetCurrency: data.targetCurrency,
        notes: data.notes,
        items: data.items,
        createdAt: new Date(data.createdAt).toLocaleString('tr-TR'),
      })
    )
    if (result.success) {
      console.log('RFQ admin notification sent to', adminEmail)
      return true
    }
    console.error('Failed to send RFQ admin notification:', result.error)
    return false
  } catch (error) {
    console.error('Error sending RFQ admin notification:', error)
    return false
  }
}

export async function sendRFQCustomerConfirmation(data: RFQNotificationData): Promise<boolean> {
  try {
    const result = await sendEmail(
      data.contactEmail,
      'Teklif Talebiniz Alındı - Batarya Kit',
      RFQCustomerConfirmation({
        contactName: data.contactName,
        companyName: data.companyName,
        rfqId: data.id,
        itemCount: data.items.length,
      })
    )
    if (result.success) {
      console.log('RFQ customer confirmation sent to', data.contactEmail)
      return true
    }
    console.error('Failed to send RFQ customer confirmation:', result.error)
    return false
  } catch (error) {
    console.error('Error sending RFQ customer confirmation:', error)
    return false
  }
}

/** Admin fiyat verdiğinde müşteriye "Teklif hazır" e-postası (Tekliflerim linki ile) */
export async function sendQuoteReadyToCustomer(data: {
  contactEmail: string
  contactName: string
  companyName: string
  rfqId: string
  itemCount: number
}): Promise<boolean> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://bataryakit.com')
    const tekliflerimUrl = `${String(baseUrl).replace(/\/$/, '')}/tekliflerim`
    const result = await sendEmail(
      data.contactEmail,
      'Fiyat Teklifiniz Hazır - Batarya Kit',
      QuoteReady({
        contactName: data.contactName,
        companyName: data.companyName,
        rfqId: data.rfqId,
        itemCount: data.itemCount,
        tekliflerimUrl,
      })
    )
    if (result.success) {
      console.log('Quote ready email sent to', data.contactEmail)
      return true
    }
    console.error('Failed to send quote ready email:', result.error)
    return false
  } catch (error) {
    console.error('Error sending quote ready email:', error)
    return false
  }
}
