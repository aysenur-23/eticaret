'use client'

import Link from 'next/link'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { XCircle, ShoppingCart, Home } from 'lucide-react'

/**
 * Ödeme iptal sonrası yönlendirme sayfası.
 * Stripe/PayTR cancel_url olarak kullanılabilir.
 */
export default function CheckoutCancelPage() {
  return (
    <ClassicPageShell
      breadcrumbs={[{ label: 'Ödeme', href: '/checkout' }, { label: 'İptal' }]}
      title="Ödeme iptal edildi"
      description="Ödeme işleminiz tamamlanmadı. Sepetiniz aynen duruyor."
    >
      <div className="py-12 text-center max-w-lg mx-auto">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mb-6">
          <XCircle className="w-10 h-10 text-amber-600" />
        </div>
        <p className="text-ink-muted mb-8">
          İstediğiniz zaman tekrar ödeme sayfasına dönüp işlemi tamamlayabilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Button asChild className="btn-classic-primary rounded-lg min-h-[48px] w-full sm:w-auto touch-manipulation">
            <Link href="/checkout" className="inline-flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ödemeye Dön
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-lg min-h-[48px] w-full sm:w-auto touch-manipulation">
            <Link href="/" className="inline-flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </ClassicPageShell>
  )
}
