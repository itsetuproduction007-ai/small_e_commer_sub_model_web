import type { Metadata } from 'next'
import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata: Metadata = {
  title: {
    default: 'Rang E Renju — Handpicked Indian Textiles & Sarees',
    template: '%s | Rang E Renju',
  },
  description:
    'Shop handpicked sarees, kurtis, and Indian ethnic wear from Rang E Renju. Discover our curated collection of Sungudi, cotton, and zari weaves. Fast shipping across India.',
  keywords: ['sarees', 'Indian textiles', 'Sungudi saree', 'cotton saree', 'ethnic wear', 'Rang E Renju'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Rang E Renju',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  )
}
