import Link from 'next/link'
import { db } from '@/lib/db'
import { coupons, stores } from '@/lib/db/schema'
import { desc, ilike, eq, and, gte, lte, count, type SQL } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteCoupon } from '@/lib/actions/coupons'
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

export default async function AdminCouponsPage({ searchParams }: PageProps) {
  const sp      = await searchParams
  const q           = str(sp.q)
  const type        = str(sp.type)        // '' | 'copy' | 'link'
  const storeId     = str(sp.store)       // '' | '<id>'
  const code        = str(sp.code)
  const expiresFrom = str(sp.expiresFrom) // 'YYYY-MM-DD'
  const expiresTo   = str(sp.expiresTo)   // 'YYYY-MM-DD'
  const page        = Math.max(1, parseInt(str(sp.page) || '1'))

  // Build WHERE conditions
  const conditions: SQL[] = []
  if (q)                   conditions.push(ilike(coupons.title, `%${q}%`))
  if (type === 'copy' || type === 'link') conditions.push(eq(coupons.type, type))
  if (storeId)             conditions.push(eq(coupons.storeId, parseInt(storeId)))
  if (code)                conditions.push(ilike(coupons.code, `%${code}%`))
  if (expiresFrom)         conditions.push(gte(coupons.expiresAt, new Date(expiresFrom)))
  if (expiresTo)            conditions.push(lte(coupons.expiresAt, new Date(`${expiresTo}T23:59:59`)))

  const where = conditions.length ? and(...conditions) : undefined

  // Get all stores for filter dropdown
  const allStores = await db.select({ id: stores.id, name: stores.name }).from(stores).orderBy(stores.name)

  const [{ total }] = await db
    .select({ total: count() })
    .from(coupons)
    .where(where)

  const rows = await db
    .select({
      id:        coupons.id,
      title:     coupons.title,
      type:      coupons.type,
      code:      coupons.code,
      linkUrl:   coupons.linkUrl,
      expiresAt: coupons.expiresAt,
      storeName: stores.name,
    })
    .from(coupons)
    .leftJoin(stores, eq(coupons.storeId, stores.id))
    .where(where)
    .orderBy(desc(coupons.createdAt))
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
      header: 'Title',
      cell: row => <span className="font-medium text-gray-800">{row.title}</span>,
    },
    {
      header: 'Store',
      headerClassName: 'w-32',
      cellClassName: 'w-32 text-gray-600',
      cell: row => row.storeName ?? '—',
    },
    {
      header: 'Type',
      headerClassName: 'w-28',
      cellClassName: 'w-28',
      cell: row => (
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
          row.type === 'copy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
        }`}>
          {row.type === 'copy' ? 'Copy Code' : 'Direct Link'}
        </span>
      ),
    },
    {
      header: 'Code / URL',
      headerClassName: 'w-40',
      cellClassName: 'w-40',
      cell: row => (
        <span className="font-mono text-xs text-gray-500 truncate block max-w-40">
          {row.type === 'copy' ? (row.code ?? '—') : (row.linkUrl ?? '—')}
        </span>
      ),
    },
    {
      header: 'Expires',
      headerClassName: 'w-28',
      cellClassName: 'w-28 text-xs whitespace-nowrap',
      cell: row => row.expiresAt ? (
        <span className={new Date(row.expiresAt) < new Date() ? 'text-red-400' : 'text-gray-500'}>
          {new Date(row.expiresAt).toLocaleDateString()}
        </span>
      ) : <span className="text-gray-300">—</span>,
    },
    {
      header: 'Actions',
      headerClassName: 'text-right w-28',
      cellClassName: 'text-right',
      cell: row => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/coupons/${row.id}/edit`} className="text-purple-600 hover:text-purple-800 font-medium">
            Edit
          </Link>
          <DeleteButton action={deleteCoupon.bind(null, row.id)} label="Delete" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total coupons</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/coupons/sort"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Sort Order
          </Link>
          <Link
            href="/admin/coupons/new"
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            + New Coupon
          </Link>
        </div>
      </div>

      <Suspense>
        <ListFilters
          totalItems={total}
          searchPlaceholder="Search by title…"
          filters={[
            {
              key: 'type',
              label: 'Type',
              options: [
                { value: 'copy', label: 'Copy Code' },
                { value: 'link', label: 'Direct Link' },
              ],
            },
            {
              key: 'store',
              label: 'Store',
              options: allStores.map(s => ({ value: String(s.id), label: s.name })),
            },
          ]}
          textFilters={[
            { key: 'code', label: 'Code', placeholder: 'e.g. SAVE20' },
          ]}
          dateRangeFilter={{ fromKey: 'expiresFrom', toKey: 'expiresTo', label: 'Expires' }}
        />
      </Suspense>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={r => r.id}
        emptyText="No coupons match your filters."
        emptyHref="/admin/coupons/new"
        emptyLinkLabel="Create one"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        basePath="/admin/coupons"
        currentParams={currentParams}
      />
    </div>
  )
}
