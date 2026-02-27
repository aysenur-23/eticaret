import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Çerez Politikası | Batarya Kit',
  description: 'Batarya Kit çerez politikası ve çerez kullanımı hakkında bilgiler.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]" id="main-content">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Çerez Politikası</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">Çerez Politikası</h1>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12">
          <h2 className="sr-only">Çerez Politikası metni</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. ÇEREZ NEDİR?</h2>
              <p>
                Çerezler (cookies), web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, telefon) kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin düzgün çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. ÇEREZLERİN KULLANIM AMACI</h2>
              <p className="mb-4">Batarya Kit olarak çerezleri aşağıdaki amaçlarla kullanıyoruz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Web sitesinin temel işlevlerinin çalışmasını sağlamak</li>
                <li>Kullanıcı tercihlerini hatırlamak</li>
                <li>Site performansını analiz etmek</li>
                <li>Kullanıcı deneyimini iyileştirmek</li>
                <li>Güvenli alışveriş ortamı sağlamak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. KULLANILAN ÇEREZ TÜRLERİ</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1. Zorunlu Çerezler</h3>
              <p className="mb-4">
                Bu çerezler, web sitesinin temel işlevlerinin çalışması için gereklidir. Siteyi kullanabilmek için bu çerezlerin aktif olması zorunludur.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Oturum yönetimi</li>
                <li>Sepet işlemleri</li>
                <li>Güvenlik kontrolleri</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2. Analitik Çerezler</h3>
              <p className="mb-4">
                Bu çerezler, web sitesinin nasıl kullanıldığını anlamamıza yardımcı olur. Site performansını iyileştirmek için kullanılır.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ziyaretçi sayısı</li>
                <li>En çok ziyaret edilen sayfalar</li>
                <li>Kullanıcı davranışları</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3. Fonksiyonel Çerezler</h3>
              <p className="mb-4">
                Bu çerezler, kullanıcı tercihlerini hatırlayarak daha kişiselleştirilmiş bir deneyim sunar.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dil tercihi</li>
                <li>Bölge ayarları</li>
                <li>Kullanıcı tercihleri</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.4. Pazarlama Çerezleri</h3>
              <p className="mb-4">
                Bu çerezler, size daha uygun içerik ve reklamlar göstermek için kullanılır. İzin verilmesi halinde aktif olur.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kişiselleştirilmiş reklamlar</li>
                <li>Pazarlama kampanyaları</li>
                <li>Dönüşüm takibi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. ÇEREZ SÜRELERİ</h2>
              <p className="mb-4">Çerezler, saklama sürelerine göre iki kategoriye ayrılır:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1. Oturum Çerezleri</h3>
              <p>
                Tarayıcı kapatıldığında otomatik olarak silinir. Geçici çerezlerdir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2. Kalıcı Çerezler</h3>
              <p>
                Belirli bir süre boyunca cihazınızda kalır. Süre dolduğunda otomatik olarak silinir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. ÇEREZ YÖNETİMİ</h2>
              <p className="mb-4">
                Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz. Ancak, bazı çerezleri devre dışı bırakmanız durumunda web sitesinin bazı özellikleri düzgün çalışmayabilir.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1. Tarayıcı Ayarları</h3>
              <p className="mb-4">Çerezleri yönetmek için tarayıcınızın ayarlarını kullanabilirsiniz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
                <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                <li><strong>Edge:</strong> Ayarlar → Gizlilik → Çerezler</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2. Üçüncü Taraf Çerezler</h3>
              <p>
                Bazı çerezler, web sitemizde hizmet veren üçüncü taraf şirketler tarafından yerleştirilir. Bu çerezlerin yönetimi, ilgili şirketlerin gizlilik politikalarına tabidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. ÜÇÜNCÜ TARAF ÇEREZLER</h2>
              <p className="mb-4">
                Web sitemizde, aşağıdaki üçüncü taraf hizmetlerin çerezleri kullanılabilir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> Site kullanım istatistikleri için</li>
                <li><strong>Ödeme Sistemleri:</strong> Güvenli ödeme işlemleri için</li>
                <li><strong>Kargo Firmaları:</strong> Teslimat takibi için</li>
              </ul>
              <p className="mt-4">
                Bu hizmetlerin çerez politikaları, ilgili şirketlerin web sitelerinde yayınlanmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. ÇEREZ ONAYI</h2>
              <p>
                Web sitemizi kullanarak, çerez politikamızı kabul etmiş sayılırsınız. Çerez tercihlerinizi değiştirmek isterseniz, tarayıcı ayarlarınızdan yönetebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. DEĞİŞİKLİKLER</h2>
              <p>
                Bu Çerez Politikası, yasal değişiklikler veya işletme gereksinimleri doğrultusunda güncellenebilir. Önemli değişiklikler, sitede duyurulur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. İLETİŞİM</h2>
              <p className="mb-2">Çerez politikamız hakkında sorularınız için:</p>
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

