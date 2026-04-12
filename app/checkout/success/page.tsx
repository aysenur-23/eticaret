'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ClassicPageShell } from '@/components/ClassicPageShell'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, Package, Banknote, CreditCard, FlaskConical } from 'lucide-react'

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  bank_transfer: { label: 'Havale / EFT', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  test:          { label: 'Test Siparişi', color: 'text-violet-700 bg-violet-50 border-violet-200' },
  stripe:        { label: 'Kredi / Banka Kartı', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  card:          { label: 'Kredi / Banka Kartı', color: 'text-blue-700 bg-blue-50 border-blue-200' },
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId   = searchParams.get('order_id') || searchParams.get('orderId') || searchParams.get('session_id')
  const payment   = searchParams.get('payment') || ''

  const isBankTransfer = payment === 'bank_transfer'
  const isTest         = payment === 'test'
  const isCard         = payment === 'stripe' || payment === 'card'

  const paymentMeta = PAYMENT_LABELS[payment] ?? null

  return (
    <ClassicPageShell
      breadcrumbs={[{ label: 'Ödeme', href: '/checkout' }, { label: 'Başarılı' }]}
      title="Siparişiniz Alındı"
      description={
        isBankTransfer ? 'Havale/EFT ile ödemenizi bekliyoruz.' :
        isTest         ? 'Test siparişiniz başarıyla oluşturuldu.' :
        isCard         ? 'Ödemeniz başarıyla tamamlandı.' :
        'Siparişiniz başarıyla oluşturuldu.'
      }
    >
      <div className="py-12 text-center max-w-lg mx-auto space-y-4">

        {/* İkon */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-2">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Sipariş no */}
        {orderId && (
          <p className="text-ink font-medium">
            Sipariş numarası:{' '}
            <span className="text-brand font-bold">{orderId}</span>
          </p>
        )}

        {/* Ödeme yöntemi rozeti */}
        {paymentMeta && (
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${paymentMeta.color}`}>
            {isBankTransfer && <Banknote className="w-4 h-4 shrink-0" />}
            {isCard          && <CreditCard className="w-4 h-4 shrink-0" />}
            {isTest          && <FlaskConical className="w-4 h-4 shrink-0" />}
            {paymentMeta.label}
          </div>
        )}

        {/* Havale/EFT talimatı */}
        {isBankTransfer && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <Banknote className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-amber-800">Havale / EFT Bilgileri</p>
                <p className="text-amber-700">
                  Ödemenizi aşağıdaki hesaba yapınız. Açıklama kısmına sipariş numaranızı (<strong>{orderId}</strong>) yazmayı unutmayınız.
                </p>
                <div className="mt-2 rounded-lg bg-white/60 border border-amber-200 px-3 py-2 space-y-1 text-amber-900 font-mono text-xs">
                  <p><span className="font-sans font-semibold">Banka:</span> Ziraat Bankası</p>
                  <p><span className="font-sans font-semibold">Hesap Sahibi:</span> Voltekno Enerji Sistemleri</p>
                  <p><span className="font-sans font-semibold">IBAN:</span> TR00 0000 0000 0000 0000 0000 00</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test siparişi notu */}
        {isTest && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-violet-800">Test Siparişi</p>
                <p className="text-violet-700 mt-0.5">
                  Bu bir test siparişidir. Gerçek ödeme alınmamıştır. Sipariş admin panelinde görüntülenebilir.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Kart ödemesi onayı */}
        {isCard && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800">Ödeme Tamamlandı</p>
                <p className="text-blue-700 mt-0.5">
                  Kart ödemeniz başarıyla işlendi. Siparişiniz hazırlanmaya başlanacaktır.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-ink-muted text-sm">
          Sipariş detayları e-posta adresinize gönderilecektir.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2">
          <Button asChild className="bg-brand hover:bg-brand-hover text-white rounded-xl min-h-[48px] w-full sm:w-auto touch-manipulation">
            <Link href="/profile?tab=orders" className="inline-flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Siparişlerim
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl min-h-[48px] w-full sm:w-auto touch-manipulation">
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <ClassicPageShell noTitle>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-700 mx-auto" />
        </div>
      </ClassicPageShell>
    }>
      <SuccessContent />
    </Suspense>
  )
}
