'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ShoppingCart, ChevronDown, Sun } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { LanguageSwitcher } from './LanguageSwitcher'

const CURRENCIES = [
  { code: 'TRY' as const, label: 'TL' },
  { code: 'USD' as const, label: 'USD' },
  { code: 'EUR' as const, label: 'EUR' },
]

export function HeaderTopBar() {
  const t = useTranslations('headerTopBar')
  const tAuth = useTranslations('auth')
  const tHeader = useTranslations('header')
  const currency = useCurrencyStore((s) => s.currency)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="bg-slate-50/90 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-xs font-medium text-slate-600">
          {/* Sol: GES, Teklif Kontrol, Dil, Para birimi (Ürünler/İletişim/Giriş/Sepet ana header’da) */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/ges"
              className="flex items-center gap-1.5 font-semibold text-brand hover:text-brand-hover transition-colors"
            >
              <Sun className="w-3.5 h-3.5" />
              {t('gesButton')}
            </Link>
            <Link
              href="/ges/teklif-dogrulama"
              className="text-slate-600 hover:text-brand transition-colors"
            >
              {t('gesQuoteButton')}
            </Link>
            <span className="w-px h-4 bg-slate-200" aria-hidden />
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-600 hover:text-brand transition-colors"
                >
                  {CURRENCIES.find((c) => c.code === currency)?.label ?? 'TL'}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[100px] rounded-xl border-slate-200 shadow-lg">
                {CURRENCIES.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className="cursor-pointer rounded-lg"
                  >
                    {c.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex md:hidden items-center gap-2.5 text-xs">
            <Link href="/ges" className="flex items-center gap-1 font-semibold text-brand">
              <Sun className="w-3.5 h-3.5" />
              {t('gesButton')}
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/ges/teklif-dogrulama" className="text-slate-600 hover:text-brand">
              {t('gesQuoteButton')}
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/login" className="text-slate-600 hover:text-brand">
              {tAuth('login')}
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/cart" className="text-slate-600 hover:text-brand flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5" />
              {tHeader('cart')} {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
