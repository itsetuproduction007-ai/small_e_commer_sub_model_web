import Link from 'next/link'
import { Menu, Search, ShoppingCart } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger Menu */}
          <div className="flex-1 flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-bold font-serif text-brand tracking-tight">
              Rang E Renju
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-2">
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-2 rounded-md text-gray-700 hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
