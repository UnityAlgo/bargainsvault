'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Blog } from '@/lib/db/schema'
import TipTapEditor from './TipTapEditor'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any>
  defaultValues?: Partial<Blog>
}

export default function BlogForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [editorHTML, setEditorHTML] = useState(defaultValues?.content ?? '')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Inject the rich-text HTML into formData (hidden input may be stale)
    formData.set('content', editorHTML)

    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin/blogs')
        router.refresh()
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Row 1: Title ── */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-5 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={defaultValues?.title}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Blog post title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={defaultValues?.excerpt ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Short description shown in listings and as the meta description"
          />
        </div>
      </div>

      {/* ── Row 2: Rich text editor ── */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <TipTapEditor
          defaultValue={defaultValues?.content}
          onChange={html => setEditorHTML(html)}
        />
        {/* Hidden fallback — actual value is injected in handleSubmit */}
        <input type="hidden" name="content" value={editorHTML} readOnly />
      </div>

      {/* ── Row 3: SEO & Media ── */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm p-5 space-y-5">
        <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide">SEO & Media</h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Featured Image URL</label>
          <input
            name="featuredImage"
            type="url"
            defaultValue={defaultValues?.featuredImage ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-gray-400">Used as the Open Graph / social share image</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Meta Keywords
          </label>
          <input
            name="metaKeywords"
            defaultValue={defaultValues?.metaKeywords ?? ''}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="coupons, discount codes, deals, savings"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated keywords added to the page's &lt;meta keywords&gt; tag</p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={defaultValues?.featured ?? false}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 accent-purple-700"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Feature this post on the homepage
          </label>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pb-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : 'Save Post'}
        </button>
        <Link
          href="/admin/blogs"
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
