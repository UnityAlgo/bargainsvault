import Link from 'next/link'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import SortableStoreList from './SortableStoreList'

export default async function SortStoresPage() {
  const allStores = await db
    .select()
    .from(stores)
    .orderBy(asc(stores.sortOrder), asc(stores.name))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sort Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag to set the display order on the public site</p>
        </div>
        <Link
          href="/admin/stores"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          ← Back to Stores
        </Link>
      </div>
      <SortableStoreList stores={allStores} />
    </div>
  )
}
