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

interface QuoteReadyProps {
  contactName: string
  companyName: string
  rfqId: string
  itemCount: number
  tekliflerimUrl: string
}

export default function QuoteReady({
  contactName,
  companyName,
  rfqId,
  itemCount,
  tekliflerimUrl,
}: QuoteReadyProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={title}>Fiyat Teklifiniz Hazır</Text>
            <Text style={subtitle}>Batarya Kit</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Sayın {contactName},</Text>
            <Text style={paragraph}>
              <strong>{companyName}</strong> adına gönderdiğiniz teklif talebine fiyat verilmiştir.
            </Text>
            <Text style={paragraph}>
              <strong>{itemCount}</strong> kalem için hazırlanan teklifi görüntülemek ve isterseniz sepete ekleyip sipariş vermek için aşağıdaki butonu kullanabilirsiniz. Giriş yapmanız gerekebilir.
            </Text>
            <Text style={paragraph}>
              Referans: <strong>{rfqId}</strong>
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={tekliflerimUrl}>
                Tekliflerim sayfasına git
              </Button>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              Sorularınız için iletişim sayfamızdan veya e-posta ile bize ulaşabilirsiniz.
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
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const subtitle = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 24px',
}

const content = {
  padding: '0 24px',
}

const greeting = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#2563eb',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
}
