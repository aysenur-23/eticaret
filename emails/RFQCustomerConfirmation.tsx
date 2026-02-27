import React from 'react'
import { Html, Head, Body, Container, Section, Text } from '@react-email/components'

interface RFQCustomerConfirmationProps {
  contactName?: string
  rfqId?: string
  [key: string]: unknown
}

export default function RFQCustomerConfirmation(props: RFQCustomerConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Teklif talebiniz alındı. Referans: {props.rfqId || '-'}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
