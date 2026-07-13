import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { blogCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateBlogCategory } from '@/lib/actions/blog-categories'

export default async function EditBlogCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [cat] = await db.select().from(blogCategories).where(eq(blogCategories.id, parseInt(id))).limit(1)

  if (!cat) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const action = updateBlogCategory.bind(null, cat.id) as (formData: FormData) => Promise<any>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h1>
      <form action={action} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={cat.name}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
          <input
            name="imageUrl"
            type="url"
            defaultValue={cat.imageUrl ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/image.jpg"
          />
          {cat.imageUrl && (
            <img src={cat.imageUrl} alt={cat.name} className="mt-2 h-16 w-auto rounded-lg border border-gray-200 object-cover" />
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            Save Changes
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
