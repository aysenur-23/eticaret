import type { Metadata } from 'next'
import React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://voltekno.com'

export const metadata: Metadata = {
  title: 'İletişim — Teknik Destek ve Ürün Teklifi',
  description:
    'voltekno ile iletişime geçin. Güneş paneli, akü, inverter ve EV şarj ürünleri için fiyat teklifi, teknik destek ve kurulum danışmanlığı. Antalya merkezli, Türkiye geneli hizmet.',
  keywords: [
    'voltekno iletişim',
    'güneş paneli teklif',
    'ges teklif al',
    'akü fiyat teklifi',
    'enerji sistemi danışmanlık',
    'teknik destek güneş',
    'solar sistem kurulum',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'İletişim | voltekno',
    description: 'Güneş paneli, akü ve EV şarj için fiyat teklifi ve teknik destek.',
    type: 'website',
    siteName: 'voltekno',
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'voltekno İletişim',
            url: `${SITE_URL}/contact`,
            description: 'Güneş paneli, akü, inverter ve EV şarj için iletişim sayfası.',
            mainEntity: {
              '@type': 'LocalBusiness',
              name: 'voltekno',
              url: SITE_URL,
              telephone: '+90-534-328-83-83',
              email: 'info@voltekno.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Antalya',
                addressCountry: 'TR',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00',
                },
              ],
              priceRange: '₺₺',
              areaServed: 'TR',
              sameAs: [],
            },
          }),
        }}
      />
      {children}
    </>
  )
}
