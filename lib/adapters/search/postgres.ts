/**
 * PostgreSQL Search Adapter
 * Implements full-text and parametric search using PostgreSQL JSONB and trigram indexes
 */

import { PrismaClient } from '@prisma/client'

export interface SearchFilters {
  query?: string
  categoryId?: string
  priceMin?: number
  priceMax?: number
  specs?: Record<string, { min?: number; max?: number; value?: string | number }> // Parametric filters
  lifecycle?: string[]
  certifications?: Record<string, boolean> // e.g., { rohs: true, ce: true }
  inStock?: boolean
  featured?: boolean
}

export interface SearchResult {
  products: any[]
  total: number
  facets?: Record<string, any>
}

export class PostgresSearchAdapter {
  constructor(private prisma: PrismaClient) {}

  async search(filters: SearchFilters, page: number = 1, pageSize: number = 24): Promise<SearchResult> {
    const skip = (page - 1) * pageSize

    // Build where clause
    const where: any = {
      active: true,
    }

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId
    }

    // Price filter (on variants)
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.variants = {
        some: {
          isActive: true,
          price: {
            ...(filters.priceMin !== undefined && { gte: filters.priceMin }),
            ...(filters.priceMax !== undefined && { lte: filters.priceMax }),
          },
        },
      }
    }

    // Lifecycle filter
    if (filters.lifecycle && filters.lifecycle.length > 0) {
      where.lifecycle = { in: filters.lifecycle }
    }

    // Featured filter
    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      where.stock = {
        some: {
          onHand: filters.inStock ? { gt: 0 } : { lte: 0 },
        },
      }
    }

    // Text search (name, description, MPN, SKU)
    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { nameEn: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { mpn: { contains: filters.query, mode: 'insensitive' } },
        { sku: { contains: filters.query, mode: 'insensitive' } },
        // JSONB search in specs
        { specs: { path: ['$'], string_contains: filters.query } },
      ]
    }

    // Parametric filters (JSONB queries)
    if (filters.specs && Object.keys(filters.specs).length > 0) {
      const specConditions: any[] = []
      
      for (const [key, filter] of Object.entries(filters.specs)) {
        if (filter.min !== undefined || filter.max !== undefined) {
          // Range filter
          const path = `$.${key}`
          if (filter.min !== undefined) {
            specConditions.push({
              specs: {
                path: [path],
                gte: filter.min,
              },
            })
          }
          if (filter.max !== undefined) {
            specConditions.push({
              specs: {
                path: [path],
                lte: filter.max,
              },
            })
          }
        } else if (filter.value !== undefined) {
          // Exact match
          specConditions.push({
            specs: {
              path: [`$.${key}`],
              equals: filter.value,
            },
          })
        }
      }

      if (specConditions.length > 0) {
        where.AND = (where.AND || []).concat(specConditions)
      }
    }

    // Certifications filter
    if (filters.certifications && Object.keys(filters.certifications).length > 0) {
      const certConditions: any[] = []
      for (const [key, value] of Object.entries(filters.certifications)) {
        certConditions.push({
          certifications: {
            path: [`$.${key}`],
            equals: value,
          },
        })
      }
      if (certConditions.length > 0) {
        where.AND = (where.AND || []).concat(certConditions)
      }
    }

    // Execute query
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: {
              stock: true,
            },
          },
          stock: true,
        },
        skip,
        take: pageSize,
        orderBy: filters.featured ? { isFeatured: 'desc' } : { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ])

    return {
      products,
      total,
    }
  }

  /**
   * Get search facets (for filter UI)
   */
  async getFacets(filters: SearchFilters): Promise<Record<string, any>> {
    // This would aggregate common spec values for faceting
    // For now, return empty object
    return {}
  }
}

