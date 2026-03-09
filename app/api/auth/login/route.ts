import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(request, 'login', 15, 60_000)) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla giriş denemesi. Lütfen bir dakika sonra tekrar deneyin.' },
        { status: 429 }
      )
    }
    const { email, password, rememberMe } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ success: false, error: 'Sunucu yapılandırma hatası.' }, { status: 503 })
    }

    const expiresIn = rememberMe ? '7d' : '24h'
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    )

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

