import Link from 'next/link'
import { createUser } from '@/lib/actions/users'

export default function NewUserPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New User</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <form action={createUser as any} className="bg-white rounded-xl border border-purple-100 shadow-sm p-5 space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Min 8 characters"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
          >
            Create User
          </button>
          <Link
            href="/admin/users"
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
