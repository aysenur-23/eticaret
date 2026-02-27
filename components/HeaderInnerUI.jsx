'use client'

import React from 'react'
import Link from 'next/link'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from './ui/sheet'
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, ChevronRight, Home, Phone, Zap, Battery, Sun, Cpu, Flame, Settings2 } from 'lucide-react'

const GROUP_ICONS = {
  'ev-sarj': Zap,
  'enerji-depolama': Battery,
  'gunes-enerjisi': Sun,
  'inverterler': Cpu,
  'isi-pompalari': Flame,
  'akilli-enerji': Settings2,
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
    navGroups,
    navLinks,
  } = props

  const [openMenu, setOpenMenu] = React.useState(null)
  const [expandedGroups, setExpandedGroups] = React.useState(new Set())
  const timeoutRef = React.useRef(null)

  const toggleGroup = (id) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleMouseEnter = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenMenu(key)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, 150)
  }

  const menuPanelClass = 'min-w-[240px] max-w-[320px] max-h-[85vh] overflow-y-auto rounded-2xl border border-palette/40 bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] p-1 animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-200'
  const menuHeaderClass = 'hidden'
  const menuGridClass = () => 'flex flex-col gap-0.5'

  const navDropdown = (labelKey, items, categoryHref, groupKey) => {
    const isGroupPageActive = categoryHref && pathname.startsWith(categoryHref)
    return (
      <div
        key={groupKey}
        className="relative"
        onMouseEnter={() => handleMouseEnter(labelKey)}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenu open={openMenu === labelKey} onOpenChange={(open) => !open && setOpenMenu(null)}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`h-9 flex items-center gap-1 px-2.5 rounded-lg text-sm font-medium transition-all shrink-0 outline-none whitespace-nowrap ${isGroupPageActive ? 'text-brand bg-brand-light' : 'text-ink hover:text-brand hover:bg-white/80 data-[state=open]:text-brand data-[state=open]:bg-white data-[state=open]:shadow-sm'}`}
            >
              {t(labelKey)}
              <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-300 data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={1}
            className={menuPanelClass}
            onMouseEnter={() => handleMouseEnter(labelKey)}
            onMouseLeave={handleMouseLeave}
          >
            <div className={menuGridClass()}>
              {items.map((item) => {
                const href = `/products?category=${encodeURIComponent(item.value)}`
                const isActive = pathname === '/products' && currentCategory === item.value
                return (
                  <DropdownMenuItem key={item.value} asChild className="rounded-xl border-0 m-0 focus:bg-transparent data-[highlighted]:bg-transparent outline-none p-0">
                    <Link
                      href={href}
                      onClick={() => setOpenMenu(null)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium transition-all rounded-xl mx-1 my-0.5 ${isActive
                        ? 'text-brand bg-brand-light/50 font-bold'
                        : 'text-ink/80 hover:text-brand hover:bg-surface-elevated hover:shadow-sm'
                        }`}
                    >
                      <span className="flex-1 truncate">{t(item.labelKey)}</span>
                      {!isActive && <ChevronDown className="w-3.5 h-3.5 opacity-0 -rotate-90 group-hover:opacity-40 transition-all group-hover:translate-x-0.5" />}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </div>
            <div className="px-5 py-3.5 border-t border-palette/30 bg-brand-light/20 rounded-b-2xl mt-1">
              <Link
                href={categoryHref || '/products'}
                onClick={() => setOpenMenu(null)}
                className="text-sm font-black text-brand hover:underline flex items-center gap-2 tracking-tight uppercase"
              >
                Tüm {t(labelKey)}
                <span className="text-base">→</span>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <HeaderWrapper>
      <div className="hidden md:block border-b border-palette/60">
        <HeaderTopBar />
      </div>
      {/* Şerit 1: Logo, Arama, Hesap / Favoriler / Sepet */}
      <div className="hidden md:block bg-surface-elevated border-b border-palette overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="flex items-center h-14 gap-4 min-w-0">
            <div className="flex-shrink-0 flex items-center h-10 [&_img]:max-h-10 [&_img]:w-auto [&_img]:object-contain">
              <Logo size="sm" href="/" />
            </div>
            <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-xl mx-auto relative">
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-full min-w-0 h-10 pl-4 pr-10 rounded-lg border border-palette focus:border-brand focus:ring-1 focus:ring-brand/20 text-sm transition-all bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-ink-muted hover:text-brand rounded transition-colors"
                aria-label={t('searchPlaceholder')}
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center gap-1 shrink-0">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 px-2.5 gap-2 text-ink hover:bg-surface rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-ink-muted" />
                      </div>
                      <div className="hidden xl:block text-left min-w-0">
                        <p className="text-xs text-ink-muted font-medium leading-tight truncate">{t('myAccount')}</p>
                        <p className="text-sm font-semibold leading-tight truncate max-w-[72px]">{user.name.split(' ')[0]}</p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={6} className="w-72 p-0 rounded-xl overflow-hidden border border-palette/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
                    <div className="px-5 pt-5 pb-4 bg-surface/50">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{t('welcome')}</p>
                      <p className="text-base font-semibold text-ink mt-1 leading-snug">Sn. {user.name}</p>
                    </div>
                    <div className="border-t border-palette/60" />
                    <div className="py-2 px-2">
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/profile">{t('goToAccount')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=orders">{t('viewOrders')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=havale">{t('bankTransferNotify')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=settings">{t('updateInfo')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/profile?tab=points">{t('pointsAndGifts')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg h-11 px-4 mx-1 cursor-pointer text-ink font-normal text-base focus:bg-brand-light/25 focus:text-brand data-[highlighted]:bg-brand-light/25 data-[highlighted]:text-brand">
                        <Link href="/favorites">{t('viewFavorites')}</Link>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t border-palette/60" />
                    <div className="p-2.5">
                      <button
                        type="button"
                        onClick={() => { logout(); router.push('/') }}
                        className="w-full h-11 rounded-lg bg-surface hover:bg-palette/20 text-ink font-medium text-base transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" className="h-10 px-2.5 gap-2 text-ink hover:bg-surface rounded-lg">
                  <Link href="/login">
                    <User className="w-4 h-4 text-ink-muted" />
                    <div className="hidden xl:block text-left">
                      <p className="text-xs text-ink-muted font-medium leading-tight">{t('login')}</p>
                      <p className="text-sm font-semibold leading-tight">{t('orRegister')}</p>
                    </div>
                  </Link>
                </Button>
              )}
              <Link href="/favorites" className="hidden sm:flex h-10 w-10 items-center justify-center text-ink-muted hover:text-brand hover:bg-brand-light rounded-lg transition-colors shrink-0" aria-label={t('favorites')}>
                <Heart className="w-4 h-4" />
              </Link>
              <Button asChild className="h-10 px-2.5 gap-2 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg transition-colors relative shrink-0">
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <div className="hidden xl:block text-left whitespace-nowrap">
                    <p className="text-xs text-white/80 font-medium leading-tight">{t('cart')}</p>
                    <p className="text-sm font-bold leading-tight">{cartTotalFormatted}</p>
                  </div>
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Şerit 2: Ana menü – Anasayfa, Ürünler, kategori dropdown’ları, İletişim */}
      <div className="hidden md:block bg-gradient-to-b from-surface to-surface-elevated/80 border-b border-palette/80 shadow-sm overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 min-w-0">
          <nav className="flex flex-nowrap items-center gap-0.5 min-w-0 py-1.5 min-h-11" aria-label="Ana menü">
            <Link
              href="/"
              className={`flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${pathname === '/' ? 'text-brand bg-brand-light' : 'text-ink hover:text-brand hover:bg-white/60'}`}
            >
              <Home className="w-4 h-4" />
              {t('navHome')}
            </Link>
            <Link
              href="/products"
              className={`flex items-center h-9 px-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${pathname === '/products' && !currentCategory ? 'text-brand bg-brand-light' : 'text-ink hover:text-brand hover:bg-white/60'}`}
            >
              {t('navProducts')}
            </Link>
            {navGroups.map((g) => navDropdown(g.labelKey, g.categories, g.href, g.id))}
            <Link
              href="/contact"
              className={`flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 ml-auto whitespace-nowrap ${pathname === '/contact' ? 'text-brand bg-brand-light' : 'text-ink hover:text-brand hover:bg-white/60'}`}
            >
              <Phone className="w-4 h-4" />
              {t('navContact')}
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobil üst bar: menü + logo + sepet */}
      <div className="md:hidden flex items-center justify-between min-h-[52px] h-14 px-3 sm:px-4 gap-1 bg-white border-b border-slate-200/80 shadow-sm pt-safe">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="min-h-[44px] min-w-[44px] h-11 w-11 shrink-0 rounded-xl touch-manipulation text-ink hover:bg-slate-100"
          aria-label={t('openMenu')}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex justify-center min-w-0 py-1.5 [&_img]:max-h-9 [&_img]:w-auto [&_img]:object-contain">
          <Logo size="sm" href="/" />
        </div>
        <Link href="/cart" className="relative flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center shrink-0 rounded-xl hover:bg-slate-100 text-ink transition-colors touch-manipulation" aria-label={t('cartAria')}>
          <ShoppingCart className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <Badge className="absolute top-1 right-1 min-h-[18px] min-w-[18px] px-1.5 bg-brand text-white rounded-full text-[11px] font-bold flex items-center justify-center border-0">
              {cartItemsCount}
            </Badge>
          )}
        </Link>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[min(300px,100vw-1rem)] sm:w-[min(320px,100vw-2rem)] p-0 flex flex-col max-h-[100dvh] border-0 overflow-hidden bg-white rounded-r-2xl shadow-xl pt-safe"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetTitle className="sr-only">{t('mobileMenu')}</SheetTitle>

          {/* Mobil sidebar başlık */}
          <div className="shrink-0 flex items-center justify-between px-4 py-4 bg-slate-900 text-white rounded-br-2xl">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 min-h-[44px]">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <Logo size="sm" href="/" className="text-white brightness-0 invert [&_img]:max-h-6" />
              </div>
              <div>
                <p className="text-base font-bold tracking-tight text-white">REVISION</p>
                <p className="text-[10px] font-medium text-white/60 uppercase tracking-wider">{t('menu')}</p>
              </div>
            </Link>
          </div>

          {/* Arama */}
          <form onSubmit={handleSearch} className="shrink-0 px-3 py-3 border-b border-slate-200 bg-slate-50/80">
            <div className="flex gap-2 min-w-0">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholderMobile')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 h-11 rounded-xl border-slate-200 bg-white text-sm placeholder:text-slate-400 focus-visible:ring-brand/30 touch-manipulation"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0 bg-brand hover:bg-brand-hover rounded-xl text-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <nav className="flex flex-col py-2 px-2 gap-0.5 overflow-y-auto flex-1 min-h-0 overscroll-contain">
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 mb-3 px-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] font-semibold text-sm text-brand rounded-xl border-2 border-brand/30 bg-white hover:bg-brand-light transition-colors touch-manipulation"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] font-semibold text-sm text-white rounded-xl bg-brand hover:bg-brand-hover transition-colors touch-manipulation"
                >
                  {t('orRegister')}
                </Link>
              </div>
            )}

            <div className="px-2 space-y-0.5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 min-h-[48px] px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation ${pathname === '/' ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-slate-100'}`}>
                <Home className={`w-5 h-5 shrink-0 ${pathname === '/' ? 'text-brand' : 'text-slate-400'}`} />
                {t('navHome')}
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 min-h-[48px] px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation ${pathname === '/products' && !currentCategory ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-slate-100'}`}>
                <ShoppingCart className={`w-5 h-5 shrink-0 ${pathname === '/products' && !currentCategory ? 'text-brand' : 'text-slate-400'}`} />
                {t('navProducts')}
              </Link>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 min-h-[48px] px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation ${pathname === '/favorites' ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-slate-100'}`}>
                <Heart className={`w-5 h-5 shrink-0 ${pathname === '/favorites' ? 'text-brand' : 'text-slate-400'}`} />
                {t('favorites')}
              </Link>
            </div>

            <div className="h-px bg-slate-200 my-3 mx-3" />
            <p className="px-3.5 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('categories')}</p>

            <div className="px-2 space-y-1">
              {navGroups.map((group) => {
                const Icon = GROUP_ICONS[group.id] || Menu
                const isExpanded = expandedGroups.has(group.id)
                const isGroupActive = pathname.startsWith(`/category/${group.id}`)

                return (
                  <div key={group.id}>
                    <div className={`flex items-stretch rounded-xl overflow-hidden ${isGroupActive ? 'bg-brand/10 ring-1 ring-brand/20' : 'bg-transparent'}`}>
                      <Link
                        href={group.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 flex items-center gap-3 min-h-[48px] px-3.5 py-3 text-sm font-bold min-w-0 touch-manipulation"
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isGroupActive ? 'text-brand' : 'text-slate-400'}`} />
                        <span className="truncate">{t(group.labelKey)}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleGroup(group.id) }}
                        className="min-w-[44px] flex items-center justify-center transition-colors border-l border-slate-200/60 touch-manipulation"
                        aria-label={isExpanded ? 'Daralt' : 'Genişlet'}
                      >
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-0.5 pb-2">
                        {group.categories.map((cat) => {
                          const isSubActive = pathname === '/products' && currentCategory === cat.value
                          const label = t(cat.labelKey)
                          return (
                            <Link
                              key={cat.value}
                              href={`/products?category=${encodeURIComponent(cat.value)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2 min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${isSubActive ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-slate-100 hover:text-brand'}`}
                            >
                              <ChevronRight className={`w-4 h-4 shrink-0 ${isSubActive ? 'text-brand' : 'text-slate-300'}`} />
                              <span className="truncate">{label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="h-px bg-slate-200 my-3 mx-3" />
            <div className="px-2">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 min-h-[48px] px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors touch-manipulation ${pathname === '/contact' ? 'bg-brand/10 text-brand' : 'text-ink hover:bg-slate-100'}`}>
                <Phone className={`w-5 h-5 shrink-0 ${pathname === '/contact' ? 'text-brand' : 'text-slate-400'}`} />
                {t('navContact')}
              </Link>
            </div>
          </nav>

          <div className="shrink-0 py-3 px-4 border-t border-slate-200 bg-slate-50/50 rounded-tr-2xl">
            <p className="text-[10px] text-center text-slate-500 font-medium">
              Revision Enerji Sistemleri · &copy; {new Date().getFullYear()}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </HeaderWrapper>
  )
}
