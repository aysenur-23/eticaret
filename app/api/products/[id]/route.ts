/**
 * Product Detail API by ID or Slug
 * Önce site kataloğu (mock + ProductOverride) aranır; yoksa Prisma Product döner.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMergedProductById } from '@/lib/catalog-merge'

export function generateStaticParams() {
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const merged = await getMergedProductById(id)
    if (merged) {
      return NextResponse.json(merged)
    }

    // Fallback: Prisma Product (id veya slug)
    let product = await prisma.product.findUnique({
      where: { id },
      where: { id: params.id },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          include: {
            stock: true,
          },
        },
        priceRules: {
          where: { active: true },
        },
        compatibleProducts: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
        similarProducts: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
        reviews: {
          where: { status: 'approved' },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        questions: {
          where: { status: { in: ['pending', 'answered'] } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: {
              stock: true,
            },
          },
          priceRules: {
            where: { active: true },
          },
          compatibleProducts: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
            },
          },
          similarProducts: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
            },
          },
          reviews: {
            where: { status: 'approved' },
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          questions: {
            where: { status: { in: ['pending', 'answered'] } },
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    }

    if (!product || !product.active) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

