import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | BargainsVault',
  description: 'Money-saving tips, coupon guides, and deal-hunting strategies.',
}

export default async function BlogListPage() {
  const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Blog</h1>

      {allBlogs.length === 0 ? (
        <p className="text-gray-500">No articles yet. Check back soon!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all overflow-hidden"
            >
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                {blog.featured && (
                  <span className="inline-block text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full mb-2">
                    Featured
                  </span>
                )}
                <h2 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>
                )}
                <p className="text-xs text-purple-500 mt-3">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
