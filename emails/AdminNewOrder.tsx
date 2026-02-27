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

export default function AdminNewOrder({
  orderId,
  orderData,
}: AdminNewOrderProps) {
  const { customer, config, choices, pricing } = orderData

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={title}>Yeni Sipariş!</Text>
            <Text style={subtitle}>
              Sipariş No: <strong>{orderId}</strong>
            </Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Yeni bir sipariş alındı:</Text>

            <Section style={customerSection}>
              <Text style={sectionTitle}>Müşteri Bilgileri</Text>
              <Text style={detailText}>
                <strong>Ad:</strong> {customer.name}
              </Text>
              <Text style={detailText}>
                <strong>E-posta:</strong> {customer.email}
              </Text>
              <Text style={detailText}>
                <strong>Telefon:</strong> {customer.phone}
              </Text>
              <Text style={detailText}>
                <strong>Adres:</strong> {customer.addressLine}, {customer.district}, {customer.city} {customer.postalCode}
              </Text>
              {customer.billingType === 'company' && (
                <>
                  <Text style={detailText}>
                    <strong>Şirket:</strong> {customer.companyName}
                  </Text>
                  <Text style={detailText}>
                    <strong>Vergi No:</strong> {customer.taxId}
                  </Text>
                  <Text style={detailText}>
                    <strong>Vergi Dairesi:</strong> {customer.taxOffice}
                  </Text>
                </>
              )}
            </Section>

            <Section style={orderSection}>
              <Text style={sectionTitle}>Sipariş Detayları</Text>
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
              <Text style={detailText}>
                <strong>Şerit:</strong> {choices.strip}
              </Text>
              {choices.charger && (
                <Text style={detailText}>
                  <strong>Şarj Cihazı:</strong> {choices.charger}
                </Text>
              )}
              {choices.dcdc && (
                <Text style={detailText}>
                  <strong>DC-DC:</strong> {choices.dcdc}
                </Text>
              )}
              {choices.enclosure && (
                <Text style={detailText}>
                  <strong>Kasa:</strong> {choices.enclosure}
                </Text>
              )}
              {choices.tools.length > 0 && (
                <Text style={detailText}>
                  <strong>Aletler:</strong> {choices.tools.join(', ')}
                </Text>
              )}
            </Section>

            <Section style={pricingSection}>
              <Text style={sectionTitle}>Fiyat Detayları</Text>
              <Text style={detailText}>
                Ara Toplam: {pricing.subtotal.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </Text>
              <Text style={detailText}>
                KDV (%20): {pricing.tax.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </Text>
              <Text style={detailText}>
                Kargo: {pricing.shipping.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </Text>
              <Text style={totalText}>
                <strong>Toplam: {pricing.total.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}</strong>
              </Text>
            </Section>

            <Section style={actionSection}>
              <Button
                href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderId}`}
                style={button}
              >
                Siparişi Görüntüle
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              Bu siparişi yönetmek için admin paneline giriş yapın.
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
  color: '#dc2626',
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

const customerSection = {
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const orderSection = {
  backgroundColor: '#f0f9ff',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const pricingSection = {
  backgroundColor: '#f0fdf4',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const actionSection = {
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
