/**
 * Basit in-memory rate limit (IP veya identifier bazlı).
 * Sunucu yeniden başlayınca sıfırlanır; production için Redis vb. kullanılabilir.
 */

const store = new Map<string, { count: number; resetAt: number }>()

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`
}

function getIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  return 'unknown'
}

/**
 * Rate limit kontrolü. Limit aşılırsa true döner (istek reddedilmeli).
 * @param request NextRequest veya Request
 * @param prefix Route adı (örn. 'contact', 'login')
 * @param maxRequests Dakika başına max istek
 * @param windowMs Pencere süresi (ms), varsayılan 60_000 (1 dk)
 */
export function isRateLimited(
  request: Request,
  prefix: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const key = getKey(getIdentifier(request), prefix)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count += 1
  if (entry.count > maxRequests) {
    return true
  }
  return false
}

/**
 * Periyodik temizlik (opsiyonel): süresi dolan anahtarları siler.
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, value] of store.entries()) {
    if (now >= value.resetAt) store.delete(key)
  }
}
