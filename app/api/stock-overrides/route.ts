/**
 * Public: Stok override listesi (ürün kartları ve detay sayfası için).
 * GET: Tüm productId -> stock eşlemesini döner.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const list = await prisma.stockOverride.findMany({
      select: { productId: true, stock: true },
    })
    const map: Record<string, number> = {}
    list.forEach((row) => {
      map[row.productId] = row.stock
    })
    return NextResponse.json(map)
  } catch (error) {
    console.error('Stock overrides GET error:', error)
    return NextResponse.json({}, { status: 500 })
  }
}
