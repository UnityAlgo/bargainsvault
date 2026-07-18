'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { reorderCoupons } from '@/lib/actions/coupons'

type CouponRow = {
  id: number
  title: string
  type: 'copy' | 'link'
  storeName: string | null
}

export default function SortableCouponList({ coupons: initial }: { coupons: CouponRow[] }) {
  const [allCoupons, setAllCoupons] = useState(initial)
  const [storeFilter, setStoreFilter] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const dragIndex = useRef<number | null>(null)
  const latestCoupons = useRef(initial)

  useEffect(() => { latestCoupons.current = allCoupons }, [allCoupons])

  const storeNames = useMemo(() => {
    const names = allCoupons.map(c => c.storeName).filter(Boolean) as string[]
    return [...new Set(names)].sort()
  }, [allCoupons])

  const isMatch = (c: CouponRow) =>
    !storeFilter || c.storeName?.toLowerCase().includes(storeFilter.toLowerCase())

  const filtered = allCoupons.filter(isMatch)

  function onDragStart(filteredIndex: number) {
    dragIndex.current = filteredIndex
    setSaved(false)
  }

  function onDragOver(e: React.DragEvent, toFilteredIndex: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === toFilteredIndex) return

    const fromFilteredIndex = dragIndex.current
    dragIndex.current = toFilteredIndex

    // Capture filter value so functional update can use it without stale closure
    const filter = storeFilter

    setAllCoupons(prev => {
      const matchFn = (c: CouponRow) =>
        !filter || c.storeName?.toLowerCase().includes(filter.toLowerCase())

      const prevFiltered = prev.filter(matchFn)
      const nextFiltered = [...prevFiltered]
      const [moved] = nextFiltered.splice(fromFilteredIndex, 1)
      nextFiltered.splice(toFilteredIndex, 0, moved)

      const filteredSlots = prev
        .map((c, i) => (matchFn(c) ? i : -1))
        .filter(i => i !== -1)

      const nextAll = [...prev]
      filteredSlots.forEach((allIdx, fi) => {
        nextAll[allIdx] = nextFiltered[fi]
      })
      return nextAll
    })
  }

  async function onDragEnd() {
    dragIndex.current = null
    setSaving(true)
    await reorderCoupons(latestCoupons.current.map(c => c.id))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-2">
      {/* Store filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={storeFilter}
            onChange={e => setStoreFilter(e.target.value)}
            placeholder="Search by store…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {storeNames.length > 0 && (
          <select
            value={storeFilter}
            onChange={e => setStoreFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
          >
            <option value="">All stores</option>
            {storeNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
        {storeFilter && (
          <button
            onClick={() => setStoreFilter('')}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 h-5 mb-1">
        {saving && <span className="text-xs text-purple-600 font-medium">Saving order…</span>}
        {saved && <span className="text-xs text-green-600 font-medium">Order saved!</span>}
        {storeFilter && (
          <span className="text-xs text-gray-400">
            {filtered.length} of {allCoupons.length} coupons
          </span>
        )}
      </div>

      {filtered.map((coupon, index) => (
        <div
          key={coupon.id}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-purple-200 transition-colors select-none"
        >
          <div className="text-gray-300 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" />
              <circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" />
              <circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" />
            </svg>
          </div>
          <span className="text-xs text-gray-400 font-mono w-5 shrink-0">
            {allCoupons.indexOf(coupon) + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-800 truncate">{coupon.title}</p>
            {coupon.storeName && (
              <p className="text-xs text-gray-400 mt-0.5">{coupon.storeName}</p>
            )}
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            coupon.type === 'copy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {coupon.type === 'copy' ? 'Copy Code' : 'Direct Link'}
          </span>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No coupons match "{storeFilter}"</p>
      )}

      <p className="text-xs text-gray-400 pt-1">Drag rows to reorder. Order saves automatically on drop.</p>
    </div>
  )
}
