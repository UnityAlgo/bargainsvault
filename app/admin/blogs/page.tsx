import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { desc, ilike, eq, and, count, type SQL } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteBlog } from '@/lib/actions/blogs'
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

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const q        = str(sp.q)
  const featured = str(sp.featured)   // '' | 'yes' | 'no'
  const page     = Math.max(1, parseInt(str(sp.page) || '1'))

  // Build WHERE conditions
  const conditions: SQL[] = []
  if (q)          conditions.push(ilike(blogs.title, `%${q}%`))
  if (featured === 'yes') conditions.push(eq(blogs.featured, true))
  if (featured === 'no')  conditions.push(eq(blogs.featured, false))

  const where = conditions.length ? and(...conditions) : undefined

  const [{ total }] = await db
    .select({ total: count() })
    .from(blogs)
    .where(where)

  const rows = await db
    .select()
    .from(blogs)
    .where(where)
    .orderBy(desc(blogs.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Strip undefined from searchParams for Pagination link building
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
      cell: row => (
        <div>
          <p className="font-medium text-gray-800 leading-snug">{row.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">/blog/{row.slug}</p>
        </div>
      ),
    },
    {
      header: 'Featured',
      headerClassName: 'w-24',
      cellClassName: 'w-24',
      cell: row => row.featured ? (
        <span className="inline-block text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
          Yes
        </span>
      ) : null,
    },
    {
      header: 'Date',
      headerClassName: 'w-28',
      cellClassName: 'w-28 text-gray-500 text-xs whitespace-nowrap',
      cell: row => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right w-32',
      cellClassName: 'text-right',
      cell: row => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/blog/${row.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600" title="Preview">
            ↗
          </Link>
          <Link href={`/admin/blogs/${row.id}/edit`} className="text-purple-600 hover:text-purple-800 font-medium">
            Edit
          </Link>
          <DeleteButton action={deleteBlog.bind(null, row.id)} label="Delete" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} total posts</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New Blog
        </Link>
      </div>

      <Suspense>
        <ListFilters
          totalItems={total}
          searchPlaceholder="Search by title…"
          filters={[
            {
              key: 'featured',
              label: 'Featured',
              options: [
                { value: 'yes', label: 'Featured' },
                { value: 'no',  label: 'Not featured' },
              ],
            },
          ]}
        />
      </Suspense>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={r => r.id}
        emptyText="No blogs match your filters."
        emptyHref="/admin/blogs/new"
        emptyLinkLabel="Create one"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        basePath="/admin/blogs"
        currentParams={currentParams}
      />
    </div>
  )
}
