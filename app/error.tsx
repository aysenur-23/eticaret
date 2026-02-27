'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error('Error boundary:', error)
  }, [error])

  return (
    <ClassicPageShell
      title={t('title')}
      description={t('description')}
    >
      <div className="py-12 text-center max-w-lg mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-600 mb-8">
          {t('hint')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            className="btn-classic-primary rounded-lg inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('retry')}
          </Button>
          <Button asChild variant="outline" className="rounded-lg border-red-200 text-red-700 hover:bg-red-50">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('home')}
            </Link>
          </Button>
        </div>
      </div>
    </ClassicPageShell>
  )
}
