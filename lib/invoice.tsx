import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register font for Turkish characters
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  orderDetails: {
    fontSize: 12,
  },
  customerInfo: {
    fontSize: 12,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  colSku: {
    width: '15%',
    fontSize: 10,
  },
  colTitle: {
    width: '45%',
    fontSize: 10,
  },
  colQty: {
    width: '10%',
    fontSize: 10,
    textAlign: 'center',
  },
  colPrice: {
    width: '15%',
    fontSize: 10,
    textAlign: 'right',
  },
  colTotal: {
    width: '15%',
    fontSize: 10,
    textAlign: 'right',
  },
  totals: {
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    fontSize: 12,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    borderTop: '2 solid #2563eb',
  },
  footer: {
    marginTop: 50,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
})

interface InvoiceDocumentProps {
  orderId: string
  orderData: any
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  orderId,
  orderData,
}) => {
  const { customer, config, choices, pricing } = orderData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>
            {process.env.COMPANY_LEGAL_NAME || 'Batarya Kit'}
          </Text>
          <View style={styles.companyInfo}>
            <Text>
              {process.env.COMPANY_ADDRESS || 'Adres satırı, İl/İlçe, Türkiye'}
            </Text>
            <Text>
              Vergi No: {process.env.COMPANY_TAX_ID || '1234567890'} |
              Vergi Dairesi: {process.env.COMPANY_TAX_OFFICE || 'İSTANBUL'}
            </Text>
            <Text>
              Tel: {process.env.COMPANY_PHONE || '+90 5XX XXX XX XX'} |
              E-posta: {process.env.COMPANY_EMAIL || 'support@example.com'}
            </Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>FATURA</Text>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <View style={styles.orderDetails}>
            <Text>Sipariş No: {orderId}</Text>
            <Text>Tarih: {new Date().toLocaleDateString('tr-TR')}</Text>
            <Text>Durum: {orderData.status || 'Yeni'}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={{ fontWeight: 'bold' }}>Müşteri Bilgileri:</Text>
            <Text>{customer.name}</Text>
            <Text>{customer.email}</Text>
            <Text>{customer.phone}</Text>
            <Text>{customer.addressLine}</Text>
            <Text>{customer.district}, {customer.city} {customer.postalCode}</Text>
            {customer.billingType === 'company' && (
              <>
                <Text>Şirket: {customer.companyName}</Text>
                <Text>Vergi No: {customer.taxId}</Text>
                <Text>Vergi Dairesi: {customer.taxOffice}</Text>
              </>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colSku}>SKU</Text>
            <Text style={styles.colTitle}>Açıklama</Text>
            <Text style={styles.colQty}>Adet</Text>
            <Text style={styles.colPrice}>Birim Fiyat</Text>
            <Text style={styles.colTotal}>Toplam</Text>
          </View>
          {pricing.items.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colSku}>{item.sku}</Text>
              <Text style={styles.colTitle}>{item.title}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>
                {item.unitPrice.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </Text>
              <Text style={styles.colTotal}>
                {item.total.toLocaleString('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                })}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Ara Toplam:</Text>
            <Text>
              {pricing.subtotal.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>KDV (%20):</Text>
            <Text>
              {pricing.tax.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Kargo:</Text>
            <Text>
              {pricing.shipping.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </Text>
          </View>
          <View style={styles.totalRowFinal}>
            <Text>GENEL TOPLAM:</Text>
            <Text>
              {pricing.total.toLocaleString('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              })}
            </Text>
          </View>
        </View>


        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Bu fatura elektronik ortamda düzenlenmiştir ve imza gerektirmez.
          </Text>
          <Text>
            Ödeme: Stripe ile işlenmiştir. Ödeme ID: {orderData.payment?.stripeSessionId || 'N/A'}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
