export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { stores, coupons } from '@/lib/db/schema'
import { eq, ilike, and, asc, type SQL } from 'drizzle-orm'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CouponCard from './CouponCard'
import CouponsFilter from './CouponsFilter'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ store: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '')
}

export default async function StoreVouchersPage({ params, searchParams }: Props) {
  const { store: storeSlug } = await params
  const sp = await searchParams
  const q = str(sp.q)

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.slug, storeSlug))
    .limit(1)

  if (!store) notFound()

  const conditions: SQL[] = [eq(coupons.storeId, store.id)]
  if (q) conditions.push(ilike(coupons.title, `%${q}%`))

  const [storeCoupons, allStores] = await Promise.all([
    db.select().from(coupons).where(and(...conditions)),
    db.select().from(stores).orderBy(asc(stores.name)),
  ])

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand transition-colors mb-6"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All Stores
      </Link>

      {/* Store header card */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-6 flex items-center gap-4">
        {store.imageUrl ? (
          <div className="w-14 h-14 bg-page-bg rounded-xl border border-border flex items-center justify-center p-1.5 shrink-0">
            <img src={store.imageUrl} alt={store.name} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center text-brand font-bold text-xl shrink-0">
            {store.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-text tracking-tight">
            {store.name} <span className="font-normal text-muted">Coupons</span>
          </h1>
          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold bg-tag-bg text-tag-text px-2.5 py-0.5 rounded-full">
            {storeCoupons.length} deal{storeCoupons.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {/* Filter panel */}
      <Suspense>
        <CouponsFilter stores={allStores} currentStoreSlug={storeSlug} currentQ={q} />
      </Suspense>

      {/* Coupon list */}
      {storeCoupons.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <div className="w-10 h-10 bg-page-bg rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted/50">
              <path d="M9 14.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2l2.09 4.26L19 7.27l-3.5 3.41.68 5.32L12 13.77l-4.18 2.23.68-5.32L5 7.27l4.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-muted">No coupons found{q ? ` for "${q}"` : ''}.</p>
          <p className="text-xs text-muted/60 mt-1">Check back soon for fresh deals.</p>
        </div>
      ) : (
        <div className="stagger-grid space-y-2.5">
          {storeCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  )
}
