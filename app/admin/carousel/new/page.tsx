import Link from 'next/link'
import { createCarouselImage } from '@/lib/actions/carousel'
import ImageUploadInput from '@/app/_components/ImageUploadInput'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const action = createCarouselImage as (formData: FormData) => Promise<any>

export default function NewCarouselImagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Carousel Image</h1>
      <form action={action} encType="multipart/form-data" className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">

        <ImageUploadInput label="Desktop / Tablet Image *" required />

        <ImageUploadInput
          label="Mobile Image (optional — shown on small screens)"
          fieldPrefix="mobileImage"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input
            name="title"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Summer Sale"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
          <input
            name="linkUrl"
            type="url"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com"
          />
          <p className="text-xs text-gray-400 mt-1">Where clicking the image takes users.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            Add Image
          </button>
          <Link
            href="/admin/carousel"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
