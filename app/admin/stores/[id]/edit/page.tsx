import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateStore } from '@/lib/actions/stores'
import StoreForm from '../../StoreForm'

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [store] = await db.select().from(stores).where(eq(stores.id, parseInt(id))).limit(1)

  if (!store) notFound()

  const action = updateStore.bind(null, store.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Store</h1>
      <StoreForm action={action} defaultValues={store} />
    </div>
  )
}
