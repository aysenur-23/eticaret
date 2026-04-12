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

interface AdminNewOrderProps {
  orderId: string
  orderData: any
}

const fmt = (n: any) =>
  (Number(n) || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })

export default function AdminNewOrder({ orderId, orderData }: AdminNewOrderProps) {
  const customer = orderData?.customer ?? {}
  const pricing  = orderData?.pricing ?? orderData?.orderData?.pricing ?? {}
  const items    = orderData?.items   ?? []
  const config   = orderData?.config  ?? orderData?.orderData?.config
  const choices  = orderData?.choices ?? orderData?.orderData?.choices
  const paymentMethod = orderData?.paymentMethod || '—'

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>

          <Section style={header}>
            <Text style={brand}>Voltekno — Admin</Text>
            <Text style={title}>Yeni Sipariş!</Text>
            <Text style={subtitle}>Sipariş No: <strong>{orderId}</strong></Text>
          </Section>

          <Section style={content}>

            {/* Müşteri */}
            <Section style={customerSection}>
              <Text style={sectionTitle}>Müşteri Bilgileri</Text>
              <Text style={detailText}><strong>Ad:</strong> {customer.name || '—'}</Text>
              <Text style={detailText}><strong>E-posta:</strong> {customer.email || '—'}</Text>
              <Text style={detailText}><strong>Telefon:</strong> {customer.phone || '—'}</Text>
              <Text style={detailText}><strong>Adres:</strong> {[customer.addressLine, customer.district, customer.city, customer.postalCode].filter(Boolean).join(', ') || '—'}</Text>
              <Text style={detailText}><strong>Ödeme Yöntemi:</strong> {paymentMethod}</Text>
              {customer.billingType === 'company' && (
                <>
                  <Text style={detailText}><strong>Şirket:</strong> {customer.companyName || '—'}</Text>
                  <Text style={detailText}><strong>Vergi No:</strong> {customer.taxId || '—'}</Text>
                  <Text style={detailText}><strong>Vergi Dairesi:</strong> {customer.taxOffice || '—'}</Text>
                </>
              )}
            </Section>

            {/* Sipariş kalemleri */}
            {items.length > 0 && (
              <Section style={orderSection}>
                <Text style={sectionTitle}>Sipariş Kalemleri</Text>
                {items.map((item: any, i: number) => (
                  <Text key={i} style={detailText}>
                    {item.productName || item.name} &times; {item.quantity}
                    {' — '}
                    {fmt(item.lineTotal ?? item.unitPrice * item.quantity)}
                  </Text>
                ))}
              </Section>
            )}

            {/* Konfigürasyon (varsa) */}
            {config && (
              <Section style={orderSection}>
                <Text style={sectionTitle}>Konfigürasyon</Text>
                {config.chemistry  != null && <Text style={detailText}><strong>Kimya:</strong> {config.chemistry}</Text>}
                {config.s          != null && <Text style={detailText}><strong>Konfigürasyon:</strong> {config.s}S{config.p}P</Text>}
                {config.usageType  != null && <Text style={detailText}><strong>Kullanım:</strong> {config.usageType}</Text>}
                {config.voltageClass != null && <Text style={detailText}><strong>Voltaj Sınıfı:</strong> {config.voltageClass}</Text>}
                {choices?.bms      != null && <Text style={detailText}><strong>BMS:</strong> {choices.bms}</Text>}
                {choices?.connector != null && <Text style={detailText}><strong>Konnektör:</strong> {choices.connector}</Text>}
              </Section>
            )}

            {/* Fiyat */}
            <Section style={pricingSection}>
              <Text style={sectionTitle}>Fiyat Detayları</Text>
              <Text style={detailText}>Ara Toplam: {fmt(pricing.subtotal)}</Text>
              <Text style={detailText}>KDV (%20): {fmt(pricing.tax)}</Text>
              <Text style={detailText}>Kargo: {Number(pricing.shipping) > 0 ? fmt(pricing.shipping) : 'Ücretsiz'}</Text>
              <Text style={totalText}><strong>Toplam: {fmt(pricing.total)}</strong></Text>
            </Section>

            <Section style={actionSection}>
              <Button
                href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://voltekno.com'}/admin/orders/${orderId}`}
                style={button}
              >
                Siparişi Görüntüle
              </Button>
            </Section>

            <Hr style={hr} />
            <Text style={paragraph}>Admin panelinden siparişi yönetebilirsiniz.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' }
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' }
const header = { padding: '32px 24px 0', textAlign: 'center' as const }
const brand = { color: '#dc2626', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '0 0 4px' }
const title = { color: '#dc2626', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px' }
const subtitle = { color: '#374151', fontSize: '16px', margin: '0 0 24px' }
const content = { padding: '0 24px' }
const paragraph = { color: '#374151', fontSize: '14px', lineHeight: '24px', margin: '0 0 16px' }
const customerSection = { backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', margin: '16px 0' }
const orderSection = { backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', margin: '16px 0' }
const pricingSection = { backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', margin: '16px 0' }
const actionSection = { textAlign: 'center' as const, margin: '24px 0' }
const sectionTitle = { color: '#1f2937', fontSize: '15px', fontWeight: 'bold', margin: '0 0 10px' }
const detailText = { color: '#374151', fontSize: '14px', margin: '0 0 6px' }
const totalText = { color: '#1f2937', fontSize: '16px', fontWeight: 'bold', margin: '8px 0 0', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }
const button = { backgroundColor: '#dc2626', borderRadius: '6px', color: '#ffffff', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 24px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
