import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailSMTP } from '@/lib/email-smtp'
import crypto from 'crypto'
import React from 'react'
// @ts-ignore - React Email component
import PasswordResetEmail from '@/emails/PasswordResetEmail'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-posta adresi gerekli' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      } as any, // Type assertion - resetToken fields exist in schema
    })

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://bataryakit.com'}/reset-password?token=${resetToken}`

    // Send password reset email
    const emailContent = React.createElement(PasswordResetEmail, {
      name: user.name,
      resetUrl,
    })

    try {
      const emailResult = await sendEmailSMTP(
        user.email,
        'Şifre Sıfırlama - Batarya Kit',
        emailContent
      )

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error)
        // Don't fail the request, just log the error
        // In development, you might want to return the reset token for testing
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode - Reset token:', resetToken)
          console.log('Development mode - Reset URL:', resetUrl)
        }
      } else {
        console.log('Password reset email sent successfully to:', user.email)
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // In development, log the reset token for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - Reset token:', resetToken)
        console.log('Development mode - Reset URL:', resetUrl)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

