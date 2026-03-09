import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PACKAGE_CATEGORIES, getPackageCategory } from '@/lib/package-categories'

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
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Paketler',
        item: `${SITE_URL}/paketler`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.title,
        item: `${SITE_URL}/paketler/${item.slug}`,
      },
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
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10 md:py-14">
        <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/paketler" className="hover:text-slate-900">Paketler</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Paket Kategorisi</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight text-slate-900">{item.title}</h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg">{item.seoDescription}</p>
            <p className="mt-3 text-slate-600">{item.targetAudience}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-brand hover:bg-brand-hover text-white rounded-xl">
                <Link href={`/products?q=${encodeURIComponent(item.searchHint)}`}>İlgili Ürünleri Gör</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-slate-300">
                <Link href="/ges">GES Hesaplama</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-slate-300">
                <Link href="/contact">Teklif Al</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-slate-900">Kullanım Senaryoları</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {item.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-slate-900">Paket İçeriği Öne Çıkanlar</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {item.includedHighlights.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-slate-900">Sık Sorulan Sorular</h2>
          <div className="mt-4 space-y-3">
            {item.faq.map((qa) => (
              <details key={qa.question} className="group border border-slate-200 rounded-xl p-4">
                <summary className="cursor-pointer font-semibold text-slate-900">{qa.question}</summary>
                <p className="mt-2 text-slate-600">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/products" className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-slate-300">Tüm Ürünler</Link>
          <Link href="/category/gunes-enerjisi" className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-slate-300">Güneş Enerjisi</Link>
          <Link href="/category/batarya-depolama" className="text-center rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 hover:border-slate-300">Batarya ve Depolama</Link>
        </section>
      </div>
    </div>
  )
}
