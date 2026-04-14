export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs, stores, coupons } from '@/lib/db/schema'
import { count } from 'drizzle-orm'

export default async function AdminDashboard() {
  const [[blogCount], [storeCount], [couponCount]] = await Promise.all([
    db.select({ count: count() }).from(blogs),
    db.select({ count: count() }).from(stores),
    db.select({ count: count() }).from(coupons),
  ])

  const stats = [
    { label: 'Blogs', value: blogCount.count, href: '/admin/blogs' },
    { label: 'Stores', value: storeCount.count, href: '/admin/stores' },
    { label: 'Coupons', value: couponCount.count, href: '/admin/coupons' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 hover:shadow-md hover:border-purple-300 transition-all"
          >
            <p className="text-3xl font-bold text-purple-700">{stat.value}</p>
            <p className="text-gray-600 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
