'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    category: 'Sipariş ve Ödeme',
    questions: [
      {
        q: 'Siparişimi nasıl verebilirim?',
        a: 'Ürün sayfamızdan sepete ekleyip ödeme adımlarını tamamlayarak sipariş verebilirsiniz. B2B siparişler için lütfen iletişime geçiniz.',
      },
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme alıyoruz. Fatura kesimi her müşteri için yapılır; kurumsal siparişlerde vade seçenekleri sunulabilir.',
      },
      {
        q: 'Fatura nasıl düzenleniyor?',
        a: 'Fatura kesimi her müşteri için yapılmaktadır. Bireysel alımlarda e-arşiv fatura, kurumsal alımlarda e-fatura kesiyoruz. Fatura bilgilerinizi sipariş veya profil sayfasından girebilirsiniz.',
      },
    ],
  },
  {
    category: 'Kargo ve Teslimat',
    questions: [
      {
        q: 'Kargo süresi ne kadar?',
        a: 'Stokta bulunan ürünler için sipariş onayından sonra 1–3 iş günü içinde kargoya verilir. Teslimat süresi bölgeye göre 1–5 iş günü arasında değişir.',
      },
      {
        q: 'Kargo ücreti ne kadar?',
        a: '3000 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde kargo ücreti sepet sayfasında hesaplanır.',
      },
      {
        q: 'Siparişimi takip edebilir miyim?',
        a: 'Evet. Sipariş onayı ve kargoya verildiğinde e-posta ile bilgilendirilirsiniz. Kargo takip numarası ile kargo firması üzerinden takip edebilirsiniz.',
      },
    ],
  },
  {
    category: 'Ürünler ve Teknik',
    questions: [
      {
        q: 'GES (güneş enerjisi santrali) kurulumu yapıyor musunuz?',
        a: 'Evet. GES kurulumu ve kapasite hesaplama hizmeti sunuyoruz. Sitedeki GES Hesaplama sayfasından aylık tüketiminize göre kabaca kurulu güç tahmini yapabilir, kurulum teklifi için iletişim sayfamızdan bize yazabilirsiniz.',
      },
      {
        q: 'Garanti süresi ne kadar?',
        a: 'Ürünlere göre değişir; genelde 12–24 ay garanti sunuyoruz. Detaylar ürün sayfasında ve faturada belirtilir.',
      },
      {
        q: 'Teknik destek alabilir miyim?',
        a: 'Evet. Montaj, kullanım ve güvenlik konularında e-posta veya telefon ile teknik destek veriyoruz. İletişim sayfasından bize ulaşabilirsiniz.',
      },
    ],
  },
  {
    category: 'İade ve Değişim',
    questions: [
      {
        q: 'İade koşulları nelerdir?',
        a: 'Tüketici mevzuatına uygun olarak, cayma hakkı süresi içinde (teslimattan itibaren 14 gün) ürünü iade edebilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır. Detaylar için İade ve Değişim sayfamıza bakın.',
      },
      {
        q: 'Arızalı ürün ne yapmalıyım?',
        a: 'Garanti kapsamındaki arızalarda iletişime geçin; ürünü inceleyip gerekirse değişim veya onarım sürecini başlatıyoruz.',
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
