import Link from 'next/link'
import type { Store } from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  action: (formData: FormData) => Promise<any>
  defaultValues?: Partial<Store>
}

export default function StoreForm({ action, defaultValues }: Props) {
  return (
    <form action={action} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. Amazon"
        />
        <p className="text-xs text-gray-400 mt-1">A URL slug will be generated automatically from the name.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo / Image URL</label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={defaultValues?.imageUrl ?? ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
        >
          Save
        </button>
        <Link
          href="/admin/stores"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
