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
  const [mounted, setMounted] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const t = useTranslations('footer')

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-green-600 py-2">{t('newsletterSuccess')}</p>
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">{t('emailPlaceholder')}</label>
      {mounted ? (
        <input
          id="newsletter-email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
          required
          className="w-full min-h-[44px] sm:min-h-0 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      ) : (
        <div className="w-full rounded-xl px-4 py-3 text-sm bg-slate-100 border border-slate-200 min-h-[44px]" aria-hidden />
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="min-h-[44px] sm:min-h-0 bg-brand hover:bg-brand-hover text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-50 touch-manipulation"
      >
        {status === 'loading' ? t('newsletterLoading') : t('newsletterSubscribe')}
      </button>
      {status === 'error' && <p className="text-xs text-red-600">{t('newsletterError')}</p>}
    </form>
  )
}

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  const titleClass = 'text-slate-900 font-semibold text-sm uppercase tracking-wider mb-4'
  const linkClass = 'text-slate-600 text-sm py-2 block hover:text-brand transition-colors'

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700 pb-safe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-10">
          {/* Logo + Hakkımızda + Sosyal */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <div className="bg-white rounded-xl p-3 inline-block border border-slate-200 shadow-sm">
              <Logo size="lg" href="/" />
            </div>
            <div>
              <h3 className={titleClass}>{t('about')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
                {t('aboutDesc')}
              </p>
            </div>
            <div>
              <p className={titleClass}>{t('followUs')}</p>
              <div className="flex gap-2">
                {([
                  { Icon: Facebook, name: 'Facebook' },
                  { Icon: Twitter, name: 'Twitter / X' },
                  { Icon: Instagram, name: 'Instagram' },
                  { Icon: Linkedin, name: 'LinkedIn' },
                  { Icon: Youtube, name: 'YouTube' },
                ] as const).map(({ Icon, name }) => (
                  <a
                    key={name}
                    href="#"
                    aria-label={name}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-brand hover:border-brand hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Hızlı Linkler + GES */}
          <div>
            <h3 className={titleClass}>{t('quickLinks')}</h3>
            <ul className="space-y-1">
              {[
                { href: '/', labelKey: 'home' as const },
                { href: '/products', labelKey: 'products' as const },
                { href: '/categories', labelKey: 'categories' as const },
                { href: '/products?sort=newest', labelKey: 'campaigns' as const },
                { href: '/contact', labelKey: 'b2bContact' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>{t(item.labelKey)}</Link>
                </li>
              ))}
            </ul>
            <h3 className={`${titleClass} mt-6`}>{t('gesTeklifSection')}</h3>
            <ul className="space-y-1">
              {[
                { href: '/ges', labelKey: 'ges' as const },
                { href: '/ges', labelKey: 'teklifAl' as const },
                { href: '/ges/teklif-dogrulama', labelKey: 'gesQuoteVerify' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>{t(item.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div>
            <h3 className={titleClass}>{t('customerService')}</h3>
            <ul className="space-y-1">
              {[
                { href: '/contact', labelKey: 'contact' as const },
                { href: '/faq', labelKey: 'faq' as const },
                { href: '/shipping', labelKey: 'shipping' as const },
                { href: '/returns', labelKey: 'returns' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>{t(item.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim + Bülten + Güven */}
          <div className="space-y-6">
            <div>
              <h3 className={titleClass}>{t('contact')}</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="mailto:info@voltekno.com" className="flex items-center gap-2 hover:text-brand transition-colors break-all">
                    <Mail className="w-4 h-4 text-brand shrink-0" aria-hidden />
                    info@voltekno.com
                  </a>
                </li>
                <li>
                  <a href="tel:+905343288383" className="flex items-center gap-2 hover:text-brand transition-colors">
                    <Phone className="w-4 h-4 text-brand shrink-0" aria-hidden />
                    +90 534 328 83 83
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden />
                  <span>{t('location')}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className={titleClass}>{t('newsletter')}</h3>
              <p className="text-xs text-slate-500 mb-3">{t('newsletterDesc')}</p>
              <NewsletterForm />
            </div>
            <div>
              <h3 className={titleClass}>{t('paymentTrust')}</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <CreditCard className="w-5 h-5 text-brand shrink-0" aria-hidden />
                  {t('securePayment')}
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <ShieldCheck className="w-5 h-5 text-brand shrink-0" aria-hidden />
                  {t('sslCert')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            © {currentYear} voltekno. {t('copyright')}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
            <Link href="/privacy" className="text-slate-500 hover:text-brand transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-brand transition-colors">
              {t('terms')}
            </Link>
            <Link href="/cookies" className="text-slate-500 hover:text-brand transition-colors">
              {t('cookies')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
