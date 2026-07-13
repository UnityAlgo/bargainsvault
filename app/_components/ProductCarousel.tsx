import Link from 'next/link'
import type { Product } from '@/lib/db/schema'

export default function ProductCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <div className="overflow-x-auto -mx-5 px-5 pb-3 scrollbar-hide">
      <div className="flex gap-3" style={{ width: 'max-content' }}>
        {products.map((product) => {
          const card = (
            <div className="w-36 h-52 flex flex-col items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shrink-0">
              <div className="w-full h-24 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-brand-light rounded-lg flex items-center justify-center text-brand font-bold text-xl">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="w-full text-center">
                <p className="text-[11px] font-medium text-muted leading-tight line-clamp-2">{product.name}</p>
                {product.price && (
                  <p className="text-[12px] font-bold text-brand mt-1">{product.price}</p>
                )}
              </div>
            </div>
          )

          return product.linkUrl ? (
            <a
              key={product.id}
              href={product.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {card}
            </a>
          ) : (
            <div key={product.id}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}
