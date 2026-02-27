/**
 * Kategori listesini döndürür (header/sidebar filtreleme için).
 * Sadece statik liste kullanır; Prisma/DB yok, production'da 500 oluşmaz.
 */

import { NextResponse } from 'next/server'
import { ALL_CATEGORY_VALUES } from '@/lib/categories'

export async function GET() {
  try {
    const categoryValues = [...ALL_CATEGORY_VALUES]
    return NextResponse.json({ categoryValues })
  } catch {
    return NextResponse.json({ categoryValues: [] })
  }
}
