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

interface ShipmentNoticeProps {
  orderId: string
  orderData: any
}

export default function ShipmentNotice({
  orderId,
  orderData,
}: ShipmentNoticeProps) {
  const { customer, config, choices } = orderData

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={title}>Siparişiniz Kargoya Verildi!</Text>
            <Text style={subtitle}>
              Sipariş No: <strong>{orderId}</strong>
            </Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Merhaba {customer.name},</Text>
            
            <Text style={paragraph}>
              Siparişiniz hazırlanmış ve kargoya verilmiştir. Yakında elinize ulaşacaktır.
            </Text>

            <Section style={orderDetails}>
              <Text style={sectionTitle}>Sipariş Özeti</Text>
              <Text style={detailText}>
                <strong>Kimya:</strong> {config.chemistry}
              </Text>
              <Text style={detailText}>
                <strong>Konfigürasyon:</strong> {config.s}S{config.p}P
              </Text>
              <Text style={detailText}>
                <strong>Kullanım:</strong> {config.usageType}
              </Text>
              <Text style={detailText}>
                <strong>Voltaj Sınıfı:</strong> {config.voltageClass}
              </Text>
              <Text style={detailText}>
                <strong>BMS:</strong> {choices.bms}
              </Text>
              <Text style={detailText}>
                <strong>Konnektör:</strong> {choices.connector}
              </Text>
            </Section>

            <Section style={shippingInfo}>
              <Text style={sectionTitle}>Kargo Bilgileri</Text>
              <Text style={detailText}>
                <strong>Gönderim Adresi:</strong>
              </Text>
              <Text style={addressText}>
                {customer.name}<br />
                {customer.addressLine}<br />
                {customer.district}, {customer.city} {customer.postalCode}<br />
                {customer.country}
              </Text>
              
              <Text style={detailText}>
                <strong>Kargo Takip:</strong> Kargo takip numarası kargo firması tarafından SMS ile gönderilecektir.
              </Text>
            </Section>

            <Section style={importantNotes}>
              <Text style={sectionTitle}>Önemli Notlar</Text>
              <Text style={detailText}>
                • Paketi teslim alırken hasar kontrolü yapın
              </Text>
              <Text style={detailText}>
                • Herhangi bir sorun durumunda derhal bizimle iletişime geçin
              </Text>
              <Text style={detailText}>
                • Montaj öncesi güvenlik talimatlarını okuyun
              </Text>
              <Text style={detailText}>
                • İlk kullanımda hücre voltajlarını kontrol edin
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              Siparişinizle ilgili herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
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
  color: '#059669',
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
  backgroundColor: '#f0f9ff',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const shippingInfo = {
  backgroundColor: '#f0fdf4',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const importantNotes = {
  backgroundColor: '#fef3c7',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
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

const addressText = {
  color: '#374151',
  fontSize: '14px',
  margin: '8px 0',
  fontStyle: 'italic',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}
