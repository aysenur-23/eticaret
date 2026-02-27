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

interface PasswordResetEmailProps {
  name: string
  resetUrl: string
}

export default function PasswordResetEmail({
  name,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🔋 Batarya Kit</Text>
          </Section>
          
          <Section style={content}>
            <Text style={title}>Şifre Sıfırlama</Text>
            
            <Text style={text}>
              Merhaba <strong>{name}</strong>,
            </Text>
            
            <Text style={text}>
              Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın. Bu bağlantı 1 saat süreyle geçerlidir.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Şifremi Sıfırla
              </Button>
            </Section>

            <Text style={text}>
              Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Şifreniz değişmeyecektir.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Bu bağlantı 1 saat süreyle geçerlidir. Bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:
            </Text>
            <Text style={linkText}>
              {resetUrl}
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

const logo = {
  color: '#2563eb',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const content = {
  padding: '0 24px',
}

const title = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
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

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
}

const linkText = {
  color: '#2563eb',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  margin: '0',
}

