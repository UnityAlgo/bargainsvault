import Link from 'next/link'
import { db } from '@/lib/db'
import { carouselImages } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import SortableCarousel from './SortableCarousel'

export default async function AdminCarouselPage() {
  const images = await db
    .select()
    .from(carouselImages)
    .orderBy(asc(carouselImages.sortOrder), asc(carouselImages.createdAt))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carousel</h1>
          <p className="text-sm text-gray-500 mt-0.5">{images.length} image{images.length !== 1 ? 's' : ''} — drag to reorder</p>
        </div>
        <Link
          href="/admin/carousel/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + Add Image
        </Link>
      </div>
      <SortableCarousel images={images} />
    </div>
  )
}
