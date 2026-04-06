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
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-purple-800">BargainsVault</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
