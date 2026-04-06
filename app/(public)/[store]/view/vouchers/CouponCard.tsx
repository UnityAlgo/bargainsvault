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
    <div className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${isExpired ? 'opacity-60' : 'border-purple-100 hover:border-purple-300 hover:shadow-md'}`}>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{coupon.title}</h3>
        {coupon.description && (
          <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          {isExpired && (
            <span className="text-red-400 font-medium">Expired</span>
          )}
          {coupon.expiresAt && !isExpired && (
            <span>
              Expires {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {coupon.type === 'copy' ? (
          !revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Reveal Code
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-mono bg-purple-50 border border-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-semibold tracking-widest">
                {coupon.code || 'N/A'}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )
        ) : (
          <a
            href={coupon.linkUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-block"
          >
            Get Deal →
          </a>
        )}
      </div>
    </div>
  )
}
