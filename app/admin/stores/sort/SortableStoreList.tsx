'use client'

import { useState, useRef } from 'react'
import { reorderStores } from '@/lib/actions/stores'
import type { Store } from '@/lib/db/schema'

export default function SortableStoreList({ stores: initial }: { stores: Store[] }) {
  const [stores, setStores] = useState(initial)
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
    const next = [...stores]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, moved)
    dragIndex.current = index
    setStores(next)
  }

  async function onDragEnd() {
    dragIndex.current = null
    setSaving(true)
    await reorderStores(stores.map(s => s.id))
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
      {stores.map((store, index) => (
        <div
          key={store.id}
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
          {store.imageUrl ? (
            <img src={store.imageUrl} alt={store.name} className="w-9 h-9 object-contain rounded-lg shrink-0" />
          ) : (
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-xs font-bold shrink-0">
              {store.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium text-gray-800 flex-1">{store.name}</span>
          <span className="text-xs text-gray-400 font-mono">/{store.slug}</span>
        </div>
      ))}
      <p className="text-xs text-gray-400 pt-1">Drag rows to reorder. Order saves automatically on drop.</p>
    </div>
  )
}
