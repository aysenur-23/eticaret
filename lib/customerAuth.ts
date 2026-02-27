/**
 * Müşteri (customer) JWT doğrulama.
 * firebase-session veya login sonrası verilen Bearer token ile userId döner.
 */

import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * Authorization: Bearer <token> ile gelen istekten userId döner.
 * Geçersiz veya yoksa null.
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    return decoded.userId ?? null
  } catch {
    return null
  }
}
