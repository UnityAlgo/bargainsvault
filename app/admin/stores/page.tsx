import Link from 'next/link'
import { db } from '@/lib/db'
import { stores, coupons } from '@/lib/db/schema'
import { ilike, eq, count, and, type SQL } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteStore } from '@/lib/actions/stores'
import ListFilters from '../_components/ListFilters'
import Pagination from '../_components/Pagination'
import DataTable, { type Column } from '../_components/DataTable'
import { Suspense } from 'react'

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '')
}

export default async function AdminStoresPage({ searchParams }: PageProps) {
  const sp   = await searchParams
  const q    = str(sp.q)
  const page = Math.max(1, parseInt(str(sp.page) || '1'))

  const conditions: SQL[] = []
  if (q) conditions.push(ilike(stores.name, `%${q}%`))
  const where = conditions.length ? and(...conditions) : undefined

  const [{ total }] = await db.select({ total: count() }).from(stores).where(where)

  // Get coupon counts per store for display
  const couponCounts = await db
    .select({ storeId: coupons.storeId, total: count() })
    .from(coupons)
    .groupBy(coupons.storeId)

  const couponMap = Object.fromEntries(couponCounts.map(c => [c.storeId, c.total]))

  const rows = await db
    .select()
    .from(stores)
    .where(where)
    .orderBy(stores.name)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const currentParams = Object.fromEntries(
    Object.entries(sp)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, str(v)])
      .filter(([k]) => k !== 'page')
  )

  type Row = typeof rows[number]

  const columns: Column<Row>[] = [
    {
      header: 'Store',
      cell: row => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="w-8 h-8 object-contain rounded-md shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center text-purple-700 text-xs font-bold shrink-0">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Voucher URL',
      cell: row => (
        <Link
          href={`/${row.slug}/view/vouchers`}
          target="_blank"
          className="text-xs text-gray-500 hover:text-purple-600 hover:underline"
        >
          /{row.slug}/view/vouchers ↗
        </Link>
      ),
    },
    {
      header: 'Coupons',
      headerClassName: 'w-24 text-center',
      cellClassName: 'w-24 text-center',
      cell: row => (
        <Link
          href={`/admin/coupons?store=${row.id}`}
          className="inline-block text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full hover:bg-purple-100 transition-colors"
        >
          {couponMap[row.id] ?? 0}
        </Link>
      ),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right w-28',
      cellClassName: 'text-right',
      cell: row => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/stores/${row.id}/edit`} className="text-purple-600 hover:text-purple-800 font-medium">
            Edit
          </Link>
          <DeleteButton action={deleteStore.bind(null, row.id)} label="Delete" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total stores</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/stores/sort"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Sort Order
          </Link>
          <Link
            href="/admin/stores/new"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            + New Store
          </Link>
        </div>
      </div>

      <Suspense>
        <ListFilters
          totalItems={total}
          searchPlaceholder="Search by store name…"
        />
      </Suspense>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={r => r.id}
        emptyText="No stores match your search."
        emptyHref="/admin/stores/new"
        emptyLinkLabel="Add one"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        basePath="/admin/stores"
        currentParams={currentParams}
      />
    </div>
  )
}
