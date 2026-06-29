import { getSettings, updateSettings } from '@/lib/actions/settings'

export default async function AdminSettingsPage() {
  const { showVouchers, showProducts } = await getSettings()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">UI Settings</h1>

      <form action={updateSettings} className="bg-white rounded-xl border border-purple-100 shadow-sm p-6 space-y-5 max-w-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="showVouchers"
            defaultChecked={showVouchers}
            className="mt-0.5 w-4 h-4 accent-purple-700"
          />
          <span>
            <span className="block text-sm font-medium text-gray-700">Show Vouchers</span>
            <span className="block text-xs text-gray-400 mt-0.5">
              Displays Browse Deals, Popular Stores, and Latest Coupons on the homepage.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="showProducts"
            defaultChecked={showProducts}
            className="mt-0.5 w-4 h-4 accent-purple-700"
          />
          <span>
            <span className="block text-sm font-medium text-gray-700">Show Products</span>
            <span className="block text-xs text-gray-400 mt-0.5">
              Displays the product section on the homepage.
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  )
}
