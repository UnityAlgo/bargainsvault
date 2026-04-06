import Link from 'next/link'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import DeleteButton from '@/app/_components/DeleteButton'
import { deleteStore } from '@/lib/actions/stores'

export default async function AdminStoresPage() {
  const allStores = await db.select().from(stores)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <Link
          href="/admin/stores/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          + New Store
        </Link>
      </div>

      {allStores.length === 0 ? (
        <div className="bg-white rounded-xl border border-purple-100 p-8 text-center text-gray-400">
          No stores yet.{' '}
          <Link href="/admin/stores/new" className="text-purple-600 hover:underline">
            Add your first store
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 text-purple-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Store</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {store.imageUrl ? (
                      <img src={store.imageUrl} alt={store.name} className="w-8 h-8 object-contain rounded-md" />
                    ) : (
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center text-purple-700 text-xs font-bold">
                        {store.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-800">{store.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <Link href={`/${store.slug}/view/vouchers`} target="_blank" className="hover:text-purple-600 hover:underline">
                      /{store.slug}/view/vouchers
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/stores/${store.id}/edit`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteStore.bind(null, store.id)}
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
