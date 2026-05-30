'use client'

import { useState, useRef } from 'react'
import { reorderCarousel, deleteCarouselImage } from '@/lib/actions/carousel'
import type { CarouselImage } from '@/lib/db/schema'

export default function SortableCarousel({ images: initial }: { images: CarouselImage[] }) {
  const [images, setImages] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const dragIndex = useRef<number | null>(null)

  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...images]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(index, 0, moved)
    dragIndex.current = index
    setImages(next)
  }

  async function onDragEnd() {
    dragIndex.current = null
    setSaving(true)
    await reorderCarousel(images.map(i => i.id))
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this carousel image?')) return
    setDeleting(id)
    await deleteCarouselImage(id)
    setImages(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
  }

  if (images.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No carousel images yet.</p>
  }

  return (
    <div className="space-y-2">
      {saving && (
        <p className="text-xs text-purple-600 font-medium mb-2">Saving order…</p>
      )}
      {images.map((img, index) => (
        <div
          key={img.id}
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
          <img
            src={img.imageUrl}
            alt={img.title ?? ''}
            className="w-24 h-14 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-800 truncate">{img.title || <span className="text-gray-400 italic">No title</span>}</p>
            {img.linkUrl && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{img.linkUrl}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleDelete(img.id)}
            disabled={deleting === img.id}
            className="text-red-400 hover:text-red-600 text-sm font-medium shrink-0 disabled:opacity-40"
          >
            {deleting === img.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      ))}
      <p className="text-xs text-gray-400 pt-1">Drag rows to reorder. Order saves automatically on drop.</p>
    </div>
  )
}
