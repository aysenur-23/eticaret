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

interface EmailVerificationProps {
  name: string
  verificationUrl: string
  verificationCode?: string
}

export function EmailVerification({
  name,
  verificationUrl,
  verificationCode,
}: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🔋 Batarya Kit</Text>
          </Section>
          
          <Section style={content}>
            <Text style={title}>E-posta Adresinizi Doğrulayın</Text>
            
            <Text style={text}>
              Merhaba <strong>{name}</strong>,
            </Text>
            
            <Text style={text}>
              Batarya Kit'e hoş geldiniz! Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekiyor.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                E-postayı Doğrula
              </Button>
            </Section>

            {verificationCode && (
              <>
                <Text style={text}>
                  Veya aşağıdaki doğrulama kodunu kullanabilirsiniz:
                </Text>
                <Section style={codeContainer}>
                  <Text style={code}>{verificationCode}</Text>
                </Section>
              </>
            )}

            <Text style={text}>
              Bu link 24 saat geçerlidir. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
            </Text>
            <Text style={footer}>
              © {new Date().getFullYear()} Batarya Kit. Tüm hakları saklıdır.
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
  padding: '32px 24px',
  backgroundColor: '#2563eb',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const content = {
  padding: '0 48px',
}

const title = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1a202c',
  margin: '32px 0 24px',
}

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const codeContainer = {
  backgroundColor: '#f7fafc',
  borderRadius: '6px',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const code = {
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  color: '#2563eb',
  margin: '0',
  fontFamily: 'monospace',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
}

const footer = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
}

