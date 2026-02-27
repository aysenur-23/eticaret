import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { Home, Package } from 'lucide-react'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <ClassicPageShell
      breadcrumbs={[{ label: t('breadcrumb') }]}
      title={t('title')}
      description={t('description')}
    >
      <div className="py-12 text-center">
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t('hint')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="btn-classic-primary rounded-lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('home')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg border-red-200 text-red-700 hover:bg-red-50">
            <Link href="/products" className="inline-flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t('products')}
            </Link>
          </Button>
        </div>
      </div>
    </ClassicPageShell>
  )
}
