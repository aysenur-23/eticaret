'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { fmtPrice } from '@/lib/format'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import type { ProductVariant } from '@/components/AddToCartButton'

export interface ProductCardProduct {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category?: string
  brand?: string
}

export interface ProductCardProps {
  product: ProductCardProduct
  oldPrice?: number
  discount?: number
  badges?: string[]
  sku?: string
  rating?: number
  stock?: number
  isVariantProduct?: boolean
  selectedVariant?: ProductVariant
  variant?: 'compact' | 'full'
  className?: string
}

export function ProductCard({
  product,
  selectedVariant,
  variant = 'full',
  className = '',
}: ProductCardProps) {
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const isCompact = variant === 'compact'
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [product.id, product.image])

  const hasRealImage = Boolean(product.image && !imageError && !product.image.includes('placeholder'))
  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const formatPrice = (amount: number) => fmtPrice(amount, currency, rates?.rates ?? null)

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <Card
        className={`group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full ${className}`}
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          <div className={`absolute inset-0 flex items-center justify-center ${hasRealImage ? 'bg-white' : 'bg-slate-100'}`}>
            {hasRealImage ? (
              <div className={`absolute ${isCompact ? 'inset-3 sm:inset-4' : 'inset-4 sm:inset-5'}`}>
                <Image
                  src={product.image!}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <Package className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />
            )}
          </div>
        </div>

        <div className={`${isCompact ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} border-t border-slate-100`}>
          <h3 className={`font-medium text-slate-900 line-clamp-2 leading-tight ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
            {product.name}
          </h3>
          <p className={`mt-2 font-semibold text-slate-900 ${isCompact ? 'text-sm' : 'text-base sm:text-lg'}`}>
            {formatPrice(displayPrice)}
          </p>
        </div>
      </Card>
    </Link>
  )
}
