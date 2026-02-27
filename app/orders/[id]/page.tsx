import OrderDetailClient from './OrderDetailClient'

export async function generateStaticParams() {
  return [{ id: '_' }]
}

export default function OrderDetailPage() {
  return <OrderDetailClient />
}
