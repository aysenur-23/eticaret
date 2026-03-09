'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store/useCartStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useCurrencyStore } from '@/lib/store/useCurrencyStore'
import { useExchangeRates } from '@/lib/useExchangeRates'
import { fmtPrice } from '@/lib/format'
import { CATEGORY_GROUPS, getCategoryKey } from '@/lib/categories'
import { useCategoriesWithProducts } from '@/components/CategoriesWithProductsProvider'
import { HeaderInnerUI } from './HeaderInnerUI'

const SEARCH_DEBOUNCE_MS = 280
const LIVE_SEARCH_MIN_LENGTH = 1
const LIVE_SEARCH_LIMIT = 8

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
  const categoriesWithProducts = useCategoriesWithProducts()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    setCurrentCategory(params.get('category'))
  }, [pathname])
  const cartItems = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.getTotalPrice())
  const cartItemsCount = React.useMemo(() => cartItems.reduce((t, i) => t + i.quantity, 0), [cartItems])
  const currency = useCurrencyStore((s) => s.currency)
  const { rates } = useExchangeRates()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; price?: number }>>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchAbortRef = useRef<AbortController | null>(null)
  const cartTotalFormatted = fmtPrice(cartTotal, currency, rates?.rates ?? null)

  const navGroups = useMemo(() => buildNavGroups(categoriesWithProducts), [categoriesWithProducts])
  const navLinks = [
    { labelKey: 'navHome', href: '/' },
    { labelKey: 'navProducts', href: '/products' },
    { labelKey: 'navContact', href: '/contact' },
  ]

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < LIVE_SEARCH_MIN_LENGTH) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }
    const t = setTimeout(async () => {
      searchAbortRef.current?.abort()
      searchAbortRef.current = new AbortController()
      setSearchLoading(true)
      setSearchOpen(true)
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(q)}`,
          { signal: searchAbortRef.current.signal }
        )
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        setSearchResults(list.slice(0, LIVE_SEARCH_LIMIT))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchQuery])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
    }
  }, [searchQuery, router])

  return React.createElement(HeaderInnerUI, {
    t,
    pathname,
    router,
    currentCategory,
    mobileMenuOpen,
    setMobileMenuOpen,
    cartItemsCount: mounted ? cartItemsCount : 0,
    cartTotalFormatted: mounted ? cartTotalFormatted : fmtPrice(0, currency, null),
    currency,
    exchangeRates: rates?.rates ?? null,
    user: mounted ? user : null,
    isAuthenticated: mounted ? isAuthenticated : false,
    logout,
    searchQuery,
    setSearchQuery,
    handleSearch,
    searchResults,
    searchLoading,
    searchOpen,
    setSearchOpen,
    navGroups,
    navLinks,
  })
}
