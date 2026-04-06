import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-purple-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-purple-200 transition-colors">
            BargainsVault
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-purple-200 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-purple-200 transition-colors">Blog</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-purple-900 text-purple-200 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} BargainsVault. All rights reserved.</p>
      </footer>
    </div>
  )
}
