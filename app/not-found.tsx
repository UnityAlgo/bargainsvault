import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-purple-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-purple-800 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-purple-700 text-white rounded-full text-sm font-semibold hover:bg-purple-800 transition-colors"
      >
        Go back home
      </Link>
    </div>
  )
}
