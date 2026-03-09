import type { Metadata } from 'next'
import { mockProducts } from '@/lib/products-mock'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ id: p.id }))
}

const SITE_NAME = 'voltekno'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://voltekno.com'

function truncate(str: string, max: number) {
  if (!str || str.length <= max) return str
  return str.slice(0, max).trim() + '…'
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = mockProducts.find((p) => p.id === params.id)
  if (!product) return { title: 'Ürün Bulunamadı' }

  const title = `${product.name} | ${SITE_NAME}`
  const baseDesc = product.description || `${product.name} — ${product.category}.`
  const description = truncate(baseDesc, 160)
  const image = (product.images && product.images[0]) || product.image
  const imageUrl = image?.startsWith('http') ? image : image ? `${SITE_URL}${image}` : undefined
  const keywords = [
    product.name,
    product.category,
    product.brand,
    'voltekno',
    'satın al',
    'fiyat',
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/products/${product.id}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${product.id}`,
      siteName: SITE_NAME,
      ...(imageUrl && { images: [{ url: imageUrl, alt: product.name, width: 800, height: 800 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

function buildProductJsonLd(product: (typeof mockProducts)[number]) {
  const image = (product.images && product.images[0]) || product.image
  const imageUrl = image?.startsWith('http') ? image : image ? `${SITE_URL}${image}` : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncate(product.description || product.name, 300),
    sku: product.sku,
    ...(imageUrl && { image: imageUrl }),
    ...(product.brand && {
      brand: { '@type': 'Brand', name: product.brand },
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews ?? 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'TRY',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'voltekno',
        url: SITE_URL,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 3000 ? 0 : 150,
          currency: 'TRY',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          cutoffTime: '15:00',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        },
      },
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id)
  if (!product) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }}
      />
      <ProductDetailClient initialProduct={product} productId={params.id} />
    </>
  )
}
