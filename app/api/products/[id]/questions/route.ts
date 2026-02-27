/**
 * Product Questions API
 * GET: Get questions for a product
 * POST: Create a new question
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Static export için gerekli - Next.js 14 nested route support
export function generateStaticParams() {
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.productQuestion.findMany({
      where: {
        productId: params.id,
        status: { in: ['pending', 'answered'] },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Questions GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { question, userId } = body

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const productQuestion = await prisma.productQuestion.create({
      data: {
        productId: params.id,
        userId: userId || null,
        question,
        status: 'pending',
      },
    })

    return NextResponse.json({ question: productQuestion }, { status: 201 })
  } catch (error) {
    console.error('Question POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

