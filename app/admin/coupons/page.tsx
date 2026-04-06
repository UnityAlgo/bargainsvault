import Link from 'next/link'
import { db } from '@/lib/db'
import { coupons, stores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteCoupon } from '@/lib/actions/coupons'

export default async function AdminCouponsPage() {
  const allCoupons = await db
    .select({
      id: coupons.id,
      title: coupons.title,
      type: coupons.type,
      code: coupons.code,
      linkUrl: coupons.linkUrl,
      expiresAt: coupons.expiresAt,
      storeName: stores.name,
      storeSlug: stores.slug,
    })
    .from(coupons)
    .leftJoin(stores, eq(coupons.storeId, stores.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Link
          href="/admin/coupons/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New Coupon
        </Link>
      </div>

      {allCoupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-purple-100 p-8 text-center text-gray-400">
          No coupons yet.{' '}
          <Link href="/admin/coupons/new" className="text-purple-600 hover:underline">
            Create your first coupon
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 text-purple-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Store</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Code / Link</th>
                <th className="px-4 py-3 font-semibold">Expires</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{coupon.title}</td>
                  <td className="px-4 py-3 text-gray-600">{coupon.storeName ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${coupon.type === 'copy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {coupon.type === 'copy' ? 'Copy Code' : 'Direct Link'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-xs truncate">
                    {coupon.type === 'copy' ? coupon.code ?? '—' : coupon.linkUrl ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/coupons/${coupon.id}/edit`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteCoupon.bind(null, coupon.id)}
                      label="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
