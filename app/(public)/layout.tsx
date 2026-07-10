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
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand + description */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-brand rounded flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-white">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
                <span className="font-semibold text-text">BargainsVault</span>
              </div>
              <p className="text-xs text-muted leading-relaxed max-w-md">
                Bargains Vault simplifies the process by offering informative, SEO-optimized blogs that help readers make smarter purchasing decisions.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold text-text mb-3 uppercase tracking-wide">Contact</h3>
              <a
                href="mailto:connect.bargainsvault@gmail.com"
                className="text-xs text-muted hover:text-brand transition-colors duration-150"
              >
                connect.bargainsvault@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-xs text-muted text-center">
            &copy; {new Date().getFullYear()} BargainsVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
