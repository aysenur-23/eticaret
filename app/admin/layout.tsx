'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Package,
  ShoppingCart,
  Layers,
  ArrowLeft,
  BarChart3,
  Menu,
  X,
  FileText,
  Percent,
  FolderOpen,
  LogOut,
} from 'lucide-react'

const navSections = [
  {
    title: 'Genel',
    items: [
      { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    ],
  },
  {
    title: 'Satış & Siparişler',
    items: [
      { href: '/admin/orders', label: 'Siparişler', icon: ShoppingCart },
      { href: '/admin/ges-teklifler', label: 'GES Teklif İstekleri', icon: FileText },
      { href: '/admin/indirimler', label: 'İndirimler', icon: Percent },
    ],
  },
  {
    title: 'Katalog & Stok',
    items: [
      { href: '/admin/products', label: 'Ürünler', icon: Package },
      { href: '/admin/katalog', label: 'Katalog / Ürün Düzenleme', icon: FolderOpen },
      { href: '/admin/urunler', label: 'Stok Yönetimi', icon: Layers },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const { getAuth } = await import('@/lib/firebase/config')
      const { signOut } = await import('firebase/auth')
      const auth = getAuth()
      await signOut(auth)
    } catch {}
    localStorage.removeItem('admin_uid')
    localStorage.removeItem('admin_token')
    router.push('/admin/auth')
  }

  if (pathname === '/admin/auth') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50/90 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-200/80">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-800">Admin Panel</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname?.startsWith(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 opacity-80" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200/80 space-y-1">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Siteye Dön
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} aria-label="Menüyü aç">
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-semibold text-slate-800">Admin Panel</span>
        <div className="w-10" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Menü</span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} aria-label="Kapat">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive =
                        item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                              isActive ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-slate-200 space-y-1">
              <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                <Link href="/" onClick={() => setSidebarOpen(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Siteye Dön
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setSidebarOpen(false); handleLogout() }} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 lg:pl-64 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
