'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { CarouselImage } from '@/lib/db/schema'

export default function Carousel({ images }: { images: CarouselImage[] }) {
  const [index, setIndex] = useState(0)
  const maxIndex = images.length - 1

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [images.length, maxIndex])

  if (images.length === 0) return null

  return (
    <section className="animate-fade-in-up">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Slide track — each slide is 100% wide */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img) => {
            const slide = (
              <div className="relative w-full overflow-hidden rounded-2xl h-52 md:h-64 lg:h-72">
                <img
                  src={img.imageUrl}
                  alt={img.title ?? ''}
                  className="w-full h-full object-cover"
                />
                {img.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4 rounded-b-2xl">
                    <p className="text-white font-semibold text-sm">{img.title}</p>
                  </div>
                )}
              </div>
            )

            return (
              <div key={img.id} className="w-full shrink-0">
                {img.linkUrl ? (
                  <Link href={img.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                    {slide}
                  </Link>
                ) : slide}
              </div>
            )
          })}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="#1c1028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="#1c1028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-brand w-4' : 'bg-border w-2'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
