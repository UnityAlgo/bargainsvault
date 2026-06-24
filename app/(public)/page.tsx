export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/lib/db'
import { blogs, stores, carouselImages, products, coupons } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import Carousel from '@/app/_components/Carousel'

export default async function HomePage() {
  const [featuredBlogs, allStores, carouselImgs, allProducts, allCoupons] = await Promise.all([
    db.select().from(blogs).where(eq(blogs.featured, true)).limit(6),
    db.select().from(stores).orderBy(asc(stores.sortOrder), asc(stores.name)).limit(12),
    db.select().from(carouselImages).orderBy(asc(carouselImages.sortOrder), asc(carouselImages.createdAt)),
    db.select().from(products).orderBy(asc(products.sortOrder), asc(products.createdAt)).limit(12),
    db.select().from(coupons).orderBy(asc(coupons.sortOrder), asc(coupons.createdAt)).limit(6),
  ])

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 space-y-10">

      {/* ── Page header ─────────────────────────── */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-text tracking-tight">Browse Our Resources</h1>
        <p className="text-muted text-sm mt-1">
          Exclusive coupons, verified discount codes, and deals from top stores.
        </p>
      </div>

      {/* ── Carousel ────────────────────────────── */}
      {carouselImgs.length > 0 && (
        <Carousel images={carouselImgs} />
      )}

      {/* ── Featured layout ─────────────────────── */}
      {(allStores.length > 0 || featuredBlogs.length > 0) && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 animate-fade-in-up delay-100">

          {/* Left: big featured card */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-56 bg-linear-to-br from-brand/10 via-brand-light to-tag-bg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `radial-gradient(circle, #3b0764 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative text-center px-8">
                <div className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  Updated daily
                </div>
                <h2 className="text-2xl font-bold text-text leading-tight">
                  Save big on your favourite stores
                </h2>
                <p className="text-muted text-sm mt-2">Verified codes, no expired deals.</p>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Top stores available</p>
                <p className="font-bold text-text mt-0.5">{allStores.length} store{allStores.length !== 1 ? 's' : ''} with active deals</p>
              </div>
              {allStores.length > 0 && (
                <Link
                  href={`/${allStores[0].slug}/view/vouchers`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-hover transition-colors duration-150"
                >
                  Browse Deals
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Right: stacked mini blog cards */}
          {featuredBlogs.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-sm font-bold text-text">Blogged Posts</h2>
                <Link href="/blog" className="text-xs text-brand font-semibold hover:underline">See all</Link>
              </div>
              {featuredBlogs.slice(0, 3).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group flex gap-3 bg-surface rounded-xl border border-border p-3 hover:border-brand/30 hover:shadow-sm transition-all duration-150"
                >
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-brand-light rounded-lg shrink-0 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand/40">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-text leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-[11px] text-muted mt-1.5">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Products ────────────────────────────── */}
      {allProducts.length > 0 && (
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text">Featured Products</h2>
          </div>
          <div className="stagger-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allProducts.map((product) => {
              const card = (
                <div className="flex flex-col items-center gap-2.5 p-4 bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 w-full">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center text-brand font-bold text-lg">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[11px] font-medium text-muted text-center leading-tight">
                    {product.name}
                  </span>
                  {product.price && (
                    <span className="text-[11px] font-bold text-brand text-center">
                      {product.price}
                    </span>
                  )}
                </div>
              )
              return product.linkUrl ? (
                <a
                  key={product.id}
                  href={product.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  {card}
                </a>
              ) : (
                <div key={product.id} className="flex flex-col items-center">
                  {card}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Latest Coupons ───────────────────────── */}
      {allCoupons.length > 0 && (
        <section className="animate-fade-in-up delay-250">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text">Latest Coupons</h2>
          </div>
          <div className="stagger-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-2 hover:border-brand/30 hover:shadow-sm transition-all duration-150"
              >
                <p className="font-semibold text-sm text-text line-clamp-2 leading-snug">{coupon.title}</p>
                {coupon.description && (
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">{coupon.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-1">
                  {coupon.type === 'copy' && coupon.code ? (
                    <span className="font-mono text-xs bg-tag-bg text-tag-text px-2.5 py-1 rounded-lg font-semibold tracking-wide">
                      {coupon.code}
                    </span>
                  ) : (
                    <span className="text-xs text-muted italic">Direct link</span>
                  )}
                  {coupon.expiresAt && (
                    <span className={`text-[10px] font-medium ${new Date(coupon.expiresAt) < new Date() ? 'text-red-400' : 'text-muted'}`}>
                      {new Date(coupon.expiresAt) < new Date() ? 'Expired' : `Expires ${new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Articles ────────────────────── */}
      {featuredBlogs.length > 0 && (
        <section className="animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text">Blogged Posts</h2>
            <Link href="/blog" className="text-xs text-brand font-semibold hover:underline">
              Browse all
            </Link>
          </div>
          <div className="stagger-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-surface rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {blog.featuredImage ? (
                  <div className="overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-linear-to-br from-brand-light to-tag-bg" />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-text text-sm group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed flex-1">{blog.excerpt}</p>
                  )}
                  <p className="text-[11px] text-muted/70 mt-3 font-medium">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
