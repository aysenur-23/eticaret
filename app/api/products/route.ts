/**
 * Public Products API (site kataloğu)
 * GET: Mock + ProductOverride merge listesi. Query: category?, q? (arama), brand?.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getMergedProducts } from '@/lib/catalog-merge'
import { productMatchesQuery } from '@/lib/search-product'

export async function GET(request: NextRequest) {
  try {
    const products = await getMergedProducts()
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const q = searchParams.get('q')?.trim()
    const brand = searchParams.get('brand')

    let result = products

    if (category) {
      const decoded = decodeURIComponent(category)
      result = result.filter((p) => p.category === decoded)
    }

    if (brand) {
      result = result.filter((p) => p.brand === brand)
    }

    if (q) {
      result = result.filter((p) => productMatchesQuery(p, q))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
