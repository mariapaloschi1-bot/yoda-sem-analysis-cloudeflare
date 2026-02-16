import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yoda SEO Dashboard - Analisi Paid vs Organic',
  description: 'Dashboard SEO avanzata con DataForSEO e Gemini AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
