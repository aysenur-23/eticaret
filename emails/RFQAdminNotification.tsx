import React from 'react'
import { Html, Head, Body, Container, Section, Text } from '@react-email/components'

interface RFQAdminNotificationProps {
  rfqId?: string
  [key: string]: unknown
}

export default function RFQAdminNotification(props: RFQAdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Yeni teklif talebi: {props.rfqId || '-'}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
