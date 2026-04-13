import Link from 'next/link'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { ilike, count, and, type SQL } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteUser } from '@/lib/actions/users'
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

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp   = await searchParams
  const q    = str(sp.q)
  const page = Math.max(1, parseInt(str(sp.page) || '1'))

  const conditions: SQL[] = []
  if (q) conditions.push(ilike(users.email, `%${q}%`))
  const where = conditions.length ? and(...conditions) : undefined

  const [{ total }] = await db.select({ total: count() }).from(users).where(where)

  const rows = await db
    .select({ id: users.id, email: users.email, createdAt: users.createdAt })
    .from(users)
    .where(where)
    .orderBy(users.createdAt)
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
      header: '#',
      headerClassName: 'w-12',
      cellClassName: 'w-12 text-gray-400 font-mono text-xs',
      cell: row => row.id,
    },
    {
      header: 'Email',
      cell: row => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
            {row.email.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Joined',
      headerClassName: 'w-32',
      cellClassName: 'w-32 text-xs text-gray-500 whitespace-nowrap',
      cell: row => new Date(row.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      }),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right w-32',
      cellClassName: 'text-right',
      cell: row => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/users/${row.id}/change-password`}
            className="text-purple-600 hover:text-purple-800 font-medium text-sm"
          >
            Change PW
          </Link>
          <DeleteButton action={deleteUser.bind(null, row.id)} label="Delete" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total users</p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New User
        </Link>
      </div>

      <Suspense>
        <ListFilters
          totalItems={total}
          searchPlaceholder="Search by email…"
        />
      </Suspense>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={r => r.id}
        emptyText="No users match your search."
        emptyHref="/admin/users/new"
        emptyLinkLabel="Add one"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        basePath="/admin/users"
        currentParams={currentParams}
      />
    </div>
  )
}
