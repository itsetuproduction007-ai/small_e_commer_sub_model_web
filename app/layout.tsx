import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
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
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-background text-gray-900 antialiased min-h-screen">
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  )
}
