export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://bargainsvault.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allBlogs = await db
    .select({ slug: blogs.slug, updatedAt: blogs.updatedAt })
    .from(blogs)
    .orderBy(desc(blogs.updatedAt))

  const blogEntries: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogEntries,
    // Note: /<store>/view/vouchers pages are intentionally excluded (noindex)
  ]
}
