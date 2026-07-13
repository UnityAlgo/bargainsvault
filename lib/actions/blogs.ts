'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login')
}

export async function createBlog(formData: FormData) {
  await requireAdmin()

  const title         = formData.get('title') as string
  const content       = formData.get('content') as string
  const excerpt       = formData.get('excerpt') as string
  const featuredImage = formData.get('featuredImage') as string
  const metaKeywords  = formData.get('metaKeywords') as string
  const featured      = formData.get('featured') === 'on'
  const categoryIdRaw = formData.get('categoryId') as string
  const publishedAtRaw = formData.get('publishedAt') as string

  if (!title || !content) {
    return { error: 'Title and content are required' }
  }

  const slug = slugify(title)

  await db.insert(blogs).values({
    title,
    slug,
    content,
    excerpt:       excerpt || null,
    featuredImage: featuredImage || null,
    metaKeywords:  metaKeywords || null,
    featured,
    categoryId:    categoryIdRaw ? parseInt(categoryIdRaw) : null,
    publishedAt:   publishedAtRaw ? new Date(publishedAtRaw) : null,
  })

  revalidatePath('/', 'layout')
  revalidatePath('/blog')
  redirect('/admin/blogs')
}

export async function updateBlog(id: number, formData: FormData) {
  await requireAdmin()

  const title         = formData.get('title') as string
  const content       = formData.get('content') as string
  const excerpt       = formData.get('excerpt') as string
  const featuredImage = formData.get('featuredImage') as string
  const metaKeywords  = formData.get('metaKeywords') as string
  const featured      = formData.get('featured') === 'on'
  const categoryIdRaw = formData.get('categoryId') as string
  const publishedAtRaw = formData.get('publishedAt') as string

  if (!title || !content) {
    return { error: 'Title and content are required' }
  }

  await db
    .update(blogs)
    .set({
      title,
      content,
      excerpt:       excerpt || null,
      featuredImage: featuredImage || null,
      metaKeywords:  metaKeywords || null,
      featured,
      categoryId:    categoryIdRaw ? parseInt(categoryIdRaw) : null,
      publishedAt:   publishedAtRaw ? new Date(publishedAtRaw) : null,
      updatedAt:     new Date(),
    })
    .where(eq(blogs.id, id))

  revalidatePath('/', 'layout')
  revalidatePath('/blog')
  revalidatePath(`/blog/${(await db.select({ slug: blogs.slug }).from(blogs).where(eq(blogs.id, id)))[0]?.slug}`)
  redirect('/admin/blogs')
}

export async function deleteBlog(id: number) {
  await requireAdmin()
  await db.delete(blogs).where(eq(blogs.id, id))
  revalidatePath('/', 'layout')
  revalidatePath('/blog')
  revalidatePath('/admin/blogs')
}
