import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Batarya Kit',
  description: 'Batarya Kit gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface" id="main-content">
      <div className="bg-surface-elevated border-b border-palette">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-ink-muted mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-ink font-semibold">Gizlilik Politikası</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-ink uppercase tracking-tight">Gizlilik Politikası</h1>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto bg-surface-elevated rounded-lg border border-palette shadow-sm p-8 md:p-12">
          <h2 className="sr-only">Gizlilik Politikası metni</h2>
          
          <div className="prose prose-lg max-w-none text-ink space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">1. GENEL BİLGİLER</h2>
              <p>
                Bu Gizlilik Politikası, Batarya Kit ("Biz", "Bizim", "Site") olarak, www.bataryakit.com web sitesini ziyaret eden ve hizmetlerimizi kullanan kullanıcıların ("Kullanıcı", "Siz") kişisel bilgilerinin nasıl toplandığını, kullanıldığını, korunduğunu ve paylaşıldığını açıklar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. TOPLANAN BİLGİLER</h2>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1. Kişisel Bilgiler:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ad, soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Fatura ve teslimat adresi</li>
                <li>Ödeme bilgileri (güvenli ödeme sistemleri üzerinden)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2. Otomatik Toplanan Bilgiler:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP adresi</li>
                <li>Tarayıcı türü ve versiyonu</li>
                <li>İşletim sistemi</li>
                <li>Ziyaret edilen sayfalar ve süre</li>
                <li>Referans URL</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. BİLGİLERİN KULLANIMI</h2>
              <p>Toplanan bilgiler aşağıdaki amaçlarla kullanılır:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Sipariş işlemlerinin gerçekleştirilmesi</li>
                <li>Müşteri hizmetleri sağlanması</li>
                <li>Ürün ve hizmetlerin iyileştirilmesi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Pazarlama faaliyetleri (izin verilmesi halinde)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. BİLGİLERİN PAYLAŞIMI</h2>
              <p className="mb-4">
                <strong>4.1.</strong> Kişisel bilgileriniz, aşağıdaki durumlar dışında üçüncü kişilerle paylaşılmaz:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yasal zorunluluklar</li>
                <li>Kargo ve ödeme işlemleri için gerekli servis sağlayıcılar</li>
                <li>İzin verilmesi halinde pazarlama ortakları</li>
              </ul>
              <p className="mt-4">
                <strong>4.2.</strong> Tüm üçüncü taraf servis sağlayıcılar, verilerinizi korumakla yükümlüdür.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. ÇEREZLER (COOKIES)</h2>
              <p className="mb-4">
                <strong>5.1.</strong> Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır.
              </p>
              <p className="mb-4">
                <strong>5.2.</strong> Çerez türleri:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Zorunlu çerezler: Site işlevselliği için gerekli</li>
                <li>Analitik çerezler: Site kullanım istatistikleri</li>
                <li>Pazarlama çerezleri: Kişiselleştirilmiş reklamlar</li>
              </ul>
              <p className="mt-4">
                <strong>5.3.</strong> Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. VERİ GÜVENLİĞİ</h2>
              <p className="mb-4">
                <strong>6.1.</strong> Kişisel bilgileriniz, SSL şifreleme teknolojisi ile korunur.
              </p>
              <p className="mb-4">
                <strong>6.2.</strong> Ödeme bilgileri, PCI-DSS uyumlu güvenli ödeme sistemleri üzerinden işlenir.
              </p>
              <p>
                <strong>6.3.</strong> Verileriniz, güvenli sunucularda saklanır ve yetkisiz erişime karşı korunur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. KULLANICI HAKLARI</h2>
              <p>KVKK Kanunu kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                <li>Kişisel verilerinizin silinmesini isteme</li>
                <li>İşlenen verilerin muhafazasını talep etme</li>
                <li>İşlenen verilerin aktarılmasını isteme</li>
                <li>İşleme itiraz etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. VERİ SAKLAMA SÜRESİ</h2>
              <p>
                Kişisel verileriniz, yasal saklama süreleri ve işleme amaçları doğrultusunda saklanır. Bu süreler sona erdiğinde, verileriniz güvenli bir şekilde silinir veya anonimleştirilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. ÜÇÜNCÜ TARAF BAĞLANTILAR</h2>
              <p>
                Sitemizde, üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu sitelerin gizlilik politikalarından biz sorumlu değiliz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. ÇOCUKLARIN GİZLİLİĞİ</h2>
              <p>
                Hizmetlerimiz 18 yaş altındaki kişilere yönelik değildir. 18 yaş altındaki kişilerden bilerek kişisel bilgi toplamıyoruz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. DEĞİŞİKLİKLER</h2>
              <p>
                Bu Gizlilik Politikası, yasal değişiklikler veya işletme gereksinimleri doğrultusunda güncellenebilir. Önemli değişiklikler, sitede duyurulur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. İLETİŞİM</h2>
              <p className="mb-2">Gizlilik politikamız hakkında sorularınız için:</p>
              <p className="mb-2">
                <strong>E-posta:</strong> info@revision.com
              </p>
              <p>
                <strong>Web:</strong> www.bataryakit.com
              </p>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

