import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { stores, coupons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import CouponCard from './CouponCard'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ store: string }>
}

export default async function StoreVouchersPage({ params }: Props) {
  const { store: storeSlug } = await params

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.slug, storeSlug))
    .limit(1)

  if (!store) notFound()

  const storeCoupons = await db
    .select()
    .from(coupons)
    .where(eq(coupons.storeId, store.id))

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Store Header */}
      <div className="flex items-center gap-4 mb-10">
        {store.imageUrl ? (
          <img
            src={store.imageUrl}
            alt={store.name}
            className="w-16 h-16 object-contain rounded-xl border border-purple-100"
          />
        ) : (
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold text-2xl">
            {store.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{store.name} Coupons</h1>
          <p className="text-purple-600 text-sm">{storeCoupons.length} active deal{storeCoupons.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {storeCoupons.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No coupons available for this store yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {storeCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  )
}
