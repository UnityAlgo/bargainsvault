'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'

const navItems = [
  { href: '/admin',                label: 'Dashboard',   exact: true,  indent: false },
  { href: '/admin/carousel',       label: 'Carousel',    exact: false, indent: false },
  { href: '/admin/products',       label: 'Products',    exact: false, indent: false },
  { href: '/admin/blogs',          label: 'Blogs',       exact: false, indent: false },
  { href: '/admin/stores',         label: 'Stores',         exact: false, indent: false },
  { href: '/admin/stores/sort',    label: '↕ Sort Stores',  exact: false, indent: true  },
  { href: '/admin/coupons',        label: 'Coupons',        exact: false, indent: false },
  { href: '/admin/coupons/sort',   label: '↕ Sort Coupons', exact: false, indent: true  },
  { href: '/admin/users',          label: 'Users',       exact: false, indent: false },
  { href: '/admin/settings',       label: 'UI Settings', exact: false, indent: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    if (href.endsWith('/sort')) return pathname === href
    // Parent links (Stores, Coupons) should not highlight when on their /sort sub-page
    return pathname.startsWith(href) && !pathname.startsWith(href + '/sort')
  }

  return (
    <aside className="w-56 bg-purple-900 text-white flex flex-col shrink-0 min-h-screen">
      <div className="px-6 py-5 border-b border-purple-800">
        <Link href="/admin" className="text-lg font-bold hover:text-purple-200 transition-colors">
          BargainsVault
        </Link>
        <p className="text-xs text-purple-400 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        {navItems.map(({ href, label, exact, indent }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${indent ? 'ml-3 text-[13px]' : ''} ${
              isActive(href, exact)
                ? 'bg-purple-700 text-white font-semibold'
                : 'text-purple-200 hover:bg-purple-800 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-purple-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-purple-800 hover:text-white transition-colors mb-1"
        >
          View Site ↗
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-purple-800 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
