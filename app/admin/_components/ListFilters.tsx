'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition, useRef, useEffect } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDef {
  key: string
  label: string
  options: FilterOption[]
}

export interface TextFilterDef {
  key: string
  label: string
  placeholder?: string
}

export interface DateRangeFilterDef {
  fromKey: string
  toKey: string
  label: string
}

interface Props {
  filters?: FilterDef[]
  textFilters?: TextFilterDef[]
  dateRangeFilter?: DateRangeFilterDef
  searchPlaceholder?: string
  totalItems: number
}

export default function ListFilters({ filters = [], textFilters = [], dateRangeFilter, searchPlaceholder = 'Search…', totalItems }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentQ = searchParams.get('q') ?? ''

  function buildUrl(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') {
        params.delete(k)
      } else {
        params.set(k, v)
      }
    }
    // Reset to page 1 whenever filters change
    params.delete('page')
    const qs = params.toString()
    return `${pathname}${qs ? `?${qs}` : ''}`
  }

  function navigate(updates: Record<string, string | null>) {
    startTransition(() => router.replace(buildUrl(updates)))
  }

  // Debounced search
  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate({ q: value })
    }, 350)
  }

  // Debounced text filter (e.g. Code)
  function handleTextFilter(key: string, value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate({ [key]: value })
    }, 350)
  }

  // Cleanup debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const hasActiveFilters =
    currentQ ||
    filters.some(f => searchParams.has(f.key)) ||
    textFilters.some(f => searchParams.has(f.key)) ||
    (dateRangeFilter && (searchParams.has(dateRangeFilter.fromKey) || searchParams.has(dateRangeFilter.toKey)))

  function clearAll() {
    startTransition(() => router.replace(pathname))
  }

  return (
    <div className="bg-white rounded-xl border border-purple-100 shadow-sm px-4 py-3 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            width="14" height="14" viewBox="0 0 20 20" fill="currentColor"
          >
            <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z" clipRule="evenodd" />
          </svg>
          <input
            type="search"
            defaultValue={currentQ}
            onChange={e => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {isPending && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Dropdown filters */}
        {filters.map(filter => (
          <div key={filter.key} className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {filter.label}:
            </label>
            <select
              value={searchParams.get(filter.key) ?? ''}
              onChange={e => navigate({ [filter.key]: e.target.value })}
              className="text-sm border border-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">All</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Text filters */}
        {textFilters.map(filter => (
          <div key={filter.key} className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {filter.label}:
            </label>
            <input
              type="text"
              defaultValue={searchParams.get(filter.key) ?? ''}
              onChange={e => handleTextFilter(filter.key, e.target.value)}
              placeholder={filter.placeholder}
              className="text-sm border border-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
        ))}

        {/* Date range filter */}
        {dateRangeFilter && (
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {dateRangeFilter.label}:
            </label>
            <input
              type="date"
              value={searchParams.get(dateRangeFilter.fromKey) ?? ''}
              onChange={e => navigate({ [dateRangeFilter.fromKey]: e.target.value })}
              className="text-sm border border-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={searchParams.get(dateRangeFilter.toKey) ?? ''}
              onChange={e => navigate({ [dateRangeFilter.toKey]: e.target.value })}
              className="text-sm border border-gray-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
        )}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2.5 py-2 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
          >
            ✕ Clear filters
          </button>
        )}

        {/* Total count */}
        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
          {totalItems.toLocaleString()} {totalItems === 1 ? 'result' : 'results'}
        </span>
      </div>
    </div>
  )
}
