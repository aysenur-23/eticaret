'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'

/**
 * next-intl locale ile document.documentElement.lang senkronize eder (erişilebilirlik).
 */
export function HtmlLangSync() {
  const locale = useLocale()
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'tr'
  }, [locale])
  return null
}
