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
  ArrowRight,
  Zap,
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
    return (
      <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        {t('newsletterSuccess')}
      </div>
    )
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">{t('emailPlaceholder')}</label>
      {mounted ? (
        <input
          id="newsletter-email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
          required
          className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      ) : (
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 min-h-[42px]" aria-hidden />
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-label={t('newsletterSubscribe')}
        className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand hover:bg-brand-hover rounded-xl text-white transition-colors disabled:opacity-50"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
      {status === 'error' && <p className="text-xs text-red-400 mt-1">{t('newsletterError')}</p>}
    </form>
  )
}

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  const headingClass = 'text-white font-semibold text-xs uppercase tracking-widest mb-4'
  const linkClass = 'text-slate-400 text-sm py-1 flex items-center gap-1.5 hover:text-white transition-colors group'

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1: Brand */}
          <div className="space-y-6">
            <Logo size="lg" href="/" />
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('aboutDesc')}
            </p>
            {/* Social */}
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
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-brand hover:border-brand hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Links */}
          <div>
            <h3 className={headingClass}>{t('quickLinks')}</h3>
            <ul className="space-y-0.5">
              {[
                { href: '/', labelKey: 'home' as const },
                { href: '/products', labelKey: 'products' as const },
                { href: '/categories', labelKey: 'categories' as const },
                { href: '/products?sort=newest', labelKey: 'campaigns' as const },
                { href: '/contact', labelKey: 'b2bContact' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>
                    <ArrowRight className="w-3 h-3 text-brand opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={`${headingClass} mt-7`}>{t('customerService')}</h3>
            <ul className="space-y-0.5">
              {[
                { href: '/contact', labelKey: 'contact' as const },
                { href: '/faq', labelKey: 'faq' as const },
                { href: '/shipping', labelKey: 'shipping' as const },
                { href: '/returns', labelKey: 'returns' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>
                    <ArrowRight className="w-3 h-3 text-brand opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: GES + Contact */}
          <div>
            <h3 className={headingClass}>{t('gesTeklifSection')}</h3>
            <ul className="space-y-0.5">
              {[
                { href: '/ges', labelKey: 'ges' as const },
                { href: '/ges', labelKey: 'teklifAl' as const },
                { href: '/ges/teklif-dogrulama', labelKey: 'gesQuoteVerify' as const },
              ].map((item) => (
                <li key={item.labelKey}>
                  <Link href={item.href} className={linkClass}>
                    <Zap className="w-3 h-3 text-brand shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className={`${headingClass} mt-7`}>{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:info@voltekno.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-brand" aria-hidden />
                  </span>
                  info@voltekno.com
                </a>
              </li>
              <li>
                <a href="tel:+905343288383" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-brand" aria-hidden />
                  </span>
                  +90 534 328 83 83
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand" aria-hidden />
                </span>
                {t('location')}
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter + Trust */}
          <div className="space-y-7">
            <div>
              <h3 className={headingClass}>{t('newsletter')}</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t('newsletterDesc')}</p>
              <NewsletterForm />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{t('paymentTrust')}</p>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <CreditCard className="w-4 h-4 text-brand shrink-0" aria-hidden />
                {t('securePayment')}
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-brand shrink-0" aria-hidden />
                {t('sslCert')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {currentYear} voltekno. {t('copyright')}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs">
            <Link href="/privacy" className="text-slate-600 hover:text-slate-300 transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-300 transition-colors">
              {t('terms')}
            </Link>
            <Link href="/cookies" className="text-slate-600 hover:text-slate-300 transition-colors">
              {t('cookies')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
