import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'

interface OrderConfirmationProps {
  orderId: string
  orderData: any
}

export default function OrderConfirmation({
  orderId,
  orderData,
}: OrderConfirmationProps) {
  const { customer, config, choices, pricing } = orderData || {}
  const hasConfig = config && (config.chemistry != null || config.s != null || config.usageType != null)
  const hasChoices = choices && (choices.bms != null || choices.connector != null)
  const subtotal = Number(pricing?.subtotal) ?? 0
  const tax = Number(pricing?.tax) ?? 0
  const shipping = Number(pricing?.shipping) ?? 0
  const total = Number(pricing?.total) ?? 0

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={title}>Siparişiniz oluşturuldu</Text>
            <Text style={subtitle}>
              Sipariş No: <strong>{orderId}</strong>
            </Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Merhaba {customer?.name || 'Müşteri'},</Text>
            
            <Text style={paragraph}>
              Siparişiniz başarıyla oluşturulmuştur. Sipariş numaranız: <strong>{orderId}</strong>. Aşağıda özet bilgileri bulabilirsiniz.
            </Text>

            {(hasConfig || hasChoices) && (
              <Section style={orderDetails}>
                <Text style={sectionTitle}>Sipariş Özeti</Text>
                {config?.chemistry != null && <Text style={detailText}><strong>Kimya:</strong> {config.chemistry}</Text>}
                {(config?.s != null || config?.p != null) && <Text style={detailText}><strong>Konfigürasyon:</strong> {config.s}S{config.p}P</Text>}
                {config?.usageType != null && <Text style={detailText}><strong>Kullanım:</strong> {config.usageType}</Text>}
                {config?.voltageClass != null && <Text style={detailText}><strong>Voltaj Sınıfı:</strong> {config.voltageClass}</Text>}
                {choices?.bms != null && <Text style={detailText}><strong>BMS:</strong> {choices.bms}</Text>}
                {choices?.connector != null && <Text style={detailText}><strong>Konnektör:</strong> {choices.connector}</Text>}
              </Section>
            )}

            <Section style={pricingSection}>
              <Text style={sectionTitle}>Fiyat Detayları</Text>
              <Text style={detailText}>
                Ara Toplam: {subtotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </Text>
              <Text style={detailText}>
                KDV (%20): {tax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </Text>
              <Text style={detailText}>
                Kargo: {shipping.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </Text>
              <Text style={totalText}>
                <strong>Toplam: {total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong>
              </Text>
            </Section>

            {orderData.payment?.invoiceUrl && (
              <Section style={invoiceSection}>
                <Text style={sectionTitle}>Fatura</Text>
                <Button
                  href={orderData.payment.invoiceUrl}
                  style={button}
                >
                  Faturayı İndir
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={paragraph}>
              Siparişiniz hazırlandığında size e-posta ile bilgi verilecektir.
              Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
            </Text>

            <Text style={paragraph}>
              Teşekkürler,<br />
              Batarya Kit Ekibi
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 24px 0',
  textAlign: 'center' as const,
}

const title = {
  color: '#2563eb',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const subtitle = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 24px',
}

const content = {
  padding: '0 24px',
}

const greeting = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const orderDetails = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const pricingSection = {
  backgroundColor: '#f0f9ff',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const invoiceSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const sectionTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const detailText = {
  color: '#374151',
  fontSize: '14px',
  margin: '0 0 8px',
}

const totalText = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '8px 0 0',
  paddingTop: '8px',
  borderTop: '1px solid #e5e7eb',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}
