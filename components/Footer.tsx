'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from './Logo'
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'

function NewsletterForm() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStatus('loading')
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { getDb } = await import('@/lib/firebase/config')
      const db = getDb()
      await addDoc(collection(db, 'newsletter'), {
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-green-400 py-2">Kaydınız alındı, teşekkürler!</p>
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="E-posta adresiniz"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
        required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-brand hover:bg-brand-hover text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </button>
      {status === 'error' && <p className="text-xs text-red-400">Bir hata oluştu, tekrar deneyin.</p>}
    </form>
  )
}

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-[hsl(var(--ink))] to-[hsl(222,47%,5%)] text-[hsl(215,16%,65%)] pb-safe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
          {/* 1. Şirket / Hakkımızda */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-3 inline-block shadow-sm">
              <Logo size="lg" href="/" />
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">{t('about')}</h3>
              <p className="text-base opacity-80 leading-relaxed text-slate-300">
                {t('aboutDesc')}
              </p>
            </div>
            <div className="space-y-4 pt-2">
              <p className="text-sm font-bold text-white uppercase tracking-wider">Bizi Takip Edin</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:border-brand hover:text-white transition-all touch-manipulation">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Hızlı Linkler */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t('quickLinks')}</h3>
            <ul className="space-y-0">
              {[
                { href: '/', labelKey: 'home' as const },
                { href: '/products', labelKey: 'products' as const },
                { href: '/categories', labelKey: 'categories' as const },
                { href: '/ges', labelKey: 'ges' as const },
                { href: '/ges/teklif-dogrulama', labelKey: 'gesQuoteVerify' as const },
                { href: '/products?sort=newest', labelKey: 'campaigns' as const },
                { href: '/contact', labelKey: 'b2bContact' as const },
                { href: '/contact', labelKey: 'contact' as const },
              ].map((item) => (
                <li key={`${item.href}-${item.labelKey}`}>
                  <Link href={item.href} className="block py-3 text-base hover:text-brand transition-colors touch-manipulation min-h-[44px] flex items-center">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Müşteri Hizmetleri */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t('customerService')}</h3>
            <ul className="space-y-0">
              {[
                { href: '/contact', labelKey: 'contact' as const },
                { href: '/faq', labelKey: 'faq' as const },
                { href: '/shipping', labelKey: 'shipping' as const },
                { href: '/returns', labelKey: 'returns' as const },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-3 text-base hover:text-brand transition-colors touch-manipulation min-h-[44px] flex items-center">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. İletişim */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t('contact')}</h3>
            <ul className="space-y-0">
              <li>
                <a href="mailto:info@bataryakit.com" className="flex items-center gap-3 py-3 text-base hover:text-brand transition-colors touch-manipulation min-h-[44px]">
                  <Mail className="w-5 h-5 text-brand flex-shrink-0" />
                  info@bataryakit.com
                </a>
              </li>
              <li>
                <a href="tel:+905343288383" className="flex items-center gap-3 py-3 text-base hover:text-brand transition-colors touch-manipulation min-h-[44px]">
                  <Phone className="w-5 h-5 text-brand flex-shrink-0" />
                  +90 534 328 83 83
                </a>
              </li>
              <li className="flex items-center gap-3 py-3 min-h-[44px]">
                <MapPin className="w-5 h-5 text-brand flex-shrink-0" />
                <span className="text-base">{t('location')}</span>
              </li>
            </ul>
          </div>

          {/* 5. Ödeme & Güven */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Bültene Katılın</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Yeni ürünler ve kampanyalardan ilk siz haberdar olun.</p>
              <NewsletterForm />
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">{t('paymentTrust')}</h3>
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-2 opacity-80">
                  <CreditCard className="w-8 h-8 text-slate-300" />
                  <span className="text-sm">{t('securePayment')}</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <ShieldCheck className="w-8 h-8 text-slate-300" />
                  <span className="text-sm">{t('sslCert')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-base opacity-80 leading-snug">
              © {currentYear} Batarya Kit. {t('copyright')}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
              <Link href="/privacy" className="py-2 opacity-80 hover:text-brand transition-colors touch-manipulation">
                {t('privacy')}
              </Link>
              <Link href="/terms" className="py-2 opacity-80 hover:text-brand transition-colors touch-manipulation">
                {t('terms')}
              </Link>
              <Link href="/cookies" className="py-2 opacity-80 hover:text-brand transition-colors touch-manipulation">
                {t('cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

