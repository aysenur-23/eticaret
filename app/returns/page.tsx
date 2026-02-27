import { Metadata } from 'next'
import Link from 'next/link'
import { RefreshCw, FileText, Shield, Mail, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İade ve Değişim | Batarya Kit',
  description: 'İade koşulları, cayma hakkı ve değişim süreci.',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" id="main-content">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">İade ve Değişim</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">İade ve Değişim</h1>
          <p className="mt-1 text-sm text-gray-600">Cayma hakkı ve iade koşullarımız</p>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Cayma Hakkı</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında, ürün size teslim edildiği tarihten itibaren <strong>14 gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahipsiniz.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Cayma hakkının kullanılabilmesi için ürünün kullanılmamış, orijinal ambalajında ve fatura ile birlikte iade edilmesi gerekir. İade kargo ücreti alıcıya aittir; ücretsiz kargo ile gönderilen siparişlerde iade kargo bedeli tüketici tarafından karşılanır (yasal düzenlemelere göre).
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">İade Süreci</h2>
            </div>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 leading-relaxed">
              <li>İade talebinizi e-posta veya iletişim formu ile bize iletin; sipariş numaranızı belirtin.</li>
              <li>Onay sonrası ürünü orijinal ambalajında, fatura ile birlikte belirteceğimiz adrese kargolayın.</li>
              <li>Ürün depomuzda kontrol edildikten sonra ödemeniz, tercih ettiğiniz yönteme göre (kart iadesi veya havale) 14 gün içinde iade edilir.</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Garanti ve Arıza</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ürünlerimiz garanti süresi içinde arızalı çıkarsa, garanti koşullarına uygun olarak onarım veya değişim yapıyoruz. Arıza bildiriminizi iletişim kanallarımız üzerinden yapabilirsiniz; size dönüş yapılıp ürünün iade yöntemi ve süreç anlatılacaktır.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">İletişim</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              İade veya değişim talebiniz için <Link href="/contact" className="text-red-600 hover:text-red-700 font-medium">İletişim</Link> sayfamızdan bize ulaşabilir veya doğrudan e-posta gönderebilirsiniz. Sipariş numaranızı ve talebinizi (iade/değişim) belirtmeniz işlem süresini kısaltır.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Detaylı hak ve yükümlülükler için <Link href="/terms" className="text-red-600 hover:text-red-700 font-medium">Uzaktan Satış Sözleşmesi</Link> ve <Link href="/privacy" className="text-red-600 hover:text-red-700 font-medium">Gizlilik</Link> sayfalarımıza bakabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
