/** @type {import('next').NextConfig} */
// STATIC EXPORT İÇİN - Hostinger paylaşımlı hosting için
// NOT: Bu yapılandırma ile server-side rendering ve API routes çalışmaz
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true, // Static export için gerekli
  },
  // Static export için
  output: 'export',
  // Production optimizasyonları
  compress: true,
  poweredByHeader: false,
  // Production build optimizasyonları
  swcMinify: true,
  reactStrictMode: true,
  // Static export için trailing slash
  trailingSlash: true,
}

module.exports = nextConfig

