import type { Metadata, Viewport } from 'next'
import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import IntlProvider from './IntlProvider'
import { FirebaseAnalyticsInit } from '@/components/FirebaseAnalyticsInit'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0f172a',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://bataryakit.com'),
  title: 'TommaTech Türkiye | Güneş Paneli, İnverter, Batarya & EV Şarj Sistemleri',
  description: 'TommaTech ürünleri: güneş paneli, hibrit inverter, lityum batarya paketi, EV şarj istasyonu ve ısı pompası. Türkiye geneli hızlı kargo, teknik destek.',
  keywords: 'güneş paneli, inverter, lityum batarya, ev şarj istasyonu, ısı pompası, ges sistemi, tommatech, enerji depolama, solar panel, hibrit inverter, off-grid',
  authors: [{ name: 'TommaTech Türkiye' }],
  creator: 'TommaTech Türkiye',
  publisher: 'TommaTech Türkiye',
  robots: 'index, follow',
  // Favicon: app/icon.png ve app/icon.svg Next.js tarafından otomatik kullanılır
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://bataryakit.com',
    siteName: 'TommaTech Türkiye',
    title: 'TommaTech Türkiye | Güneş Paneli, İnverter, Batarya & EV Şarj Sistemleri',
    description: 'TommaTech ürünleri: güneş paneli, hibrit inverter, lityum batarya paketi, EV şarj istasyonu ve ısı pompası. Türkiye geneli hızlı kargo, teknik destek.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'TommaTech - Güneş Enerjisi ve Batarya Sistemleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TommaTech Türkiye | Güneş Paneli, İnverter, Batarya & EV Şarj Sistemleri',
    description: 'TommaTech ürünleri: güneş paneli, hibrit inverter, lityum batarya paketi, EV şarj istasyonu ve ısı pompası.',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://bataryakit.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <IntlProvider>
          <FirebaseAnalyticsInit />
          {children}
        </IntlProvider>
      </body>
    </html>
  )
}
