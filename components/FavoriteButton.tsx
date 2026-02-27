'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getFavorites, addFavorite, removeFavorite } from '@/lib/firebase/firestore'

interface FavoriteButtonProps {
  productId: string
  className?: string
}

export function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { addToast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const checkFavoriteStatus = useCallback(async () => {
    if (!user?.id) return
    try {
      const list = await getFavorites(user.id)
      setIsFavorite(list.some((f) => f.productId === productId))
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }, [user?.id, productId])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      checkFavoriteStatus()
    } else {
      setIsFavorite(false)
    }
  }, [isAuthenticated, user?.id, productId, checkFavoriteStatus])

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      setShowLoginDialog(true)
      return
    }
    if (!user?.id) return

    setLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(user.id, productId)
        setIsFavorite(false)
        addToast({ type: 'success', title: 'Favorilerden Kaldırıldı', description: 'Ürün favorilerinizden kaldırıldı.' })
      } else {
        await addFavorite(user.id, productId)
        setIsFavorite(true)
        addToast({ type: 'success', title: 'Favorilere Eklendi', description: 'Ürün favorilerinize eklendi.' })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      addToast({ type: 'error', title: 'Hata', description: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`p-1.5 bg-white rounded-full shadow-sm hover:bg-brand-light transition-colors z-30 relative ${className} ${
          isFavorite ? 'text-brand' : 'text-ink-muted hover:text-brand'
        }`}
        title={isFavorite ? 'Favorilerden kaldır' : 'Favorilere ekle'}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Giriş Yapmalısınız</DialogTitle>
            <DialogDescription>
              Ürünleri favorilerinize eklemek için lütfen giriş yapın.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              İptal
            </Button>
            <Button asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

