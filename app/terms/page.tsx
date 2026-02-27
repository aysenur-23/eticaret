import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kullanım Şartları | Batarya Kit',
  description: 'Batarya Kit kullanım şartları ve uzaktan satış sözleşmesi.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" id="main-content">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Kullanım Şartları</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">Uzaktan Satış Sözleşmesi</h1>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12">
          <h2 className="sr-only">Uzaktan Satış Sözleşmesi metni</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. TARAFLAR</h2>
              <p className="mb-4">
                Bu Uzaktan Satış Sözleşmesi ("Sözleşme"), aşağıdaki taraflar arasında aşağıdaki şartlarla akdedilmiştir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>SATICI:</strong></p>
                <p className="mb-1">Batarya Kit</p>
                <p className="mb-1">Web Sitesi: www.bataryakit.com</p>
                <p>E-posta: info@revision.com</p>
              </div>
              <p className="mt-4">
                <strong>ALICI:</strong> Bu siteden alışveriş yapan gerçek veya tüzel kişi müşteri.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. KONU</h2>
              <p>
                Bu sözleşmenin konusu, Alıcı'nın satıcı web sitesi üzerinden elektronik ortamda sipariş verdiği, satıcının kataloğında yer alan ve satışa sunulan ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Uzaktan Satış Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. SİPARİŞ VE KABUL</h2>
              <p className="mb-4">
                <strong>3.1.</strong> Sitede yer alan ürünlerin fiyatları ve özellikleri önceden bildirilmeksizin değiştirilebilir. Ancak sipariş verilen ürünün fiyatı, sipariş anında geçerli olan fiyattır.
              </p>
              <p className="mb-4">
                <strong>3.2.</strong> Sipariş, Alıcı tarafından elektronik ortamda sipariş formu doldurularak verilir. Siparişin onaylanması, Satıcı tarafından Alıcı'ya gönderilecek e-posta ile gerçekleşir.
              </p>
              <p>
                <strong>3.3.</strong> Sipariş onayından sonra, Alıcı'ya sipariş detayları e-posta ile gönderilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. FİYAT VE ÖDEME</h2>
              <p className="mb-4">
                <strong>4.1.</strong> Ürün fiyatları, KDV dahil olarak gösterilir. Kargo ücreti, 3000 TL ve üzeri siparişlerde ücretsizdir. 3000 TL altı siparişlerde kargo ücreti Alıcı'ya aittir.
              </p>
              <p>
                <strong>4.2.</strong> Ödeme, sipariş sırasında belirtilen ödeme yöntemleri ile yapılır. Ödeme onayından sonra sipariş işleme alınır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. TESLİMAT</h2>
              <p className="mb-4">
                <strong>5.1.</strong> Ürünler, Alıcı'nın sipariş formunda belirttiği adrese teslim edilir. Teslimat süresi, stok durumuna göre değişiklik gösterebilir.
              </p>
              <p>
                <strong>5.2.</strong> Teslimat sırasında Alıcı veya temsilcisi ürünü kontrol etmekle yükümlüdür. Hasarlı veya eksik ürün tesliminde, kargo firmasına tutanak tutturulmalıdır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. CAYMA HAKKI</h2>
              <p className="mb-4">
                <strong>6.1.</strong> Alıcı, 6502 sayılı Kanun'un 15. maddesi gereğince, teslim tarihinden itibaren 14 gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
              </p>
              <p className="mb-4">
                <strong>6.2.</strong> Cayma hakkının kullanılması için, Alıcı'nın Satıcı'ya yazılı bildirimde bulunması veya ürünü iade etmesi gerekir.
              </p>
              <p>
                <strong>6.3.</strong> İade edilecek ürünler, kullanılmamış, orijinal ambalajında ve faturası ile birlikte olmalıdır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. GARANTİ VE YETKİLİ SERVİS</h2>
              <p className="mb-4">
                <strong>7.1.</strong> Ürünler, üretici firmanın garanti şartlarına tabidir. Garanti süresi ve kapsamı, ürün kategorisine göre değişiklik gösterebilir.
              </p>
              <p>
                <strong>7.2.</strong> Garanti kapsamındaki arızalar için, ürün yetkili servise gönderilmelidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. SORUMLULUK SINIRLAMASI</h2>
              <p className="mb-4">
                <strong>8.1.</strong> Satıcı, ürünlerin kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu tutulamaz.
              </p>
              <p>
                <strong>8.2.</strong> Satıcı, ürünlerin yanlış kullanımından kaynaklanan zararlardan sorumlu değildir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. KİŞİSEL VERİLERİN KORUNMASI</h2>
              <p className="mb-4">
                <strong>9.1.</strong> Alıcı'nın kişisel verileri, 6698 sayılı KVKK Kanunu'na uygun olarak işlenir ve korunur.
              </p>
              <p>
                <strong>9.2.</strong> Kişisel veriler, sadece sipariş işlemleri için kullanılır ve üçüncü kişilerle paylaşılmaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
              <p className="mb-4">
                <strong>10.1.</strong> Bu sözleşmeden doğan uyuşmazlıklar, Türkiye Cumhuriyeti yasalarına tabidir.
              </p>
              <p>
                <strong>10.2.</strong> Uyuşmazlıkların çözümünde öncelikle müzakere yolu tercih edilir. Anlaşmazlık durumunda, tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. YÜRÜRLÜK</h2>
              <p>
                Bu sözleşme, Alıcı'nın sipariş vermesi ve Satıcı'nın siparişi onaylaması ile yürürlüğe girer.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Sözleşme Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
                <p><strong>Satıcı:</strong> Batarya Kit</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

