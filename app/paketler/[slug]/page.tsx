import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PACKAGE_CATEGORIES, getPackageCategory } from '@/lib/package-categories'
import {
  Users,
  Zap,
  Clock,
  Package,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Sun,
} from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://voltekno.com'

export function generateStaticParams() {
  return PACKAGE_CATEGORIES.map((item) => ({ slug: item.slug }))
}

const SLUG_KEYWORDS: Record<string, string[]> = {
  'bag-evi-paketleri': ['bağ evi güneş enerji paketi', 'bağ evi solar sistem', 'küçük ges kurulumu', 'bağ evi akü sistemi'],
  'villa-paketleri': ['villa güneş paneli', 'villa solar sistem', 'ev ges kurulumu', 'villa hibrit inverter'],
  'karavan-paketleri': ['karavan güneş paneli', 'karavan solar paketi', 'karavan akü', 'mobil güneş sistemi'],
  'sulama-paketleri': ['sulama güneş enerjisi', 'solar sulama sistemi', 'tarım güneş paneli', 'güneş enerjili sulama'],
  'marin-paketleri': ['tekne güneş paneli', 'marin batarya', 'yacht güneş enerji', 'deniz lityum akü'],
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getPackageCategory(params.slug)
  if (!item) return { title: 'Paket Bulunamadı | voltekno' }

  const title = `${item.title} | voltekno`
  const description = item.seoDescription

  return {
    title,
    description,
    keywords: SLUG_KEYWORDS[params.slug] ?? [],
    alternates: { canonical: `/paketler/${item.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'voltekno',
      images: [{ url: item.image, alt: item.title, width: 900, height: 600 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.image],
    },
  }
}

function buildBreadcrumbSchema(item: NonNullable<ReturnType<typeof getPackageCategory>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Paketler', item: `${SITE_URL}/paketler` },
      { '@type': 'ListItem', position: 3, name: item.title, item: `${SITE_URL}/paketler/${item.slug}` },
    ],
  }
}

function buildFaqSchema(item: NonNullable<ReturnType<typeof getPackageCategory>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}

export default function PaketDetailPage({ params }: { params: { slug: string } }) {
  const item = getPackageCategory(params.slug)
  if (!item) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(item)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(item)) }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/paketler" className="hover:text-slate-900 transition-colors">Paketler</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-medium">{item.title}</span>
        </nav>

        {/* Hero: görsel + başlık + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-white/95 text-brand font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm">
                <Sun className="w-3.5 h-3.5" />
                Güneş Enerji Paketi
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Paket Kategorisi</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">{item.title}</h1>
            <p className="text-slate-600 text-base leading-relaxed mb-6">{item.seoDescription}</p>

            {/* Kim için */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Kimler İçin?</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.forWhom}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-brand hover:bg-brand-hover text-white rounded-xl min-h-[48px] touch-manipulation">
                <Link href={`/products?q=${encodeURIComponent(item.searchHint)}`} className="inline-flex items-center gap-2">
                  İlgili Ürünleri Gör
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-slate-300 min-h-[48px] touch-manipulation">
                <Link href="/ges">GES Hesapla</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-slate-300 min-h-[48px] touch-manipulation">
                <Link href="/contact">Teklif Al</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Kullanım Senaryosu: 4 kart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Kaç cihaz */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Kaç Cihazı Çalıştırır?</p>
            <ul className="space-y-1.5">
              {item.deviceList.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Günlük kullanım */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Ortalama Günlük Kullanım</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.dailyUsage}</p>
          </div>

          {/* İçindekiler */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">İçindekiler</p>
            <ul className="space-y-1.5">
              {item.includesItems.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          {/* Yükseltme seçenekleri */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Yükseltme Seçenekleri</p>
            <ul className="space-y-1.5">
              {item.upgradeOptions.map((opt) => (
                <li key={opt} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kullanım senaryoları + paket içeriği yan yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-light flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
              </span>
              Kullanım Senaryoları
            </h2>
            <ul className="space-y-2.5">
              {item.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand shrink-0" />
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-slate-700" />
              </span>
              Öne Çıkan Özellikler
            </h2>
            <ul className="space-y-2.5">
              {item.includedHighlights.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-900 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* SSS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {item.faq.map((qa) => (
              <details key={qa.question} className="group border border-slate-200 rounded-xl overflow-hidden">
                <summary className="cursor-pointer font-semibold text-slate-900 px-4 py-3.5 flex items-center justify-between gap-2 select-none hover:bg-slate-50 transition-colors">
                  {qa.question}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-slate-600 text-sm px-4 py-3 border-t border-slate-100">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Kategori navigasyon linkleri */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/products"
            className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-brand hover:text-brand transition-colors text-sm font-medium"
          >
            Tüm Ürünler
          </Link>
          <Link
            href="/category/gunes-enerjisi"
            className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-brand hover:text-brand transition-colors text-sm font-medium"
          >
            Güneş Enerjisi
          </Link>
          <Link
            href="/category/batarya-depolama"
            className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-brand hover:text-brand transition-colors text-sm font-medium"
          >
            Batarya ve Depolama
          </Link>
        </section>

      </div>
    </div>
  )
}
