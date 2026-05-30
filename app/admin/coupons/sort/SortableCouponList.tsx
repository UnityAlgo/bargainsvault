'use client'

import { useState, useRef } from 'react'
import { reorderCoupons } from '@/lib/actions/coupons'

type CouponRow = {
  id: number
  title: string
  type: 'copy' | 'link'
  storeName: string | null
}

export default function SortableCouponList({ coupons: initial }: { coupons: CouponRow[] }) {
  const [coupons, setCoupons] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const dragIndex = useRef<number | null>(null)

  function onDragStart(index: number) {
    dragIndex.current = index
    setSaved(false)
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...coupons]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, moved)
    dragIndex.current = index
    setCoupons(next)
  }

  async function onDragEnd() {
    dragIndex.current = null
    setSaving(true)
    await reorderCoupons(coupons.map(c => c.id))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-3 h-5">
        {saving && <span className="text-xs text-purple-600 font-medium">Saving order…</span>}
        {saved && <span className="text-xs text-green-600 font-medium">Order saved!</span>}
      </div>
      {coupons.map((coupon, index) => (
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
          <span className="text-xs text-gray-400 font-mono w-5 shrink-0">{index + 1}</span>
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
      <p className="text-xs text-gray-400 pt-1">Drag rows to reorder. Order saves automatically on drop.</p>
    </div>
  )
}
