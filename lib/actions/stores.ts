'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { resolveImageUrl } from '@/lib/upload'

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
  if (!name) return { error: 'Name is required' }

  const slug = slugify(name)
  const imageUrl = await resolveImageUrl(formData)

  await db.insert(stores).values({ name, slug, imageUrl })

  revalidatePath('/')
  redirect('/admin/stores')
}

export async function updateStore(id: number, formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  if (!name) return { error: 'Name is required' }

  const imageUrl = await resolveImageUrl(formData)

  await db.update(stores).set({ name, imageUrl }).where(eq(stores.id, id))

  revalidatePath('/')
  redirect('/admin/stores')
}

export async function deleteStore(id: number) {
  await requireAdmin()
  await db.delete(stores).where(eq(stores.id, id))
  revalidatePath('/', 'layout')
  revalidatePath('/admin/stores')
}

export async function reorderStores(orderedIds: number[]) {
  await requireAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(stores).set({ sortOrder: index }).where(eq(stores.id, id))
    )
  )
  revalidatePath('/')
  revalidatePath('/admin/stores')
}
