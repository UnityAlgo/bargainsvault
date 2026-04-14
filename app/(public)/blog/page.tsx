export const dynamic = 'force-dynamic'

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
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="mb-7 animate-fade-in">
        <h1 className="text-2xl font-bold text-text tracking-tight">Blog</h1>
        <p className="text-muted text-sm mt-1">Money-saving tips, guides, and deal-hunting strategies.</p>
      </div>

      {allBlogs.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-sm font-medium text-muted">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <div className="stagger-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {blog.featuredImage ? (
                <div className="overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-linear-to-br from-brand-light to-tag-bg" />
              )}
              <div className="p-4 flex flex-col flex-1">
                {blog.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase bg-tag-bg text-tag-text px-2 py-0.5 rounded-full mb-2 w-fit">
                    Featured
                  </span>
                )}
                <h2 className="font-semibold text-text text-sm group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{blog.excerpt}</p>
                )}
                <p className="text-[11px] text-muted/60 mt-3 font-medium">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
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
