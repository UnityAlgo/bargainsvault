import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteBlog } from '@/lib/actions/blogs'

export default async function AdminBlogsPage() {
  const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New Blog
        </Link>
      </div>

      {allBlogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-purple-100 p-8 text-center text-gray-400">
          No blogs yet.{' '}
          <Link href="/admin/blogs/new" className="text-purple-600 hover:underline">
            Create your first blog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 text-purple-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {blog.title}
                    <div className="text-xs text-gray-400 mt-0.5">/blog/{blog.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    {blog.featured && (
                      <span className="inline-block text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                        Yes
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteBlog.bind(null, blog.id)}
                      label="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
