/**
 * Tarayıcı (client) bundle için undici stub.
 * undici Node tarafında fetch vb. sağlar; tarayıcıda global fetch kullanılır.
 * Bu dosya client'ta undici import edildiğinde kullanılır, böylece #target parse hatası önlenir.
 */
const g = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}
const nativeFetch = g.fetch

module.exports = {
  fetch: nativeFetch,
  Request: g.Request,
  Response: g.Response,
  Headers: g.Headers,
  FormData: g.FormData,
  AbortController: g.AbortController,
  AbortSignal: g.AbortSignal,
}
