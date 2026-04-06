'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
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

export async function createStore(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!name) {
    return { error: 'Name is required' }
  }

  const slug = slugify(name)

  await db.insert(stores).values({
    name,
    slug,
    imageUrl: imageUrl || null,
  })

  revalidatePath('/')
  redirect('/admin/stores')
}

export async function updateStore(id: number, formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!name) {
    return { error: 'Name is required' }
  }

  await db
    .update(stores)
    .set({
      name,
      imageUrl: imageUrl || null,
    })
    .where(eq(stores.id, id))

  revalidatePath('/')
  redirect('/admin/stores')
}

export async function deleteStore(id: number) {
  await requireAdmin()
  await db.delete(stores).where(eq(stores.id, id))
  revalidatePath('/', 'layout')
  revalidatePath('/admin/stores')
}
