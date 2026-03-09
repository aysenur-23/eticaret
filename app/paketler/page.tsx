import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PACKAGE_CATEGORIES } from '@/lib/package-categories'

export const metadata: Metadata = {
  title: 'Enerji Paketleri — Bağ Evi, Villa, Karavan, Sulama, Marin',
  description:
    'Bağ evi, villa, karavan, tarımsal sulama ve marin uygulamaları için hazır güneş enerji paketleri. Güneş paneli, inverter ve akü kombinasyonları. voltekno\'dan hızlı teslimat ve teknik destek.',
  keywords: [
    'bağ evi güneş enerji paketi',
    'villa güneş paneli paketi',
    'karavan güneş paneli',
    'sulama güneş enerjisi',
    'marin güneş enerji paketi',
    'hazır solar paket',
    'güneş enerji sistemi fiyatları',
    'ges paketi',
  ],
  alternates: { canonical: '/paketler' },
  openGraph: {
    title: 'Enerji Paketleri | voltekno',
    description: 'Bağ evi, villa, karavan, sulama ve marin için hazır güneş enerji paketleri.',
    type: 'website',
    siteName: 'voltekno',
  },
}

export default function PaketlerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 md:py-14">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Paket Kategorileri</h1>
          <p className="mt-2 text-slate-600">İhtiyaca göre hazırlanmış enerji paketlerini inceleyin.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PACKAGE_CATEGORIES.map((item) => (
            <Link key={item.slug} href={`/paketler/${item.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-slate-900 text-lg">{item.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
