'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown, Zap } from 'lucide-react'
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
  const currency = useCurrencyStore((s) => s.currency)
  const setCurrency = useCurrencyStore((s) => s.setCurrency)

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-xs font-medium">
          {/* Sol: GES & Teklif */}
          <div className="flex items-center gap-5">
            <Link
              href="/ges"
              className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              {t('gesButton')}
            </Link>
            <Link
              href="/ges/teklif-dogrulama"
              className="text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              {t('gesQuoteButton')}
            </Link>
          </div>

          {/* Sağ: Dil + Para Birimi */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="w-px h-3.5 bg-slate-700" aria-hidden />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  {CURRENCIES.find((c) => c.code === currency)?.label ?? 'TL'}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[90px] rounded-xl border-slate-200 shadow-xl bg-white">
                {CURRENCIES.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className="cursor-pointer rounded-lg text-sm"
                  >
                    {c.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
