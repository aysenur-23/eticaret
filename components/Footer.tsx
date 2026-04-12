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
  Send,
} from 'lucide-react'

function NewsletterForm() {
  const [mounted, setMounted] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const t = useTranslations('footer')

  React.useEffect(() => { setMounted(true) }, [])

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
      <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">
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
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/40 transition-all"
        />
      ) : (
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 min-h-[42px]" aria-hidden />
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-label={t('newsletterSubscribe')}
        className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand hover:bg-brand-hover rounded-xl text-white transition-all disabled:opacity-50 shadow-[0_6px_16px_rgba(220,38,38,0.25)]"
      >
        <Send className="w-4 h-4" />
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-1 absolute">{t('newsletterError')}</p>
      )}
    </form>
  )
}

export function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  const sectionLabel = 'text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 mb-4'
  const navLink = 'group flex items-center gap-1.5 py-1 text-sm text-slate-400 hover:text-white transition-colors'

  return (
    <footer className="bg-[#080d1a] text-slate-300">

      {/* Üst aksan çizgisi */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ── 4 sütun grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* 1 — Marka */}
          <div className="space-y-5">
            <Logo size="lg" href="/" className="invert brightness-200" />
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('aboutDesc')}
            </p>

            {/* Sosyal medya */}
            <div className="flex gap-2 pt-1">
              {([
                { Icon: Facebook, name: 'Facebook' },
                { Icon: Twitter,   name: 'Twitter / X' },
                { Icon: Instagram, name: 'Instagram' },
                { Icon: Linkedin,  name: 'LinkedIn' },
                { Icon: Youtube,   name: 'YouTube' },
              ] as const).map(({ Icon, name }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:bg-brand hover:border-brand hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* 2 — Linkler */}
          <div className="space-y-7">
            <div>
              <p className={sectionLabel}>{t('quickLinks')}</p>
              <ul className="space-y-0.5">
                {[
                  { href: '/',                     label: t('home') },
                  { href: '/products',             label: t('products') },
                  { href: '/categories',           label: t('categories') },
                  { href: '/products?sort=newest', label: t('campaigns') },
                  { href: '/contact',              label: t('b2bContact') },
                ].map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className={navLink}>
                      <ArrowRight className="w-3 h-3 text-brand opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={sectionLabel}>{t('customerService')}</p>
              <ul className="space-y-0.5">
                {[
                  { href: '/contact', label: t('contact') },
                  { href: '/faq',      label: t('faq') },
                  { href: '/shipping', label: t('shipping') },
                  { href: '/returns',  label: t('returns') },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={navLink}>
                      <ArrowRight className="w-3 h-3 text-brand opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3 — GES & İletişim */}
          <div className="space-y-7">
            <div>
              <p className={sectionLabel}>{t('gesTeklifSection')}</p>
              <ul className="space-y-0.5">
                {[
                  { href: '/ges',                    label: t('ges') },
                  { href: '/ges',                    label: t('teklifAl') },
                  { href: '/ges/teklif-dogrulama',   label: t('gesQuoteVerify') },
                ].map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className={navLink}>
                      <Zap className="w-3 h-3 text-brand shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={sectionLabel}>{t('contact')}</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:info@voltekno.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-brand" aria-hidden />
                    </span>
                    info@voltekno.com
                  </a>
                </li>
                <li>
                  <a href="tel:+905343288383" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-brand" aria-hidden />
                    </span>
                    +90 534 328 83 83
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-slate-500">
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" aria-hidden />
                  </span>
                  {t('location')}
                </li>
              </ul>
            </div>
          </div>

          {/* 4 — Bülten + Güven */}
          <div className="space-y-6">
            <div>
              <p className={sectionLabel}>{t('newsletter')}</p>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t('newsletterDesc')}</p>
              <NewsletterForm />
            </div>

            {/* Güven rozetleri */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
              <p className={sectionLabel + ' mb-2'}>{t('paymentTrust')}</p>
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
      </div>

      {/* ── Alt bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-slate-600">
            © {currentYear} <span className="text-slate-500 font-medium">Voltekno</span>. {t('copyright')}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/privacy" className="text-[11px] text-slate-600 hover:text-slate-300 transition-colors">{t('privacy')}</Link>
            <Link href="/terms"   className="text-[11px] text-slate-600 hover:text-slate-300 transition-colors">{t('terms')}</Link>
            <Link href="/cookies" className="text-[11px] text-slate-600 hover:text-slate-300 transition-colors">{t('cookies')}</Link>
          </nav>
        </div>
      </div>

    </footer>
  )
}
