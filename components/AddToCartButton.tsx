'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/toast'

export interface ProductVariant {
  key: string
  label: string
  price: number
}

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    description?: string
    price: number
    image?: string
    category?: string
  }
  /** Ürün varyantı (örn. 1 kg). Sepette ayrı kalem olur. */
  selectedVariant?: ProductVariant
  className?: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  /** false ise (ürün kartında) sepette olsa bile hep "SEPETE EKLE" butonu gösterilir; tıklanınca +1 eklenir. */
  showQuantitySelector?: boolean
}

export function AddToCartButton({
  product,
  selectedVariant,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false,
  showQuantitySelector = true,
}: AddToCartButtonProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore()
  const { addToast } = useToast()
  const [mounted, setMounted] = useState(false)

  const cartId = selectedVariant ? `${product.id}-${selectedVariant.key}` : product.id
  const displayName = selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name
  const price = selectedVariant ? selectedVariant.price : product.price

  useEffect(() => {
    setMounted(true)
  }, [])

  const quantity = mounted ? getItemQuantity(cartId) : 0
  const isInCart = mounted && quantity > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    if (selectedVariant && !selectedVariant.key) return

    try {
      addItem({
        id: cartId,
        name: displayName,
        description: product.description,
        price,
        image: product.image,
        category: product.category,
      })
      addToast({
        type: 'success',
        title: 'Sepete Eklendi',
        description: `${displayName} sepete eklendi.`,
      })
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      addToast({
        type: 'error',
        title: 'Hata',
        description: 'Ürün sepete eklenirken bir hata oluştu.',
      })
    }
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(cartId, quantity + 1)
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      updateQuantity(cartId, quantity - 1)
    } else {
      updateQuantity(cartId, 0)
      addToast({
        type: 'success',
        title: 'Sepetten Kaldırıldı',
        description: `${displayName} sepetten kaldırıldı.`,
      })
    }
  }

  if (isInCart && showQuantitySelector) {
    const isSm = size === 'sm'
    const isLg = size === 'lg'
    const iconClass = isLg ? 'w-4 h-4' : isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'
    return (
      <div
        className={`flex items-center w-full max-w-full rounded-md overflow-hidden bg-brand hover:bg-brand-hover transition-colors ${className}`}
      >
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled}
          className="flex items-center justify-center shrink-0 w-9 sm:w-10 h-full min-h-0 text-brand-foreground hover:bg-white/15 active:bg-white/20 touch-manipulation min-w-[36px]"
          aria-label="Miktarı azalt"
        >
          <Minus className={iconClass} />
        </button>
        <span className="flex-1 flex items-center justify-center min-w-0 font-semibold text-brand-foreground text-sm tabular-nums bg-white/15 h-full min-h-0">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled}
          className="flex items-center justify-center shrink-0 w-9 sm:w-10 h-full min-h-0 text-brand-foreground hover:bg-white/15 active:bg-white/20 touch-manipulation min-w-[36px]"
          aria-label="Miktarı artır"
        >
          <Plus className={iconClass} />
        </button>
      </div>
    )
  }

  const handleClick = isInCart && !showQuantitySelector ? handleIncrease : handleAddToCart

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`${variant === 'default' ? 'bg-brand hover:bg-brand-hover' : ''} ${className}`}
      disabled={disabled}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Sepete Ekle
    </Button>
  )
}

