import { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Package, Clock, MapPin, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kargo ve Teslimat | Batarya Kit',
  description: 'Kargo süreleri, ücretsiz kargo koşulları ve teslimat bilgileri.',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" id="main-content">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Kargo ve Teslimat</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">Kargo ve Teslimat</h1>
          <p className="mt-1 text-sm text-gray-600">Siparişiniz güvenle ve hızlıca kapınıza gelsin</p>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Truck className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Teslimat Süreleri</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Stokta bulunan ürünler için sipariş onayı ve ödeme teyidinden sonra <strong>1–3 iş günü</strong> içinde kargoya verilir. Teslimat, bölgeye göre ortalama <strong>1–5 iş günü</strong> içinde tamamlanır. Özel üretim veya stok dışı ürünlerde süre sipariş öncesi size bildirilir.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ücretsiz Kargo</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>3000 TL ve üzeri</strong> siparişlerde kargo ücretsizdir. Sepet sayfasında ara toplam 3000 TL’yi geçtiğinde kargo ücreti otomatik olarak düşer.
            </p>
            <p className="text-gray-600 leading-relaxed">
              3000 TL altındaki siparişlerde kargo ücreti sepet özetinde gösterilir ve ödeme aşamasında eklenir.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sipariş Takibi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Siparişiniz kargoya verildiğinde e-posta ile kargo takip numarası gönderilir. Bu numara ile kargo firmasının sitesinden veya uygulamasından teslimat durumunu takip edebilirsiniz. Ayrıca hesabınızdan Siparişlerim bölümünde sipariş durumunu görebilirsiniz.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Teslimat Adresi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Teslimat adresinizi sipariş sırasında veya profil sayfanızdaki adresler bölümünden girebilirsiniz. Kurumsal teslimat için fatura adresi ile teslimat adresi farklı olabilir; sipariş formunda her iki bilgiyi de doldurmanız yeterlidir.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link href="/contact" className="text-red-600 hover:text-red-700 font-medium">
              Sorularınız için iletişime geçin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
