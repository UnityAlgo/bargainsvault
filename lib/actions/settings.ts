'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login')
}

export async function getSettings() {
  const rows = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, ['show_vouchers', 'show_products']))

  const map = new Map(rows.map(r => [r.key, r.value]))

  return {
    showVouchers: map.get('show_vouchers') !== 'false',
    showProducts: map.get('show_products') !== 'false',
  }
}

export async function updateSettings(formData: FormData) {
  await requireAdmin()

  const showVouchers = formData.get('showVouchers') === 'on'
  const showProducts = formData.get('showProducts') === 'on'

  for (const [key, value] of [
    ['show_vouchers', String(showVouchers)],
    ['show_products', String(showProducts)],
  ] as const) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } })
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
}
