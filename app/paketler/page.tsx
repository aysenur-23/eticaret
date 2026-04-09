import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { PACKAGE_CATEGORIES } from '@/lib/package-categories'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://voltekno.com'

export const metadata: Metadata = {
  title: 'Enerji Paketleri | Bag Evi, Villa, Karavan, Sulama, Marin ve Bungalov Cozumleri',
  description:
    'Bag evi, dag evi, yayla evi, bungalov, villa, karavan, tarimsal sulama ve marin uygulamalari icin hazir gunes enerji paketleri. GES, inverter ve batarya cozumleriyle ihtiyaca uygun sistemler.',
  keywords: [
    'bag evi gunes enerji paketi',
    'dag evi solar sistem',
    'yayla evi gunes paneli',
    'bungalov enerji paketi',
    'villa gunes paneli paketi',
    'karavan gunes paneli',
    'sulama gunes enerjisi',
    'marin gunes enerji paketi',
    'hazir solar paket',
    'gunes enerji sistemi fiyatlari',
    'ges paketi',
  ],
  alternates: { canonical: '/paketler' },
  openGraph: {
    title: 'Enerji Paketleri | voltekno',
    description: 'Bag evi, villa, karavan, sulama ve marin icin hazir gunes enerji paketleri.',
    type: 'website',
    siteName: 'voltekno',
    url: `${SITE_URL}/paketler`,
  },
}

function buildPackageListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Enerji Paketleri',
    description: 'Farkli kullanim alanlari icin hazirlanmis gunes enerji paketleri.',
    url: `${SITE_URL}/paketler`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PACKAGE_CATEGORIES.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/paketler/${item.slug}`,
        name: item.seoTitle,
      })),
    },
  }
}

export default function PaketlerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPackageListSchema()) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Paket Kategorileri</h1>
          <p className="mt-2 text-slate-600">Ihtiyaca gore hazirlanmis enerji paketlerini inceleyin.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
          {PACKAGE_CATEGORIES.map((item) => {
            return (
              <Link
                key={item.slug}
                href={`/paketler/${item.slug}`}
                className="group overflow-hidden rounded-[30px] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.09)] ring-1 ring-slate-200/80 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)] transition-all duration-500"
              >
                <div className="relative aspect-[11/14] bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectPosition: item.objectPosition ?? 'center' }}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-slate-950/58 via-slate-950/18 to-transparent" />
                  <div className="absolute left-0 top-0 h-36 w-36 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.34),transparent_72%)]" />
                  <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
                    <div className="max-w-[12.75rem] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.34),rgba(15,23,42,0.12))] px-4 py-3.5 pr-5 shadow-[0_16px_34px_rgba(15,23,42,0.14)] backdrop-blur-[2px]">
                      <span className="mb-2.5 block h-px w-10 bg-gradient-to-r from-[#e7c15b] to-transparent" />
                      <h2 className="text-[1.8rem] sm:text-[1.95rem] font-black uppercase leading-[0.92] tracking-[-0.045em] [text-wrap:balance]">
                        <span className="block text-[#e7c15b] drop-shadow-[0_6px_20px_rgba(15,23,42,0.35)]">
                          {item.shortTitle}
                        </span>
                        <span className="mt-1 block text-white drop-shadow-[0_6px_20px_rgba(15,23,42,0.38)]">
                          Paketleri
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
