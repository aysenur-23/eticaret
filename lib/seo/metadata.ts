/**
 * SEO Metadata Utilities
 * Helper functions for generating page metadata
 */

import { Metadata } from 'next'

export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
}

export function generateMetadata(meta: PageMetadata): Metadata {
  const siteName = 'Batarya Kit'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bataryakit.com'
  const fullTitle = meta.title.includes(siteName) ? meta.title : `${meta.title} | ${siteName}`
  const imageUrl = meta.image || `${baseUrl}/og-image.jpg`
  const pageUrl = meta.url || baseUrl

  return {
    title: fullTitle,
    description: meta.description,
    keywords: meta.keywords?.join(', '),
    openGraph: {
      title: fullTitle,
      description: meta.description,
      url: pageUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      type: meta.type || 'website',
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: meta.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}


