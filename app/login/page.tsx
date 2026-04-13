import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login | BargainsVault',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-brand rounded-xl mb-4">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-white">
              <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M8 6.2V4.5M8 11.5v-1.7M5.5 8H3.5M12.5 8h-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">BargainsVault</h1>
          <p className="text-muted text-sm mt-0.5">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
