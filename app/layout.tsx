import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BargainsVault',
  description: 'Find the best coupons, deals, and discount codes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
