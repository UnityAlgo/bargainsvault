import Link from 'next/link'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteProduct } from '@/lib/actions/products'
import DataTable, { type Column } from '../_components/DataTable'

export default async function AdminProductsPage() {
  const rows = await db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.createdAt))

  type Row = typeof rows[number]

  const columns: Column<Row>[] = [
    {
      header: 'Product',
      cell: row => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.name} className="w-10 h-10 object-contain rounded-lg shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-xs font-bold shrink-0">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Price',
      headerClassName: 'w-32',
      cellClassName: 'w-32',
      cell: row => <span className="text-sm font-semibold text-gray-700">{row.price}</span>,
    },
    {
      header: 'Actions',
      headerClassName: 'text-right w-28',
      cellClassName: 'text-right',
      cell: row => (
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/products/${row.id}/edit`} className="text-purple-600 hover:text-purple-800 font-medium">
            Edit
          </Link>
          <DeleteButton action={deleteProduct.bind(null, row.id)} label="Delete" />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New Product
        </Link>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        getKey={r => r.id}
        emptyText="No products yet."
        emptyHref="/admin/products/new"
        emptyLinkLabel="Add one"
      />
    </div>
  )
}
