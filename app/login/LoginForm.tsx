'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3.5 py-3 text-xs font-medium">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-text mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm text-text placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/40 transition-all duration-150 bg-surface"
          placeholder="admin@bargainsvault.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-text mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm text-text placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/40 transition-all duration-150 bg-surface"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 bg-brand text-white rounded-lg font-semibold text-sm hover:bg-brand-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
