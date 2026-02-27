import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export default getRequestConfig(async () => {
  let locale: 'tr' | 'en' = 'tr'
  try {
    if (process.env.STATIC_EXPORT !== 'true') {
      const cookieStore = await cookies()
      const value = cookieStore.get(LOCALE_COOKIE)?.value
      locale = value === 'en' ? 'en' : 'tr'
    }
  } catch {
    locale = 'tr'
  }
  const validLocale = locale === 'en' ? 'en' : 'tr'

  let messages: Record<string, unknown> = {}
  try {
    messages = (await import(`../messages/${validLocale}.json`)).default
  } catch {
    try {
      messages = (await import(`../messages/tr.json`)).default
    } catch {
      messages = {}
    }
  }

  return {
    locale: validLocale,
    messages,
    timeZone: 'Europe/Istanbul',
  }
})
