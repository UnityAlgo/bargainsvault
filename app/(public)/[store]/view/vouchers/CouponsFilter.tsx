'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import type { Store } from '@/lib/db/schema'

interface Props {
  stores: Store[]
  currentStoreSlug: string
  currentQ: string
}

export default function CouponsFilter({ stores, currentStoreSlug, currentQ }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set('q', value)
      else params.delete('q')
      router.replace(`${pathname}?${params.toString()}`)
    }, 300)
  }

  function handleStoreChange(slug: string) {
    if (slug && slug !== currentStoreSlug) {
      router.push(`/${slug}/view/vouchers`)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Coupon search */}
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          width="14" height="14" viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          defaultValue={currentQ}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search coupons…"
          className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-text"
        />
      </div>

      {/* Store switcher */}
      <select
        value={currentStoreSlug}
        onChange={e => handleStoreChange(e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-surface text-text focus:outline-none focus:ring-2 focus:ring-brand"
      >
        <option value="">Find another store…</option>
        {stores.map(s => (
          <option key={s.id} value={s.slug}>{s.name}</option>
        ))}
      </select>
    </div>
  )
}
