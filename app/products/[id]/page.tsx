import { mockProducts } from '@/lib/products-mock'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

/** Static export: tüm ürün sayfaları build'de üretilir. */
export async function generateStaticParams() {
  return mockProducts.map((p) => ({ id: p.id }))
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id)
  if (!product) notFound()
  return <ProductDetailClient initialProduct={product} productId={params.id} />
}
