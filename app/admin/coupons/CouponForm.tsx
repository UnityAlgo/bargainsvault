'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Coupon, Store } from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  action: (formData: FormData) => Promise<any>
  defaultValues?: Partial<Coupon>
  stores: Store[]
}

export default function CouponForm({ action, defaultValues, stores }: Props) {
  const [type, setType] = useState<'copy' | 'link'>(defaultValues?.type ?? 'copy')

  return (
    <form action={action} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
        <select
          name="storeId"
          required
          defaultValue={defaultValues?.storeId ?? ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="" disabled>Select a store…</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. 20% off your first order"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          name="description"
          defaultValue={defaultValues?.description ?? ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Optional extra details"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <select
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as 'copy' | 'link')}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="copy">Copy Code (hidden until revealed)</option>
          <option value="link">Direct Link (redirects to offer)</option>
        </select>
      </div>

      {type === 'copy' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            name="code"
            defaultValue={defaultValues?.code ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="SAVE20"
          />
        </div>
      )}

      {type === 'copy' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Redirect URL</label>
          <input
            name="linkUrl"
            type="url"
            defaultValue={defaultValues?.linkUrl ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://store.com"
          />
          <p className="text-xs text-gray-400 mt-1">When clicked, code is auto-copied and user is redirected here.</p>
        </div>
      )}

      {type === 'link' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Offer URL</label>
          <input
            name="linkUrl"
            type="url"
            defaultValue={defaultValues?.linkUrl ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://store.com/special-offer"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
        <input
          name="expiresAt"
          type="date"
          defaultValue={defaultValues?.expiresAt ? new Date(defaultValues.expiresAt).toISOString().split('T')[0] : ''}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          href="/admin/coupons"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
