/**
 * Public API: active discounts (for storefront)
 * Returns discounts that are active and within date range.
 * No auth required.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export type ActiveDiscount = {
  id: string
  name: string
  scope: string
  categoryName: string | null
  productIds: string[] | null
  type: string
  value: number
}

export async function GET() {
  try {
    const now = new Date()
    const discounts = await prisma.discount.findMany({
      where: {
        active: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      select: {
        id: true,
        name: true,
        scope: true,
        categoryName: true,
        productIds: true,
        type: true,
        value: true,
      },
    })

    const result: ActiveDiscount[] = discounts.map((d) => ({
      id: d.id,
      name: d.name,
      scope: d.scope,
      categoryName: d.categoryName,
      productIds: d.productIds as string[] | null,
      type: d.type,
      value: d.value,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Discounts active GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
