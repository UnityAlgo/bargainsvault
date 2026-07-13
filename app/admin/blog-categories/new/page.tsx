import Link from 'next/link'
import { createBlogCategory } from '@/lib/actions/blog-categories'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const action = createBlogCategory as (formData: FormData) => Promise<any>

export default function NewBlogCategoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Category</h1>
      <form action={action} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. Shopping Tips"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
          <input
            name="imageUrl"
            type="url"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            Create Category
          </button>
          <Link
            href="/admin/blog-categories"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
