import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const code = searchParams.get('code')
    const email = searchParams.get('email')

    if (!token && !code) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama token\'ı veya kodu gerekli' },
        { status: 400 }
      )
    }

    // Token ile doğrulama
    if (token) {
      const user = await prisma.user.findUnique({
        where: { emailVerificationToken: token },
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz veya süresi dolmuş doğrulama linki' },
          { status: 400 }
        )
      }

      // Token süresi kontrolü
      if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Doğrulama linkinin süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.' },
          { status: 400 }
        )
      }

      // E-postayı doğrula
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      })

      // Başarılı sayfasına yönlendir
      return NextResponse.redirect(new URL('/login?verified=true', request.url))
    }

    // Kod ile doğrulama
    if (code && email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Kullanıcı bulunamadı' },
          { status: 400 }
        )
      }

      // Kod kontrolü (basit implementasyon - production'da daha güvenli olmalı)
      // Burada token'ın son 6 karakterini kod olarak kullanıyoruz
      const expectedCode = user.emailVerificationToken?.slice(-6).toUpperCase()
      
      if (code.toUpperCase() !== expectedCode) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz doğrulama kodu' },
          { status: 400 }
        )
      }

      // Token süresi kontrolü
      if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.' },
          { status: 400 }
        )
      }

      // E-postayı doğrula
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'E-posta adresiniz başarıyla doğrulandı',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Geçersiz istek' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

