import { CATEGORY_GROUPS } from '@/lib/categories'
import { CategoryPageClient } from './CategoryPageClient'

export function generateStaticParams() {
  return CATEGORY_GROUPS.map((group) => ({ id: group.id }))
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  return <CategoryPageClient id={params.id} />
}
