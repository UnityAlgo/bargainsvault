import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = any> {
  header: string
  headerClassName?: string
  cell: (row: T) => React.ReactNode
  cellClassName?: string
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  getKey: (row: T) => string | number
  emptyText?: string
  emptyHref?: string
  emptyLinkLabel?: string
}

export default function DataTable<T>({
  columns,
  rows,
  getKey,
  emptyText = 'No items found.',
  emptyHref,
  emptyLinkLabel,
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-purple-100 p-10 text-center text-gray-400 text-sm">
        {emptyText}
        {emptyHref && emptyLinkLabel && (
          <> <Link href={emptyHref} className="text-purple-600 hover:underline">{emptyLinkLabel}</Link></>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-purple-50 text-purple-800 text-left">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 font-semibold whitespace-nowrap ${col.headerClassName ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(row => (
            <tr key={getKey(row)} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-4 py-3 ${col.cellClassName ?? ''}`}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
