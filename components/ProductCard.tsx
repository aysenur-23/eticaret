'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import { fmtPrice } from '@/lib/format'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { AddToCartButton } from '@/components/AddToCartButton'
import { FavoriteButton } from '@/components/FavoriteButton'
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
  /** Eski fiyat (indirimli ürünlerde) */
  oldPrice?: number
  /** İndirim yüzdesi (örn. 20) */
  discount?: number
  /** Rozetler: "Yeni", "%20" vb. - en fazla 1-2 gösterilir (Robotistan tarzı) */
  badges?: string[]
  sku?: string
  rating?: number
  stock?: number
  isVariantProduct?: boolean
  selectedVariant?: ProductVariant
  /** compact: ana sayfa grid, full: ürün listesi */
  variant?: 'compact' | 'full'
  className?: string
}

export function ProductCard({
  product,
  oldPrice,
  discount,
  sku,
  badges = [],
  stock,
  isVariantProduct,
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
  // Placeholder veya eksik görselde kırmızı yerine nötr boş alan göster (diğer boşlarla aynı)
  const hasRealImage = Boolean(
    product.image &&
    !imageError &&
    !product.image.includes('placeholder')
  )
  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const isServiceProduct = displayPrice === 0
  const formatPrice = (amount: number) => fmtPrice(amount, currency, rates?.rates ?? null)
  // Robotistan: en fazla 1-2 rozet (indirim + bir metin)
  const showDiscountBadge = discount != null && discount > 0
  const textBadges = badges.slice(0, showDiscountBadge ? 1 : 2)

  return (
    <Card
      className={`group bg-surface-elevated rounded-lg border border-palette shadow-sm hover:shadow-md hover:border-brand/30 transition-all duration-200 overflow-hidden flex flex-col min-w-0 touch-manipulation ${className}`}
    >
      {/* Görsel alan */}
      <div className="relative aspect-square overflow-hidden border-b border-palette/50 bg-white">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <div className={`absolute inset-0 flex items-center justify-center ${hasRealImage ? 'bg-white' : 'bg-slate-100'} ${isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}>
            {hasRealImage ? (
              <Image
                src={product.image!}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <Package className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300 group-hover:scale-105 transition-transform duration-300" />
            )}
          </div>
        </Link>

        {/* Rozetler – sol üst, kartın içinde */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-3rem)] min-w-0">
          {showDiscountBadge && (
            <Badge className="bg-brand text-brand-foreground border-none text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm shrink-0 max-w-full overflow-hidden">
              <span className="truncate block">%{discount}</span>
            </Badge>
          )}
          {textBadges.map((tag) => (
            <Badge
              key={tag}
              className="bg-brand text-brand-foreground border-none text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm max-w-full min-w-0 overflow-hidden"
            >
              <span className="truncate block">{tag}</span>
            </Badge>
          ))}
        </div>

        {/* Favoriye ekle – sağ üst köşede kalp */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton productId={product.id} className="!p-1.5 sm:!p-2" />
        </div>
      </div>

      {/* Alt blok – sakin, kısa: marka (varsa), tek satır başlık, fiyat, kompakt buton (genişlemez) */}
      <div className={`flex flex-col flex-1 min-h-0 justify-end ${isCompact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-2.5'}`}>
        {product.brand && (
          <p className="text-[10px] sm:text-xs text-ink-muted mb-0.5 line-clamp-1">{product.brand}</p>
        )}
        <Link href={`/products/${product.id}`} className="block group/title mb-1 min-h-[2.5em]">
          <h3
            className={`font-medium text-ink line-clamp-2 group-hover/title:text-brand transition-colors leading-tight ${isCompact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'}`}
          >
            {product.name}
          </h3>
        </Link>
        {sku && (
          <p className="text-[10px] text-ink-muted/70 font-medium mb-1.5 px-1 bg-slate-50 w-fit rounded border border-slate-100 uppercase tracking-tighter">
            {sku}
          </p>
        )}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {!isServiceProduct && oldPrice != null && oldPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-ink-muted line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
          <span className={`font-semibold text-ink ${isCompact ? 'text-xs sm:text-sm' : 'text-sm'}`}>
            {isServiceProduct ? 'Teklif al' : formatPrice(displayPrice)}
          </span>
          {!isServiceProduct && isVariantProduct && (
            <span className="text-[10px] text-ink-muted">'den itibaren</span>
          )}
        </div>
        <div className="w-full min-w-0">
          {isServiceProduct ? (
            <Link
              href="/contact"
              className={`flex w-full items-center justify-center rounded-md font-medium bg-brand hover:bg-brand-hover text-brand-foreground touch-manipulation ${isCompact ? 'py-2 text-[10px] sm:text-[11px] min-h-[38px]' : 'py-2.5 text-[11px] sm:text-xs min-h-[44px]'}`}
            >
              Teklif al
            </Link>
          ) : (
            <AddToCartButton
              product={product}
              selectedVariant={selectedVariant}
              className={`w-full rounded-md font-medium bg-brand hover:bg-brand-hover text-brand-foreground justify-center touch-manipulation max-w-full ${isCompact ? 'py-2 text-[10px] sm:text-[11px] min-h-[38px]' : 'py-2.5 text-[11px] sm:text-xs min-h-[44px]'}`}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
