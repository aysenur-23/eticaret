/**
 * Search API Route
 * Handles product search with parametric filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PostgresSearchAdapter } from '@/lib/adapters/search/postgres'

export const dynamic = 'force-dynamic'

const searchAdapter = new PostgresSearchAdapter(prisma)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      query: searchParams.get('q') || undefined,
      categoryId: searchParams.get('category') || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      lifecycle: searchParams.get('lifecycle')?.split(',') || undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      specs: parseSpecFilters(searchParams),
      certifications: parseCertFilters(searchParams),
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = searchParams.get('limit')
    const pageSize = limit ? parseInt(limit) : parseInt(searchParams.get('pageSize') || '24')

    const result = await searchAdapter.search(filters, page, pageSize)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function parseSpecFilters(searchParams: URLSearchParams): Record<string, any> | undefined {
  const specs: Record<string, any> = {}
  
  // Example: ?voltage_min=12&voltage_max=24&current_min=10
  searchParams.forEach((value, key) => {
    if (key.endsWith('_min')) {
      const specKey = key.replace('_min', '')
      if (!specs[specKey]) specs[specKey] = {}
      specs[specKey].min = parseFloat(value)
    } else if (key.endsWith('_max')) {
      const specKey = key.replace('_max', '')
      if (!specs[specKey]) specs[specKey] = {}
      specs[specKey].max = parseFloat(value)
    } else if (key.startsWith('spec_')) {
      const specKey = key.replace('spec_', '')
      specs[specKey] = { value }
    }
  })

  return Object.keys(specs).length > 0 ? specs : undefined
}

function parseCertFilters(searchParams: URLSearchParams): Record<string, boolean> | undefined {
  const certs: Record<string, boolean> = {}
  
  // Example: ?rohs=true&ce=true
  const certKeys = ['rohs', 'reach', 'ce', 'ip']
  certKeys.forEach((key) => {
    const value = searchParams.get(key)
    if (value === 'true') {
      certs[key] = true
    }
  })

  return Object.keys(certs).length > 0 ? certs : undefined
}


