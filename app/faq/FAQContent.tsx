'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    category: 'Sipariş ve Ödeme',
    questions: [
      {
        q: 'Siparişimi nasıl verebilirim?',
        a: 'Ürün sayfasından sepete ekleyip ödeme adımlarını tamamlayarak sipariş verebilirsiniz. B2B siparişler için lütfen iletişime geçin.',
      },
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme alıyoruz. Fatura her müşteri için kesilir; kurumsal siparişlerde vade seçenekleri sunulabilir.',
      },
      {
        q: 'Fatura nasıl düzenleniyor?',
        a: 'Bireysel alımlarda e-arşiv fatura, kurumsal alımlarda e-fatura kesiyoruz. Fatura bilgilerini sipariş veya profil sayfasından girebilirsiniz.',
      },
    ],
  },
  {
    category: 'Kargo ve Teslimat',
    questions: [
      {
        q: 'Kargo süresi ne kadar?',
        a: 'Stoktaki ürünler sipariş onayından sonra 1-3 iş günü içinde kargoya verilir. Teslimat süresi bölgeye göre 1-5 iş günü arasında değişir.',
      },
      {
        q: 'Kargo ücreti ne kadar?',
        a: '3.000 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde ücret sepet ekranında hesaplanır.',
      },
      {
        q: 'Siparişimi takip edebilir miyim?',
        a: 'Evet. Sipariş onayı ve kargoya teslim bilgileri e-posta ile paylaşılır. Takip numarasıyla kargo firmasından durum izlenebilir.',
      },
    ],
  },
  {
    category: 'Ürünler ve Teknik',
    questions: [
      {
        q: 'GES kurulumu yapıyor musunuz?',
        a: 'Evet. GES kurulumu ve kapasite hesaplama desteği sunuyoruz. GES Hesaplama sayfasından ön tahmin alabilir, detay teklif için bizimle iletişime geçebilirsiniz.',
      },
      {
        q: 'Garanti süresi ne kadar?',
        a: 'Garanti süresi ürün tipine göre değişir; genellikle 12-24 ay aralığındadır. Net süreler ürün sayfası ve faturada belirtilir.',
      },
      {
        q: 'Teknik destek alabilir miyim?',
        a: 'Evet. Montaj, kullanım ve güvenlik konularında e-posta veya telefon üzerinden teknik destek sağlanır.',
      },
    ],
  },
  {
    category: 'İade ve Değişim',
    questions: [
      {
        q: 'İade koşulları nelerdir?',
        a: 'Tüketici mevzuatına uygun olarak teslimattan itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekir.',
      },
      {
        q: 'Arızalı üründe ne yapmalıyım?',
        a: 'Garanti kapsamındaki arızalarda bizimle iletişime geçin. Ürün incelenir, gerekiyorsa değişim veya onarım süreci başlatılır.',
      },
    ],
  },
]

export function FAQContent() {
  return (
    <div className="space-y-8">
      {faqItems.map((section) => (
        <div key={section.category}>
          <h2 className="text-lg font-semibold text-ink mb-4 pb-2 border-b border-palette">
            {section.category}
          </h2>
          <div className="space-y-2">
            {section.questions.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-palette bg-surface-elevated shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 list-none cursor-pointer px-5 py-4 font-medium text-ink hover:bg-muted transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-ink-muted flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 pt-0 text-ink-muted text-sm leading-relaxed border-t border-palette">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
