'use client'

import React, { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store/useCartStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { fmtPrice } from '@/lib/format'
import { CATEGORY_GROUPS, getCategoryKey } from '@/lib/categories'
import { useCategoriesWithProducts } from '@/components/CategoriesWithProductsProvider'
import { HeaderInnerUI } from './HeaderInnerUI'

/** Header ve sidebar aynı kaynaktan (CATEGORY_GROUPS) beslenir; ürünü olmayan alt kategoriler gösterilmez. */
function buildNavGroups(categoriesWithProducts: Set<string> | null) {
  const useFilter = categoriesWithProducts != null && categoriesWithProducts.size > 0
  const groups = CATEGORY_GROUPS.map((group) => {
    const values = useFilter
      ? group.categoryValues.filter((v) => categoriesWithProducts!.has(v))
      : group.categoryValues
    return {
      id: group.id,
      labelKey: group.labelKey,
      href: `/category/${group.id}`,
      categories: values.map((value) => ({
        value,
        labelKey: getCategoryKey(value) ?? 'categorySmartEnergyAccessories',
      })),
    }
  }).filter((g) => g.categories.length > 0)
  return groups.length > 0 ? groups : CATEGORY_GROUPS.map((group) => ({
    id: group.id,
    labelKey: group.labelKey,
    href: `/category/${group.id}`,
    categories: group.categoryValues.map((value) => ({
      value,
      labelKey: getCategoryKey(value) ?? 'categorySmartEnergyAccessories',
    })),
  }))
}

export function HeaderInnerBody() {
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')
  const categoriesWithProducts = useCategoriesWithProducts()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.getTotalPrice())
  const cartItemsCount = React.useMemo(() => cartItems.reduce((t, i) => t + i.quantity, 0), [cartItems])
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const cartTotalFormatted = fmtPrice(cartTotal, currency, rates?.rates ?? null)

  const navGroups = useMemo(() => buildNavGroups(categoriesWithProducts), [categoriesWithProducts])
  const navLinks = [
    { labelKey: 'navHome', href: '/' },
    { labelKey: 'navProducts', href: '/products' },
    { labelKey: 'navContact', href: '/contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return React.createElement(HeaderInnerUI, {
    t,
    pathname,
    router,
    searchParams,
    currentCategory,
    mobileMenuOpen,
    setMobileMenuOpen,
    cartItemsCount,
    cartTotalFormatted,
    user,
    isAuthenticated,
    logout,
    searchQuery,
    setSearchQuery,
    handleSearch,
    navGroups,
    navLinks,
  })
}
