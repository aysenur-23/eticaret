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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        // Try to get product details if Product model exists
      },
    })

    // Get product details for each favorite
    const favoritesWithProducts = await Promise.all(
      favorites.map(async (favorite) => {
        try {
          // Try to get product from Product model if it exists
          const product = await prisma.product.findUnique({
            where: { id: favorite.productId },
            select: {
              id: true,
              slug: true,
              name: true,
              description: true,
              images: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              variants: {
                where: { isActive: true },
                select: {
                  id: true,
                  price: true,
                  stock: {
                    select: {
                      onHand: true,
                      reserved: true,
                    },
                  },
                },
                take: 1,
                orderBy: { price: 'asc' },
              },
            },
          }).catch(() => null)

          if (product) {
            // Get first image from images JSON
            const images = product.images as any
            const firstImage = images && Array.isArray(images) && images.length > 0 
              ? images[0].url 
              : null

            // Get price from first variant
            const firstVariant = product.variants && product.variants.length > 0 
              ? product.variants[0] 
              : null
            const price = firstVariant ? Number(firstVariant.price) : 0
            const stock = firstVariant?.stock 
              ? firstVariant.stock.onHand - firstVariant.stock.reserved 
              : 0

            return {
              ...favorite,
              product: {
                id: product.id,
                slug: product.slug,
                name: product.name,
                description: product.description,
                price,
                image: firstImage,
                category: product.category?.name || null,
                stock,
              },
            }
          }

          return {
            ...favorite,
            product: null,
          }
        } catch {
          return {
            ...favorite,
            product: null,
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      favorites: favoritesWithProducts,
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Ürün zaten favorilerinizde',
      })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    })

    return NextResponse.json({
      success: true,
      favorite,
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      )
    }

    await prisma.favorite.deleteMany({
      where: { userId, productId },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

