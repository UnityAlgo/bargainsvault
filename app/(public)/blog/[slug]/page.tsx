import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1)

  if (!blog) return { title: 'Not Found' }

  return {
    title: `${blog.title} | BargainsVault`,
    description: blog.excerpt ?? undefined,
    keywords: blog.metaKeywords ?? undefined,
    openGraph: {
      title: blog.title,
      description: blog.excerpt ?? undefined,
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1)

  if (!blog) notFound()

  // Detect whether content is HTML (from TipTap) or plain markdown/text
  const isHTML = blog.content.trimStart().startsWith('<')

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand transition-colors mb-7"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Blog
      </Link>

      {blog.featuredImage && (
        <div className="rounded-xl overflow-hidden border border-border mb-8">
          <img src={blog.featuredImage} alt={blog.title} className="w-full h-72 object-cover" />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <time className="text-xs text-muted font-medium">
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </time>
        {blog.featured && (
          <>
            <span className="text-border">·</span>
            <span className="text-[10px] font-bold tracking-wide uppercase bg-tag-bg text-tag-text px-2 py-0.5 rounded-full">
              Featured
            </span>
          </>
        )}
        {blog.metaKeywords && (
          <>
            <span className="text-border">·</span>
            {blog.metaKeywords.split(',').slice(0, 4).map(kw => (
              <span key={kw} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
                {kw.trim()}
              </span>
            ))}
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-text tracking-tight leading-tight mb-5">
        {blog.title}
      </h1>

      {blog.excerpt && (
        <p className="text-base text-muted leading-relaxed mb-7 pl-4 border-l-2 border-brand/40 italic">
          {blog.excerpt}
        </p>
      )}

      <div className="border-t border-border mb-7" />

      {/* Content — render HTML from TipTap or plain text */}
      {isHTML ? (
        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      ) : (
        <div className="text-sm text-text/80 leading-[1.85] whitespace-pre-wrap">
          {blog.content}
        </div>
      )}

      <div className="mt-12 pt-7 border-t border-border">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          More articles
        </Link>
      </div>
    </div>
  )
}
