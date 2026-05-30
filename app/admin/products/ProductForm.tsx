import Link from 'next/link'
import type { Product } from '@/lib/db/schema'
import ImageUploadInput from '@/app/_components/ImageUploadInput'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any>
  defaultValues?: Partial<Product>
}

export default function ProductForm({ action, defaultValues }: Props) {
  return (
    <form action={action} encType="multipart/form-data" className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. Wireless Headphones"
        />
      </div>

      <ImageUploadInput label="Product Image" defaultValue={defaultValues?.imageUrl} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
        <input
          name="price"
          required
          defaultValue={defaultValues?.price}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g. $29.99"
        />
        <p className="text-xs text-gray-400 mt-1">Price is stored but not shown on the public home page.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
        >
          Save
        </button>
        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
