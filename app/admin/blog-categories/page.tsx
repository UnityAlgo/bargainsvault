import Link from 'next/link'
import { db } from '@/lib/db'
import { blogCategories } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteBlogCategory } from '@/lib/actions/blog-categories'

export default async function BlogCategoriesPage() {
  const categories = await db
    .select()
    .from(blogCategories)
    .orderBy(asc(blogCategories.name))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categor{categories.length === 1 ? 'y' : 'ies'}</p>
        </div>
        <Link
          href="/admin/blog-categories/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
        >
          + New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-purple-100">
          <p className="text-sm text-gray-500">No categories yet.</p>
          <Link href="/admin/blog-categories/new" className="mt-3 inline-block text-sm text-purple-700 font-semibold hover:underline">
            Create one →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-purple-100 shadow-sm divide-y divide-gray-100">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 px-5 py-3">
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-400 font-bold text-sm">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-400 font-mono">/blog/categories/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blog-categories/${cat.id}/edit`}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteBlogCategory.bind(null, cat.id)} label="Delete" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
