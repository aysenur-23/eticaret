/**
 * Product Reviews API
 * GET: Get reviews for a product
 * POST: Create a new review
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    return decoded.userId
  } catch {
    return null
  }
}

// Static export için gerekli - Next.js 14 nested route support
export function generateStaticParams() {
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: params.id,
        status: 'approved',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false, // Email'i gizle, sadece isim göster
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Ortalama rating hesapla
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({ 
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    })
  } catch (error) {
    console.error('Reviews GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, title, comment, images } = body

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Yıldız ve yorum gereklidir' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Yıldız 1-5 arası olmalıdır' },
        { status: 400 }
      )
    }

    // Kullanıcının daha önce bu ürün için değerlendirme yapıp yapmadığını kontrol et
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: params.id,
        userId: userId,
      },
    })

    if (existingReview) {
      // Mevcut değerlendirmeyi güncelle
      const review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: parseInt(rating),
          title: title || null,
          comment,
          images: images || null,
          status: 'pending', // Güncelleme için tekrar onay gerekli
        },
      })

      return NextResponse.json({ success: true, review }, { status: 200 })
    }

    // Yeni değerlendirme oluştur
    const review = await prisma.review.create({
      data: {
        productId: params.id,
        userId: userId,
        rating: parseInt(rating),
        title: title || null,
        comment,
        images: images || null,
        status: 'approved', // Otomatik onay (isteğe bağlı olarak 'pending' yapılabilir)
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Review POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

