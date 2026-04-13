'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { fmtPrice } from '@/lib/format'
import { HeaderWrapper } from './HeaderWrapper'
import { HeaderTopBar } from './HeaderTopBar'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from './ui/sheet'
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, ChevronRight, Home, Phone, Zap, Battery, Sun, Cpu, Thermometer, Activity } from 'lucide-react'

const GROUP_ICONS = {
  'elektrikli-arac-sarj-urunleri': Zap,
  'batarya-depolama': Battery,
  'gunes-enerjisi': Sun,
  'inverterler': Cpu,
  'isi-pompasi-hvac': Thermometer,
  'enerji-yonetimi': Activity,
}

export function HeaderInnerUI(props) {
  const {
    t,
    pathname,
    router,
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
    searchResults = [],
    searchLoading = false,
    searchOpen = false,
    setSearchOpen,
    currency = 'TRY',
    exchangeRates = null,
    navGroups,
    navLinks,
  } = props

  const [megaOpen, setMegaOpen] = React.useState(false)
  const [expandedGroups, setExpandedGroups] = React.useState(new Set())
  const megaTimeoutRef = React.useRef(null)
  const desktopSearchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  const openMega = () => { clearTimeout(megaTimeoutRef.current); setMegaOpen(true) }
  const closeMega = () => { megaTimeoutRef.current = setTimeout(() => setMegaOpen(false), 150) }

  useEffect(() => { setMegaOpen(false) }, [pathname])

  useEffect(() => {
    if (!searchOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchOpen, setSearchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const onMouseDown = (e) => {
      const inDesktop = desktopSearchRef.current?.contains(e.target)
      const inMobile = mobileSearchRef.current?.contains(e.target)
      if (!inDesktop && !inMobile) setSearchOpen(false)
    }
    window.addEventListener('mousedown', onMouseDown)
    return () => window.removeEventListener('mousedown', onMouseDown)
  }, [searchOpen, setSearchOpen])

  const showDropdown = searchOpen && searchQuery.trim().length > 0
  const renderSearchDropdown = (onResultClick) => (
    showDropdown && (
      <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        {searchLoading ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">{t('searching')}</div>
        ) : searchResults.length > 0 ? (
          <>
            <ul className="max-h-72 overflow-y-auto py-1">
              {searchResults.map((product) => (
                <li key={product.id}>
                  <Link
                    href={product.slug ? `/products/${product.slug}` : `/products/${product.id}`}
                    onClick={() => { setSearchOpen(false); onResultClick?.() }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="flex-1 min-w-0 truncate text-sm font-medium text-slate-800">{product.name}</span>
                    {product.price != null && (
                      <span className="shrink-0 text-sm font-semibold text-brand">
                        {fmtPrice(product.price, currency, exchangeRates)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/80">
              <Link
                href={`/products?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => { setSearchOpen(false); onResultClick?.() }}
                className="text-sm font-medium text-brand hover:underline"
              >
                {t('viewAllResults')}
              </Link>
            </div>
          </>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-slate-500">{t('noSearchResults')}</div>
        )}
      </div>
    )
  )

  const toggleGroup = (id) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }


  return (
    <HeaderWrapper>
      <div className="hidden md:block shrink-0">
        <HeaderTopBar />
      </div>
      {/* Ana satır: Logo, Arama, Hesap / Favoriler / Sepet */}
      <div className="hidden md:block bg-white border-b border-slate-100 shrink-0">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="flex items-center h-[68px] gap-5 min-w-0">
            <div className="flex-shrink-0 flex items-center [&_img]:max-h-11 [&_img]:w-auto [&_img]:object-contain">
              <Logo size="md" href="/" />
            </div>
            <div ref={desktopSearchRef} className="flex-1 min-w-0 max-w-2xl relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 text-sm transition-all placeholder:text-slate-400"
                />
              </form>
              {renderSearchDropdown()}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-3 gap-2 text-slate-700 hover:bg-slate-100 hover:text-ink rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="hidden xl:block text-left min-w-0">
                        <p className="text-xs text-slate-500 font-medium leading-tight truncate">{t('myAccount')}</p>
                        <p className="text-sm font-semibold text-ink leading-tight truncate max-w-[72px]">{user.name.split(' ')[0]}</p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={6} className="w-72 p-0 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                    <div className="px-5 pt-5 pb-4 bg-slate-50/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('welcome')}</p>
                      <p className="text-base font-semibold text-ink mt-1 leading-snug">{t('greeting', { name: user.name })}</p>
                    </div>
                    <div className="border-t border-slate-200" />
                    <div className="py-2 px-2">
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/profile">{t('goToAccount')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=orders">{t('viewOrders')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=havale">{t('bankTransferNotify')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=settings">{t('updateInfo')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=points">{t('pointsAndGifts')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/30 focus:text-brand data-[highlighted]:bg-brand-light/30 data-[highlighted]:text-brand">
                        <Link href="/favorites">{t('viewFavorites')}</Link>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t border-slate-200" />
                    <div className="p-2.5">
                      <button
                        type="button"
                        onClick={() => { logout(); router.push('/') }}
                        className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-ink font-medium text-base transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" className="h-10 px-3 gap-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                  <Link href="/login">
                    <User className="w-4 h-4 text-slate-500" />
                    <div className="hidden xl:block text-left">
                      <p className="text-xs text-slate-500 font-medium leading-tight">{t('login')}</p>
                      <p className="text-sm font-semibold leading-tight">{t('orRegister')}</p>
                    </div>
                  </Link>
                </Button>
              )}
              <Link href="/favorites" className="hidden sm:flex h-10 w-10 items-center justify-center text-slate-500 hover:text-brand hover:bg-brand-light/50 rounded-xl transition-colors shrink-0" aria-label={t('favorites')}>
                <Heart className="w-4 h-4" />
              </Link>
              <Button asChild className="h-10 px-3 gap-2 bg-brand hover:bg-brand-hover text-white rounded-xl transition-colors relative shrink-0 shadow-sm">
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <div className="hidden xl:block text-left whitespace-nowrap">
                    <p className="text-xs text-white/90 font-medium leading-tight">{t('cart')}</p>
                    <p className="text-sm font-bold leading-tight">{cartTotalFormatted}</p>
                  </div>
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1.5 bg-white text-brand border border-brand/30 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Ã…Âerit 2: Ana menÃƒÂ¼ Ã¢â‚¬â€œ Anasayfa, ÃƒÅ“rÃƒÂ¼nler, kategori dropdownÃ¢â‚¬â„¢larÃ„Â±, Ã„Â°letiÃ…Å¸im */}
      {/* Nav + Mega Menu */}
      <div className="hidden md:block bg-white border-b border-slate-100 shrink-0 relative" onMouseLeave={closeMega}>
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-0 overflow-hidden" aria-label="Ana menu">
            {/* Anasayfa */}
            <Link
              href="/"
              className={`flex items-center gap-1.5 h-11 px-2 border-b-2 text-sm font-medium transition-colors duration-150 shrink-0 whitespace-nowrap ${pathname === '/' ? 'text-brand border-brand' : 'text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300'}`}
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">{t('navHome')}</span>
            </Link>

            {/* Tüm Ürünler */}
            <Link
              href="/products"
              className={`flex items-center h-11 px-3 border-b-2 text-sm font-semibold transition-colors duration-150 shrink-0 whitespace-nowrap ${pathname === '/products' && !currentCategory ? 'text-brand border-brand' : 'text-slate-700 border-transparent hover:text-slate-900 hover:border-slate-300'}`}
            >
              {t('navProducts')}
            </Link>

            {/* Kategoriler — mega menu trigger */}
            <button
              type="button"
              onMouseEnter={openMega}
              className={`h-11 flex items-center gap-1 px-3 border-b-2 text-sm font-semibold transition-colors duration-150 shrink-0 whitespace-nowrap outline-none ${megaOpen ? 'text-brand border-brand' : 'text-slate-700 border-transparent hover:text-slate-900 hover:border-slate-300'}`}
            >
              {t('categories')}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* İletişim */}
            <Link
              href="/contact"
              className={`flex items-center gap-1.5 h-11 px-3 border-b-2 text-sm font-medium transition-colors duration-150 shrink-0 whitespace-nowrap ${pathname === '/contact' ? 'text-brand border-brand' : 'text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300'}`}
            >
              <Phone className="w-4 h-4" />
              {t('navContact')}
            </Link>
          </nav>
        </div>

        {/* Mega Menu Panel */}
        {megaOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-100 z-50"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="grid grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-8">
                {navGroups.map((group) => {
                  const Icon = GROUP_ICONS[group.id] || Menu
                  const isGroupActive = pathname.startsWith(`/category/${group.id}`)
                  return (
                    <div key={group.id}>
                      <Link
                        href={group.href}
                        onClick={closeMega}
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 transition-colors ${isGroupActive ? 'text-brand' : 'text-slate-800 hover:text-brand'}`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-brand" />
                        {t(group.labelKey)}
                      </Link>
                      <ul className="space-y-1.5">
                        {group.categories.map((cat) => {
                          const isActive = pathname === '/products' && currentCategory === cat.value
                          return (
                            <li key={cat.value}>
                              <Link
                                href={`/products?category=${encodeURIComponent(cat.value)}`}
                                onClick={closeMega}
                                className={`text-sm leading-snug block py-0.5 transition-colors ${isActive ? 'text-brand font-semibold' : 'text-slate-600 hover:text-brand'}`}
                              >
                                {t(cat.labelKey)}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                      <Link
                        href={group.href}
                        onClick={closeMega}
                        className="mt-3 text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        {t('viewAll', { category: '' })}
                        <ChevronDown className="w-3 h-3 -rotate-90" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobil: menÃƒÂ¼ + logo + sepet (safe area wrapper'dan gelir) */}
      <div className="md:hidden flex items-center justify-between min-h-[56px] h-14 px-4 gap-2 bg-white border-b border-slate-200/70 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="min-h-[44px] min-w-[44px] h-11 w-11 shrink-0 rounded-xl touch-manipulation text-slate-700 hover:bg-slate-100 hover:text-ink transition-colors"
          aria-label={t('openMenu')}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-center min-w-0 py-1.5 [&_img]:max-h-9 [&_img]:w-auto [&_img]:object-contain">
          <Logo size="sm" href="/" />
        </div>
        <Link href="/cart" className="relative flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center shrink-0 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors touch-manipulation" aria-label={t('cartAria')}>
          <ShoppingCart className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <Badge className="absolute top-1 right-1 min-h-5 min-w-5 px-1.5 bg-brand text-white rounded-full text-[11px] font-bold flex items-center justify-center border-0 shadow-sm">
              {cartItemsCount}
            </Badge>
          )}
        </Link>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[min(300px,100vw-1rem)] sm:w-[min(320px,100vw-2rem)] p-0 flex flex-col max-h-[100dvh] border-0 border-r border-slate-200 overflow-hidden bg-slate-50 rounded-r-2xl shadow-xl pt-safe"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetTitle className="sr-only">{t('mobileMenu')}</SheetTitle>

          {/* BaÃ…Å¸lÃ„Â±k: sade, tek satÃ„Â±r */}
          <div className="shrink-0 px-4 pt-4 pb-3">
            <Logo size="md" href="/" onClick={() => setMobileMenuOpen(false)} className="[&_img]:max-h-10" />
          </div>

          {/* Arama: tek kutu, ikon iÃƒÂ§eride */}
          <div ref={mobileSearchRef} className="shrink-0 px-4 pb-4 relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                type="search"
                placeholder={t('searchPlaceholderMobile')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-xl border-slate-200 bg-white text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300 touch-manipulation"
                autoComplete="off"
              />
            </form>
            {renderSearchDropdown(() => setMobileMenuOpen(false))}
          </div>

          <nav className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 space-y-6">
            {!isAuthenticated && (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors touch-manipulation"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center h-11 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors touch-manipulation"
                >
                  {t('orRegister')}
                </Link>
              </div>
            )}

            {/* Ana menÃƒÂ¼ */}
            <div className="space-y-0.5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${pathname === '/' ? 'bg-white text-brand shadow-sm border border-slate-200/80' : 'text-slate-700 hover:bg-white/80'}`}>
                <Home className={`w-5 h-5 shrink-0 ${pathname === '/' ? 'text-brand' : 'text-slate-400'}`} />
                {t('navHome')}
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${pathname === '/products' && !currentCategory ? 'bg-white text-brand shadow-sm border border-slate-200/80' : 'text-slate-700 hover:bg-white/80'}`}>
                <ShoppingCart className={`w-5 h-5 shrink-0 ${pathname === '/products' && !currentCategory ? 'text-brand' : 'text-slate-400'}`} />
                {t('navProducts')}
              </Link>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${pathname === '/favorites' ? 'bg-white text-brand shadow-sm border border-slate-200/80' : 'text-slate-700 hover:bg-white/80'}`}>
                <Heart className={`w-5 h-5 shrink-0 ${pathname === '/favorites' ? 'text-brand' : 'text-slate-400'}`} />
                {t('favorites')}
              </Link>
            </div>

            {/* Kategoriler */}
            <div>
              <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('categories')}</p>
              <div className="space-y-1">
                {navGroups.map((group) => {
                  const Icon = GROUP_ICONS[group.id] || Menu
                  const isExpanded = expandedGroups.has(group.id)
                  const isGroupActive = pathname.startsWith(`/category/${group.id}`)

                  return (
                    <div key={group.id} className="rounded-xl overflow-hidden bg-white border border-slate-200/80">
                      <div className="flex items-stretch">
                        <Link
                          href={group.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex-1 flex items-center gap-3 min-h-[48px] px-3 py-3 text-sm font-medium min-w-0 touch-manipulation ${isGroupActive ? 'text-brand' : 'text-slate-700'}`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 ${isGroupActive ? 'text-brand' : 'text-slate-400'}`} />
                          <span className="leading-snug">{t(group.labelKey)}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleGroup(group.id) }}
                          className="min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors touch-manipulation"
                          aria-label={isExpanded ? t('collapse') : t('expand')}
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 px-3 py-2 space-y-0.5">
                          {group.categories.map((cat) => {
                            const isSubActive = pathname === '/products' && currentCategory === cat.value
                            const label = t(cat.labelKey)
                            return (
                              <Link
                                key={cat.value}
                                href={`/products?category=${encodeURIComponent(cat.value)}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2 min-h-[40px] px-2 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation ${isSubActive ? 'text-brand bg-white' : 'text-slate-600 hover:text-brand hover:bg-white/80'}`}
                              >
                                <ChevronRight className="w-4 h-4 shrink-0 text-slate-300" />
                                <span className="leading-snug">{label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Ã„Â°letiÃ…Å¸im */}
            <div className="pt-2">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation ${pathname === '/contact' ? 'bg-white text-brand shadow-sm border border-slate-200/80' : 'text-slate-700 hover:bg-white/80'}`}>
                <Phone className={`w-5 h-5 shrink-0 ${pathname === '/contact' ? 'text-brand' : 'text-slate-400'}`} />
                {t('navContact')}
              </Link>
            </div>
          </nav>

          <div className="shrink-0 py-3 px-4 border-t border-slate-200 bg-white/80">
            <p className="text-xs text-center text-slate-400">
              &copy; {new Date().getFullYear()} voltekno
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </HeaderWrapper>
  )
}

