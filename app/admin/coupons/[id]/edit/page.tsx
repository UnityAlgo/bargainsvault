import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { coupons, stores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateCoupon } from '@/lib/actions/coupons'
import CouponForm from '../../CouponForm'

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [[coupon], allStores] = await Promise.all([
    db.select().from(coupons).where(eq(coupons.id, parseInt(id))).limit(1),
    db.select().from(stores),
  ])

  if (!coupon) notFound()

  const action = updateCoupon.bind(null, coupon.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Coupon</h1>
      <CouponForm action={action} defaultValues={coupon} stores={allStores} />
    </div>
  )
}
