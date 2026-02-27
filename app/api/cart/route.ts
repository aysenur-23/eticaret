/**
 * Cart API Routes
 * Handles cart operations (get, add, update, remove)
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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }

    // Convert to frontend format
    const items = cart.items.map(item => ({
      id: item.id,
      name: item.variant.product.name,
      description: item.variant.product.description,
      price: item.unitPrice,
      quantity: item.quantity,
      image: (item.variant.product.images as { url?: string }[] | null)?.[0]?.url ?? null,
      category: (item.variant.product as any).categoryId ?? null,
      variantId: item.variantId,
      productId: item.variant.productId,
    }))

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return NextResponse.json({ items, total })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body // Frontend'den gelen tüm sepet items

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      })
    }

    // Clear existing items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    // Add new items (for now, we'll use productId directly since we're using mockProducts)
    // In production, you'd need to map productId to variantId
    for (const item of items) {
      // For mock products, we'll create a simple cart item
      // In production, you'd need to find the variant by productId
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: item.id, // Using item.id as variantId for now
          quantity: item.quantity,
          unitPrice: item.price,
          vatRate: 0.20, // Default VAT rate
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Verify the item belongs to the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

