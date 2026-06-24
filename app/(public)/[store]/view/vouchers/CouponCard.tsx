'use client'

import { useState } from 'react'
import type { Coupon } from '@/lib/db/schema'

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!coupon.code) return
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()

  return (
    <div
      className={`
        bg-surface rounded-xl border transition-all duration-200
        ${isExpired
          ? 'opacity-50 border-border'
          : 'border-border hover:border-brand/30 hover:shadow-md hover:-translate-y-px'}
      `}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-text text-sm leading-snug">{coupon.title}</h3>
            {coupon.type === 'copy' && !isExpired && (
              <span className="text-[10px] font-bold tracking-wide uppercase bg-tag-bg text-tag-text px-2 py-0.5 rounded-full">
                Code
              </span>
            )}
            {coupon.type === 'link' && !isExpired && (
              <span className="text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                Deal
              </span>
            )}
          </div>

          {coupon.description && (
            <p className="text-xs text-muted mt-1 leading-relaxed">{coupon.description}</p>
          )}

          <div className="mt-2 text-xs">
            {isExpired ? (
              <span className="text-red-500 font-semibold">Expired</span>
            ) : coupon.expiresAt ? (
              <span className="text-muted flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-60">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Expires {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            ) : null}
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0">
          {coupon.type === 'copy' ? (
            !revealed ? (
              <button
                onClick={() => {
                  setRevealed(true)
                  if (coupon.code) {
                    navigator.clipboard.writeText(coupon.code).then(() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    })
                  }
                  if (coupon.linkUrl) {
                    window.open(coupon.linkUrl, '_blank', 'noopener,noreferrer')
                  }
                }}
                className="px-4 py-2 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-hover transition-colors duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Code
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-reveal-pop">
                <span className="font-mono bg-tag-bg border border-border text-tag-text px-3 py-2 rounded-lg text-xs font-bold tracking-widest">
                  {coupon.code || 'N/A'}
                </span>
                <button
                  onClick={handleCopy}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                    ${copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-brand text-white hover:bg-brand-hover hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copied
                    </span>
                  ) : 'Copy'}
                </button>
              </div>
            )
          ) : (
            <a
              href={coupon.linkUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-hover transition-colors duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Deal
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
