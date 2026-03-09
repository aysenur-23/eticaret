import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tüm Kategoriler | Ürün Kategorileri',
  description: 'Şarj istasyonları, batarya, güneş enerjisi ve inverter kategorilerinde ürünlere göz atın.',
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
