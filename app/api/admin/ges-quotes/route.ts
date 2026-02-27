/**
 * Admin: GES teklif istekleri listesi.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  const auth = await checkAdmin(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '200', 10), 500)
    const list = await prisma.gesQuoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error('Admin ges-quotes error:', error)
    return NextResponse.json(
      { error: 'Liste alınamadı.' },
      { status: 500 }
    )
  }
}
