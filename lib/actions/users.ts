'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login')
}

export async function deleteUser(id: number) {
  await requireAdmin()
  await db.delete(users).where(eq(users.id, id))
  revalidatePath('/admin/users')
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }
  if (password.length < 8)  return { error: 'Password must be at least 8 characters' }

  const passwordHash = await bcrypt.hash(password, 12)

  try {
    await db.insert(users).values({ email, passwordHash })
  } catch {
    return { error: 'Email already in use' }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function changePassword(id: number, formData: FormData) {
  await requireAdmin()

  const password = formData.get('password') as string
  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters' }

  const passwordHash = await bcrypt.hash(password, 12)
  await db.update(users).set({ passwordHash }).where(eq(users.id, id))

  revalidatePath('/admin/users')
  redirect('/admin/users')
}
