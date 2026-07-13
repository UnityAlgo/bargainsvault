'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogCategories } from '@/lib/db/schema'
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

export async function createBlogCategory(formData: FormData) {
  await requireAdmin()

  const name     = formData.get('name') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!name) return { error: 'Name is required' }

  const slug = slugify(name)

  await db.insert(blogCategories).values({
    name,
    slug,
    imageUrl: imageUrl || null,
  })

  revalidatePath('/blog/categories')
  redirect('/admin/blog-categories')
}

export async function updateBlogCategory(id: number, formData: FormData) {
  await requireAdmin()

  const name     = formData.get('name') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!name) return { error: 'Name is required' }

  await db
    .update(blogCategories)
    .set({ name, imageUrl: imageUrl || null })
    .where(eq(blogCategories.id, id))

  revalidatePath('/blog/categories')
  redirect('/admin/blog-categories')
}

export async function deleteBlogCategory(id: number) {
  await requireAdmin()
  await db.delete(blogCategories).where(eq(blogCategories.id, id))
  revalidatePath('/blog/categories')
  revalidatePath('/admin/blog-categories')
}
