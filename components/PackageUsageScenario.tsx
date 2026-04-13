import { Users, Zap, Clock, Package, TrendingUp } from 'lucide-react'
import type { PackageCategory } from '@/lib/package-categories'

interface Props {
  item: PackageCategory
}

export function PackageUsageScenario({ item }: Props) {
  return (
    <section className="bg-gradient-to-b from-slate-100 to-white border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 md:py-14">
        <div className="mb-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand mb-2">
            Kullanım Senaryosu
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {item.shortTitle} Paketi ile Ne Yapabilirsiniz?
          </h2>
        </div>

        {/* First row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Card 1: Kimler için */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[180px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">Kimler için</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{item.targetAudience}</p>
          </div>

          {/* Card 2: Kaç cihazı çalıştırır */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[180px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">Kaç cihazı çalıştırır</h3>
            </div>
            {item.deviceCapacity ? (
              <p className="text-slate-600 text-sm leading-relaxed">{item.deviceCapacity}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Bilgi yakında eklenecek</p>
            )}
          </div>

          {/* Card 3: Ortalama günlük kullanım */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[180px] sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">Ortalama günlük kullanım</h3>
            </div>
            {item.dailyUsage ? (
              <p className="text-slate-600 text-sm leading-relaxed">{item.dailyUsage}</p>
            ) : (
              <p className="text-slate-400 text-sm italic">Bilgi yakında eklenecek</p>
            )}
          </div>
        </div>

        {/* Second row: 2 cards centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-2/3 lg:mx-auto">
          {/* Card 4: İçindekiler */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[180px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">İçindekiler</h3>
            </div>
            <ul className="space-y-1.5">
              {item.includedHighlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 5: Yükseltme seçenekleri */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[180px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">Yükseltme seçenekleri</h3>
            </div>
            {item.upgradeOptions && item.upgradeOptions.length > 0 ? (
              <ul className="space-y-1.5">
                {item.upgradeOptions.map((option) => (
                  <li key={option} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand/50 shrink-0" />
                    {option}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm italic">Bilgi yakında eklenecek</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
