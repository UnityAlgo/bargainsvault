export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { blogCategories, blogs } from '@/lib/db/schema'
import { eq, sql, asc } from 'drizzle-orm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Categories | BargainsVault',
  description: 'Browse our blog by category.',
}

export default async function BlogCategoriesPage() {
  const categories = await db
    .select({
      id: blogCategories.id,
      name: blogCategories.name,
      slug: blogCategories.slug,
      imageUrl: blogCategories.imageUrl,
      postCount: sql<number>`count(${blogs.id})::int`,
    })
    .from(blogCategories)
    .leftJoin(blogs, eq(blogs.categoryId, blogCategories.id))
    .groupBy(blogCategories.id)
    .orderBy(asc(blogCategories.name))

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="mb-7 animate-fade-in">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand transition-colors mb-4"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-text tracking-tight">Blog Categories</h1>
        <p className="text-muted text-sm mt-1">Browse articles by topic.</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-sm text-muted">No categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/categories/${cat.slug}`}
              className="group bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {cat.imageUrl ? (
                <div className="overflow-hidden h-36">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-36 bg-linear-to-br from-brand-light to-tag-bg flex items-center justify-center">
                  <span className="text-3xl font-bold text-brand/30">{cat.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="p-3">
                <h2 className="font-semibold text-text text-sm group-hover:text-brand transition-colors">{cat.name}</h2>
                <p className="text-[11px] text-muted mt-0.5">{cat.postCount} post{cat.postCount !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
