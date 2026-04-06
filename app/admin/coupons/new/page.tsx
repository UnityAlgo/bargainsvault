import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { createCoupon } from '@/lib/actions/coupons'
import CouponForm from '../CouponForm'

export default async function NewCouponPage() {
  const allStores = await db.select().from(stores)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Coupon</h1>
      <CouponForm action={createCoupon} stores={allStores} />
    </div>
  )
}
