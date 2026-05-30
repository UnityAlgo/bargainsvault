import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <header className="bg-surface border-b border-border sticky top-0 z-50  py-4">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo.png" alt="" className='w-15' />
            <span className="font-bold text-text text-lg">
              BargainsVault
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-muted font-medium hover:text-text hover:bg-brand-light transition-all duration-150"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-lg text-muted font-medium hover:text-text hover:bg-brand-light transition-all duration-150"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand rounded flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-white">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </div>
            <span className="font-semibold text-text">BargainsVault</span>
          </div>
          <p>&copy; {new Date().getFullYear()} BargainsVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
