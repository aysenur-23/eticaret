export const dynamic = 'force-dynamic'

/**
 * Admin Stats API
 * GET /api/admin/stats
 * Dashboard için gerçek zamanlı metrikler döner.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/adminAuth'
import { getMergedProducts } from '@/lib/catalog-merge'

export async function GET(request: NextRequest) {
  const auth = await checkAdmin(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Bugünün başlangıcı
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // Paralel sorgular
    const [products, activeCoupons, todayOrders, pendingOrders, totalOrders] = await Promise.all([
      getMergedProducts(),
      prisma.discount.count({ where: { active: true } }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count(),
    ])

    const totalProducts = products.length
    const outOfStockProducts = products.filter((p) => (p.stock ?? 0) === 0).length

    // Bugünkü ciro (Prisma siparişleri)
    const todayRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: todayStart } },
    })

    // Bu ayki ciro
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: monthStart } },
    })

    return NextResponse.json({
      totalProducts,
      outOfStockProducts,
      activeCoupons,
      todayOrders,
      pendingOrders,
      totalOrders,
      todayRevenue: todayRevenue._sum.total ?? 0,
      monthRevenue: monthRevenue._sum.total ?? 0,
    })
  } catch (error) {
    console.error('Admin stats GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
