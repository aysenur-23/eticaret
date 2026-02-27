import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmailSMTP } from '@/lib/email-smtp'
import { EmailVerification } from '@/emails/EmailVerification'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'E-posta, şifre ve ad soyad gereklidir' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24) // 24 saat geçerli

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        phone,
        role: 'customer',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      } as any, // Temporary: TypeScript types will update after TS server restart
    })

    // Generate verification code (token'ın son 6 karakteri)
    const verificationCode = verificationToken.slice(-6).toUpperCase()

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://bataryakit.com'
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`
    
    try {
      await sendEmailSMTP(
        user.email,
        'E-posta Adresinizi Doğrulayın - Batarya Kit',
        EmailVerification({
          name: user.name,
          verificationUrl,
          verificationCode,
        })
      )
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError)
      // Email gönderilemese bile kullanıcı oluşturuldu, sadece log'a yaz
    }

    // Generate JWT token (email doğrulanmadan da token ver, ama emailVerified false olacak)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, emailVerified: false },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    // Return user (without password and verification token)
    const { password: _, ...userWithoutPassword } = user as any
    // Remove sensitive fields from response
    delete (userWithoutPassword as any).emailVerificationToken
    delete (userWithoutPassword as any).emailVerificationExpires

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Kayıt başarılı! E-posta adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktifleştirin.',
      verificationCode, // Development için kod da döndürülebilir
    })
  } catch (error: any) {
    console.error('Register error:', error)
    
    // Daha detaylı hata mesajı
    let errorMessage = 'Bir hata oluştu'
    if (error?.code === 'P2002') {
      errorMessage = 'Bu e-posta adresi zaten kullanılıyor'
    } else if (error?.message?.includes('DATABASE_URL')) {
      errorMessage = 'Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin.'
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

