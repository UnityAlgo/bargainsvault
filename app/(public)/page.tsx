import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs, stores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function HomePage() {
  const [featuredBlogs, allStores] = await Promise.all([
    db.select().from(blogs).where(eq(blogs.featured, true)).limit(6),
    db.select().from(stores).limit(12),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Save More with BargainsVault
        </h1>
        <p className="text-purple-200 text-lg max-w-xl mx-auto">
          Discover exclusive coupons, discount codes, and deals from top stores.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Featured Stores */}
        {allStores.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Popular Stores</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/${store.slug}/view/vouchers`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all"
                >
                  {store.imageUrl ? (
                    <img
                      src={store.imageUrl}
                      alt={store.name}
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                    {store.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Featured Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
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
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
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
            <div className="mt-6 text-center">
              <Link
                href="/blog"
                className="inline-block px-6 py-2 bg-purple-700 text-white rounded-full text-sm font-medium hover:bg-purple-800 transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
