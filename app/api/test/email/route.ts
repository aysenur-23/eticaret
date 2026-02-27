/**
 * Test Email API
 * Tests SMTP connection and sends a test email
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { verifySMTPConnection } from '@/lib/email-smtp'

export async function GET(request: NextRequest) {
  try {
    // Check if SMTP is configured
    const hasSMTP = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD)
    const hasResend = !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_demo')

    // Verify SMTP connection if configured
    let smtpVerified = false
    if (hasSMTP) {
      smtpVerified = await verifySMTPConnection()
    }

    return NextResponse.json({
      smtp: {
        configured: hasSMTP,
        verified: smtpVerified,
        host: process.env.SMTP_HOST || 'not set',
        port: process.env.SMTP_PORT || 'not set',
        user: process.env.SMTP_USER ? '***configured***' : 'not set',
      },
      resend: {
        configured: hasResend,
      },
      active: hasSMTP ? 'SMTP' : hasResend ? 'Resend' : 'None',
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 })
    }

    // Send test email
    const result = await sendEmail(
      to,
      'Test Email - Batarya Kit',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Test Email Başarılı!</h2>
          <p>Bu bir test e-postasıdır.</p>
          <p>E-posta servisiniz düzgün çalışıyor.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}
          </p>
        </div>
      `
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        data: result.data,
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email send test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

