import AdminOrderDetailClient from './AdminOrderDetailClient'

export async function generateStaticParams() {
  return [{ id: '_' }]
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />
}
