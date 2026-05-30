import Link from 'next/link'
import { db } from '@/lib/db'
import { coupons, stores } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import SortableCouponList from './SortableCouponList'

export default async function SortCouponsPage() {
  const rows = await db
    .select({
      id: coupons.id,
      title: coupons.title,
      type: coupons.type,
      storeName: stores.name,
    })
    .from(coupons)
    .leftJoin(stores, eq(coupons.storeId, stores.id))
    .orderBy(asc(coupons.sortOrder), asc(coupons.createdAt))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sort Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag to set the display order on the public site</p>
        </div>
        <Link
          href="/admin/coupons"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          ← Back to Coupons
        </Link>
      </div>
      <SortableCouponList coupons={rows as { id: number; title: string; type: 'copy' | 'link'; storeName: string | null }[]} />
    </div>
  )
}
