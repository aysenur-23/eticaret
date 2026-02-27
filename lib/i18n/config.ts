/**
 * i18n Configuration
 * Internationalization setup for tr/en support
 */

export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'tr'

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
}

export const localeConfig = {
  tr: {
    currency: 'TRY',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
  en: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}


