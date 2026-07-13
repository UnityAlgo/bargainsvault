export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs, blogCategories } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const [cat] = await db.select().from(blogCategories).where(eq(blogCategories.slug, slug)).limit(1)

  if (!cat) notFound()

  const posts = await db
    .select()
    .from(blogs)
    .where(eq(blogs.categoryId, cat.id))
    .orderBy(desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`))

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <Link
        href="/blog/categories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand transition-colors mb-6"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All Categories
      </Link>

      {cat.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-border mb-6 h-48">
          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text tracking-tight">{cat.name}</h1>
        <p className="text-muted text-sm mt-1">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <p className="text-sm text-muted">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((blog) => {
            const displayDate = blog.publishedAt ?? blog.createdAt
            return (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {blog.featuredImage ? (
                  <div className="overflow-hidden">
                    <img src={blog.featuredImage} alt={blog.title} className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-linear-to-br from-brand-light to-tag-bg" />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-semibold text-text text-sm group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{blog.excerpt}</p>
                  )}
                  <p className="text-[11px] text-muted/60 mt-3 font-medium">
                    {new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
