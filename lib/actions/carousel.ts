'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { carouselImages } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { resolveImageUrl } from '@/lib/upload'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login')
}

export async function createCarouselImage(formData: FormData) {
  await requireAdmin()

  const imageUrl = await resolveImageUrl(formData)
  if (!imageUrl) return { error: 'Image is required' }

  const title = formData.get('title') as string
  const linkUrl = formData.get('linkUrl') as string
  const existing = await db.select({ sortOrder: carouselImages.sortOrder }).from(carouselImages)
  const maxOrder = existing.length > 0 ? Math.max(...existing.map(r => r.sortOrder)) : -1

  await db.insert(carouselImages).values({
    imageUrl,
    title: title || null,
    linkUrl: linkUrl || null,
    sortOrder: maxOrder + 1,
  })

  revalidatePath('/')
  redirect('/admin/carousel')
}

export async function deleteCarouselImage(id: number) {
  await requireAdmin()
  await db.delete(carouselImages).where(eq(carouselImages.id, id))
  revalidatePath('/')
  revalidatePath('/admin/carousel')
}

export async function reorderCarousel(orderedIds: number[]) {
  await requireAdmin()
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(carouselImages).set({ sortOrder: index }).where(eq(carouselImages.id, id))
    )
  )
  revalidatePath('/')
  revalidatePath('/admin/carousel')
}
