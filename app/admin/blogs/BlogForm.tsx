import Link from 'next/link'
import type { Blog } from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  action: (formData: FormData) => Promise<any>
  defaultValues?: Partial<Blog>
}

export default function BlogForm({ action, defaultValues }: Props) {
  return (
    <form action={action} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Blog post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <input
          name="excerpt"
          defaultValue={defaultValues?.excerpt ?? ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Short description shown in listings"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea
          name="content"
          required
          defaultValue={defaultValues?.content}
          rows={12}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
          placeholder="Write your blog post content here…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
        <input
          name="featuredImage"
          type="url"
          defaultValue={defaultValues?.featuredImage ?? ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={defaultValues?.featured ?? false}
          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Feature this post on the homepage
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
        >
          Save
        </button>
        <Link
          href="/admin/blogs"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
