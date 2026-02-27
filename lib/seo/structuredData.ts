/**
 * Structured Data (JSON-LD) Generator
 * Creates structured data for SEO (Product, BreadcrumbList, etc.)
 */

export interface ProductStructuredData {
  name: string
  description: string
  image?: string[]
  brand?: string
  mpn?: string
  sku?: string
  offers: {
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generate Product JSON-LD structured data
 */
export function generateProductStructuredData(
  product: ProductStructuredData
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || [],
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    mpn: product.mpn,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: `https://schema.org/${product.offers.availability}`,
      url: product.offers.url,
    },
    aggregateRating: product.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.aggregateRating.ratingValue,
          reviewCount: product.aggregateRating.reviewCount,
        }
      : undefined,
  }
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbStructuredData(
  items: BreadcrumbItem[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Organization JSON-LD structured data
 */
export function generateOrganizationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Batarya Kit',
    url: 'https://bataryakit.com',
    logo: 'https://bataryakit.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
    },
  }
}

/**
 * Generate WebSite JSON-LD structured data
 */
export function generateWebSiteStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Batarya Kit',
    url: 'https://bataryakit.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bataryakit.com/urunler?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}


