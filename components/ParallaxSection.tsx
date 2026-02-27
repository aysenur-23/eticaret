'use client'

import React, { useRef, useState, useEffect } from 'react'

const WHY_REVISION_IMAGE = '/hero.jpg'
const PARALLAX_SPEED = 0.2
/** Scale yeterince büyük olmalı ki kaydırma sırasında kenarda boşluk kalmasın */
const COVER_SCALE = 1.25

interface ParallaxSectionProps {
  children: React.ReactNode
  backgroundImage?: string
  className?: string
}

export function ParallaxSection({ children, backgroundImage = WHY_REVISION_IMAGE, className = '' }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [translateY, setTranslateY] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const updateParallax = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = rect.height
      // Parallax: bölüm yukarı/aşağı giderken görsel daha az kayar (kendi içinde dönme hissi)
      const rawY = rect.top * PARALLAX_SPEED
      // Taşmayı önle: kaydırma miktarını section yüksekliğinin ~%15'i ile sınırla, böylece scale ile boşluk çıkmaz
      const maxMove = sectionHeight * 0.15
      const y = Math.max(-maxMove, Math.min(maxMove, rawY))
      setTranslateY(y)
    }

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {/* Arka plan: her zaman section'ı kaplasın (scale + sınırlı translate), scroll'da kendi içinde hareket */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate3d(0, ${translateY}px, 0) scale(${COVER_SCALE})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-slate-900/80" />
      <div className="relative z-10">{children}</div>
    </section>
  )
}
