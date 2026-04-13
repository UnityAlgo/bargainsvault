import type { Metadata } from 'next'
import { Syne, Outfit } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

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
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
