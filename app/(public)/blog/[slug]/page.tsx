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
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1)

  if (!blog) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-purple-600 hover:text-purple-800 text-sm font-medium mb-6 inline-block">
        ← Back to Blog
      </Link>

      {blog.featuredImage && (
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      )}

      <p className="text-sm text-purple-500 mb-2">
        {new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

      {blog.excerpt && (
        <p className="text-lg text-gray-500 mb-8 border-l-4 border-purple-300 pl-4 italic">
          {blog.excerpt}
        </p>
      )}

      <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  )
}
