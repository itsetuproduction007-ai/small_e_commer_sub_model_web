'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Search } from 'lucide-react'

// Dummy data using the existing demo images
const MOCK_PRODUCTS = [
  { id: 1, title: 'Bengali Tart Checked Saree', price: '₹1,250', category: 'Sarees', image: '/demo/saree_red.png', code: 'RER-SAR-001' },
  { id: 2, title: 'Sungudi Cotton Saree', price: '₹1,150', category: 'Sarees', image: '/demo/saree_green.png', code: 'RER-SAR-002' },
  { id: 3, title: 'Zari Border Silk Blend', price: '₹1,850', category: 'Sarees', image: '/demo/saree_red.png', code: 'RER-SAR-003' },
  { id: 4, title: 'Kanjivaram Style Drape', price: '₹2,190', category: 'Sarees', image: '/demo/saree_green.png', code: 'RER-SAR-004' },
  { id: 5, title: 'Floral Print Kurti', price: '₹850', category: 'Kurtis', image: '/demo/kurta_blue.png', code: 'RER-KUR-001' },
  { id: 6, title: 'Embroidered Anarkali', price: '₹1,450', category: 'Kurtis', image: '/demo/dupatta_yellow.png', code: 'RER-KUR-002' },
]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('Sarees')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['Sarees', 'Kurtis', 'Lehengas', 'Dupattas']

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = p.category === activeCategory
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          
          {/* Header Area */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
              The Shop & Product Lookup
            </h1>
            <p className="text-brand font-medium text-lg">
              Bridging Instagram and the Web
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-brand focus:border-brand font-sans text-gray-900 placeholder-gray-400"
                placeholder="Search by product name or code (e.g. RER-SAR-001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors text-sm ${
                    activeCategory === cat 
                      ? 'bg-brand text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-red-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  imageSrc={product.image}
                  href={`/checkout?product=${product.code}`} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-sans">
              No products found matching your criteria.
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
