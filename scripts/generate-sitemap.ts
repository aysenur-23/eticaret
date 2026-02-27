/**
 * Sitemap Generator
 * Generates sitemap.xml for SEO
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bataryakit.com'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...')

  const urls: SitemapUrl[] = []

  // Static pages
  urls.push(
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/urunler`, changefreq: 'daily', priority: 0.9 },
    { loc: `${baseUrl}/hakkimizda`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/iletisim`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/kvkk`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/mesafeli-satis-sozlesmesi`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/iade-degisim`, changefreq: 'yearly', priority: 0.3 }
  )

  // Categories
  const categories = await prisma.category.findMany({
    where: { active: true },
  })

  for (const category of categories) {
    urls.push({
      loc: `${baseUrl}/kategoriler/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: category.updatedAt.toISOString(),
    })
  }

  // Products
  const products = await prisma.product.findMany({
    where: { active: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  for (const product of products) {
    urls.push({
      loc: `${baseUrl}/urun/${product.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: product.updatedAt.toISOString(),
    })
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  // Write to public directory
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml')
  writeFileSync(outputPath, sitemap, 'utf-8')

  console.log(`✅ Sitemap generated: ${urls.length} URLs`)
  console.log(`   Output: ${outputPath}`)
}

generateSitemap()
  .catch((e) => {
    console.error('❌ Sitemap generation error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


