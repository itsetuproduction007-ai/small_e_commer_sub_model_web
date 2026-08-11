import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop From Instagram',
  description: 'Browse our complete collection of handpicked Indian sarees and ethnic wear. Find products by code, discover new arrivals.',
}

interface ShopPageProps {
  searchParams: Promise<{ code?: string; category?: string; q?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const { code, category, q } = params

  // Build the where clause for Prisma
  const where = {
    isPublished: true,
    isDraft: false,
    ...(code ? { code: { equals: code.toUpperCase() } } : {}),
    ...(category ? { code: { startsWith: `RER-${category.toUpperCase()}` } } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
  }

  let products: {
    id: string
    code: string
    name: string
    price: number
    stock: number
    images: string[]
    fabric: string | null
    blousePiece: boolean
  }[] = []

  let dbError = false

  try {
    products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        name: true,
        price: true,
        stock: true,
        images: true,
        fabric: true,
        blousePiece: true,
      },
    })
  } catch {
    dbError = true
    // Show demo products if DB is not configured
    products = DEMO_PRODUCTS
  }

  const searchTerm = code || q || ''
  const isFiltered = !!(code || category || q)

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="page-hero" aria-labelledby="shop-heading">
          <div className="container">
            <span className="page-hero-eyebrow">Rang E Renju Collection</span>
            <h1 id="shop-heading">Shop From Instagram</h1>
            <p>Every product you&apos;ve seen on our Instagram, all in one place.</p>
          </div>
        </section>

        {/* Search / Filter Bar */}
        <div style={{ background: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-5) 0' }} id="search">
          <div className="container">
            <form method="get" action="/shop" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <input
                type="text"
                name="q"
                className="form-input"
                placeholder="Search by name..."
                defaultValue={q || ''}
                aria-label="Search products"
                id="shop-search-input"
                style={{ flex: 1, minWidth: 180 }}
              />
              <input
                type="text"
                name="code"
                className="form-input"
                placeholder="Product code (e.g. RER-SAR-001)"
                defaultValue={code || ''}
                aria-label="Product code"
                id="shop-code-input"
                style={{ flex: 1, minWidth: 200, fontFamily: 'monospace', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn btn-primary" id="shop-search-btn">Search</button>
              {isFiltered && (
                <Link href="/shop" className="btn btn-ghost" id="shop-clear-btn">Clear</Link>
              )}
            </form>
          </div>
        </div>

        <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
          {dbError && (
            <div className="alert alert-warning" style={{ marginBottom: 'var(--space-8)' }}>
              <span>⚠️</span>
              <span>Database not connected. Showing demo products. Set your <code>DATABASE_URL</code> in <code>.env.local</code> to get started.</span>
            </div>
          )}

          {/* Results summary */}
          {isFiltered && (
            <p className="text-muted text-sm mb-6">
              {products.length === 0
                ? `No products found${searchTerm ? ` for "${searchTerm}"` : ''}.`
                : `${products.length} product${products.length === 1 ? '' : 's'} found${searchTerm ? ` for "${searchTerm}"` : ''}.`
              }
            </p>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="product-grid stagger-children" aria-label="Product catalogue">
              {products.map((product) => (
                <article key={product.id} className="card card-hover product-card" aria-label={product.name}>
                  <div className="product-card-image-wrap">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} loading="lazy" />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, hsl(340,30%,95%), hsl(40,50%,93%))',
                        color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', textAlign: 'center', padding: 'var(--space-4)',
                      }}>
                        <span>No image yet</span>
                      </div>
                    )}
                    {product.stock <= 3 && product.stock > 0 && (
                      <span className="product-card-badge">Only {product.stock} left!</span>
                    )}
                    {product.stock === 0 && (
                      <span className="product-card-badge" style={{ background: 'var(--color-text-muted)', color: 'white' }}>Sold Out</span>
                    )}
                    <span className="product-card-code">{product.code}</span>
                  </div>
                  <div className="product-card-info">
                    <p className="product-card-name">{product.name}</p>
                    {product.fabric && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{product.fabric}</p>
                    )}
                    {product.blousePiece && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-accent-dark)', fontWeight: 600 }}>✓ Blouse piece included</p>
                    )}
                    <p className="product-card-price">{formatPrice(product.price)}</p>
                  </div>
                  <div className="product-card-actions">
                    {product.stock > 0 ? (
                      <>
                        <Link
                          href={`/product/${product.code}`}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          id={`product-buy-${product.code}`}
                        >
                          Buy Now
                        </Link>
                        <Link
                          href={`/product/${product.code}`}
                          className="btn btn-ghost btn-sm"
                          id={`product-view-${product.code}`}
                        >
                          View
                        </Link>
                      </>
                    ) : (
                      <button className="btn btn-ghost btn-sm" disabled style={{ flex: 1 }}>
                        Sold Out
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)' }}>No products found</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
                Try a different search term or browse the full catalogue.
              </p>
              <Link href="/shop" className="btn btn-primary" id="shop-browse-all-btn">Browse All Products</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// Demo products shown when DB is not connected
const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    code: 'RER-SAR-001',
    name: 'Sungudi Zari Checked Saree',
    price: 1299,
    stock: 5,
    images: [],
    fabric: 'Soft cotton, 6.5m length',
    blousePiece: true,
  },
  {
    id: 'demo-2',
    code: 'RER-SAR-002',
    name: 'Onam Special Kasavu Saree',
    price: 1899,
    stock: 3,
    images: [],
    fabric: 'Pure cotton, Kerala traditional',
    blousePiece: true,
  },
  {
    id: 'demo-3',
    code: 'RER-SAR-003',
    name: 'Rose Pink Block Print Cotton',
    price: 999,
    stock: 8,
    images: [],
    fabric: 'Cotton, hand block print',
    blousePiece: false,
  },
  {
    id: 'demo-4',
    code: 'RER-KUR-001',
    name: 'Indigo Ajrakh Kurta',
    price: 799,
    stock: 0,
    images: [],
    fabric: 'Cotton, ajrakh print',
    blousePiece: false,
  },
]
