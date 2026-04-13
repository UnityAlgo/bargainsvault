import Link from 'next/link'

interface Props {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  basePath: string
  currentParams: Record<string, string>
}

function buildUrl(basePath: string, params: Record<string, string>, targetPage: number) {
  const p = new URLSearchParams(params)
  if (targetPage <= 1) {
    p.delete('page')
  } else {
    p.set('page', String(targetPage))
  }
  const qs = p.toString()
  return `${basePath}${qs ? `?${qs}` : ''}`
}

export default function Pagination({ page, totalPages, totalItems, pageSize, basePath, currentParams }: Props) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, totalItems)

  // Build visible page numbers: always show first, last, and up to 5 around current
  const pages: (number | 'gap')[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  const btnBase = 'inline-flex items-center justify-center min-w-[34px] h-[34px] px-2 text-sm rounded-lg transition-colors font-medium'
  const btnActive = 'bg-purple-700 text-white shadow-sm'
  const btnInactive = 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200'
  const btnDisabled = 'text-gray-300 border border-gray-100 cursor-not-allowed pointer-events-none'

  return (
    <div className="flex items-center justify-between px-1 pt-4">
      {/* Info */}
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalItems.toLocaleString()}</span>
      </p>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        {page <= 1 ? (
          <span className={`${btnBase} ${btnDisabled}`}>←</span>
        ) : (
          <Link href={buildUrl(basePath, currentParams, page - 1)} className={`${btnBase} ${btnInactive}`}>←</Link>
        )}

        {pages.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-gray-400 text-sm">…</span>
          ) : (
            <Link
              key={p}
              href={buildUrl(basePath, currentParams, p)}
              className={`${btnBase} ${p === page ? btnActive : btnInactive}`}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {page >= totalPages ? (
          <span className={`${btnBase} ${btnDisabled}`}>→</span>
        ) : (
          <Link href={buildUrl(basePath, currentParams, page + 1)} className={`${btnBase} ${btnInactive}`}>→</Link>
        )}
      </div>
    </div>
  )
}
