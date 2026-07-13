export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs, blogCategories } from '@/lib/db/schema'
import { desc, ilike, or, sql, asc } from 'drizzle-orm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | BargainsVault',
  description: 'Money-saving tips, coupon guides, and deal-hunting strategies.',
}

const PER_PAGE = 20

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function BlogListPage({ searchParams }: Props) {
  const { q = '', page: pageStr = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageStr) || 1)
  const offset = (page - 1) * PER_PAGE

  const searchFilter = q
    ? or(ilike(blogs.title, `%${q}%`), ilike(blogs.excerpt, `%${q}%`))
    : undefined

  const [rows, [{ total }], categories] = await Promise.all([
    db
      .select()
      .from(blogs)
      .where(searchFilter)
      .orderBy(desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(blogs)
      .where(searchFilter),
    db.select().from(blogCategories).orderBy(asc(blogCategories.name)),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  function buildUrl(p: number, query?: string) {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/blog${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-text tracking-tight">Blog</h1>
        <p className="text-muted text-sm mt-1">Money-saving tips, guides, and deal-hunting strategies.</p>
      </div>

      {/* Categories strip */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <Link
            href="/blog/categories"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand text-white hover:bg-brand-hover transition-colors"
          >
            All Categories
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/blog/categories/${cat.slug}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-border text-muted hover:border-brand/40 hover:text-brand transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Search */}
      <form method="GET" action="/blog" className="mb-6">
        <div className="relative max-w-md">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search articles…"
            className="w-full pl-8 pr-10 py-2.5 border border-border rounded-xl text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          {q && (
            <Link href="/blog" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text text-xs">✕</Link>
          )}
        </div>
      </form>

      {q && (
        <p className="text-sm text-muted mb-4">
          {total} result{total !== 1 ? 's' : ''} for <span className="font-semibold text-text">"{q}"</span>
        </p>
      )}

      {rows.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-sm font-medium text-muted">{q ? 'No articles match your search.' : 'No articles yet. Check back soon!'}</p>
          {q && <Link href="/blog" className="mt-2 inline-block text-xs text-brand font-semibold hover:underline">Clear search</Link>}
        </div>
      ) : (
        <>
          <div className="stagger-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((blog) => {
              const displayDate = blog.publishedAt ?? blog.createdAt
              return (
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
                      {new Date(displayDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {page > 1 && (
                <Link
                  href={buildUrl(page - 1, q)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-muted hover:border-brand/40 hover:text-brand transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={buildUrl(p as number, q)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? 'bg-brand text-white'
                          : 'bg-surface border border-border text-muted hover:border-brand/40 hover:text-brand'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
              {page < totalPages && (
                <Link
                  href={buildUrl(page + 1, q)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-muted hover:border-brand/40 hover:text-brand transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
