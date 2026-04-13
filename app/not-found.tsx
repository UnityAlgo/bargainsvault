import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in-up">
        <p className="text-8xl font-extrabold text-border select-none mb-4">404</p>
        <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M21 21l-4.35-4.35M11 8v3M11 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text mb-2">Page not found</h1>
        <p className="text-sm text-muted mb-8 max-w-xs mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors duration-150"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M7 11l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go back home
        </Link>
      </div>
    </div>
  )
}
