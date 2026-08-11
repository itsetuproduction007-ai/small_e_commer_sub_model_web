import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { code } = await params
  try {
    const product = await prisma.product.findUnique({ where: { code: code.toUpperCase() } })
    if (!product) return { title: 'Product Not Found' }
    return {
      title: product.name,
      description: product.description || `Buy ${product.name} — ${formatPrice(product.price)}. Fast shipping across India.`,
    }
  } catch {
    return { title: code }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { code } = await params

  let product: {
    id: string; code: string; name: string; description: string | null;
    price: number; stock: number; images: string[]; instagramUrl: string | null;
    fabric: string | null; length: string | null; blousePiece: boolean;
  } | null = null

  let isDemo = false

  try {
    product = await prisma.product.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true, code: true, name: true, description: true,
        price: true, stock: true, images: true, instagramUrl: true,
        fabric: true, length: true, blousePiece: true,
      },
    })
  } catch {
    // DB not connected — show demo product for known codes
    const demo = DEMO_PRODUCTS.find(p => p.code === code.toUpperCase())
    if (demo) { product = demo; isDemo = true }
  }

  if (!product) return notFound()

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210'
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* (${product.code}) — priced at ${formatPrice(product.price)}. Is it available?`
  )
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${waMessage}`

  return (
    <>
      <Navbar />
      <main>
        <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-8)' }}>
            <ol style={{ display: 'flex', gap: 'var(--space-2)', listStyle: 'none', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/shop">Shop</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{product.name}</li>
            </ol>
          </nav>

          {isDemo && (
            <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
              <span>ℹ️</span>
              <span>Demo mode — database not connected. This is a sample product page.</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
            {/* Product Image */}
            <div>
              <div style={{
                aspectRatio: '3/4', background: 'linear-gradient(135deg, hsl(340,30%,95%), hsl(40,50%,93%))',
                borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative',
              }}>
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
                    color: 'var(--color-text-muted)',
                  }}>
                    <span style={{ fontSize: '4rem' }}>🧣</span>
                    <p style={{ fontSize: 'var(--text-sm)' }}>Product image coming soon</p>
                  </div>
                )}
              </div>

              {/* Instagram link */}
              {product.instagramUrl && (
                <a
                  href={product.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ marginTop: 'var(--space-4)', width: '100%' }}
                  id={`product-instagram-${product.code}`}
                >
                  📸 View original Instagram post
                </a>
              )}
            </div>

            {/* Product Info */}
            <div className="animate-fade-in">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div className="product-code-badge" style={{ marginBottom: 'var(--space-4)' }}>
                  <span>📌</span>
                  <span>{product.code}</span>
                </div>
                <h1 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>{product.name}</h1>
                <div style={{ fontSize: 'var(--text-4xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: 'var(--space-6)' }}>
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Stock status */}
              {product.stock > 0 ? (
                <div className="badge badge-delivered" style={{ marginBottom: 'var(--space-6)' }}>
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="badge badge-cancelled" style={{ marginBottom: 'var(--space-6)' }}>
                  Out of Stock
                </div>
              )}

              {/* Product Details */}
              {(product.fabric || product.length || product.blousePiece || product.description) && (
                <div className="card card-body" style={{ marginBottom: 'var(--space-6)' }}>
                  <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                    Product Details
                  </h2>
                  <dl style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {product.fabric && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <dt style={{ color: 'var(--color-text-muted)' }}>Fabric</dt>
                        <dd style={{ fontWeight: 500 }}>{product.fabric}</dd>
                      </div>
                    )}
                    {product.length && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <dt style={{ color: 'var(--color-text-muted)' }}>Length</dt>
                        <dd style={{ fontWeight: 500 }}>{product.length}</dd>
                      </div>
                    )}
                    {product.blousePiece && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <dt style={{ color: 'var(--color-text-muted)' }}>Blouse Piece</dt>
                        <dd style={{ fontWeight: 500, color: 'var(--color-success)' }}>✓ Included</dd>
                      </div>
                    )}
                  </dl>
                  {product.description && (
                    <>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-4) 0' }} />
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                        {product.description}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {product.stock > 0 ? (
                  <Link
                    href={`/checkout?product=${product.code}`}
                    className="btn btn-primary btn-lg btn-full"
                    id={`product-checkout-${product.code}`}
                  >
                    Buy Now — {formatPrice(product.price)}
                  </Link>
                ) : (
                  <button className="btn btn-outline btn-lg btn-full" disabled id={`product-soldout-${product.code}`}>
                    Sold Out
                  </button>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg btn-full"
                  id={`product-whatsapp-${product.code}`}
                >
                  💬 Ask on WhatsApp
                </a>
              </div>

              {/* Shipping note */}
              <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                🚚 Ships within 2–4 business days · Pan India delivery
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </>
  )
}

// Demo products for when DB is not connected
const DEMO_PRODUCTS = [
  {
    id: 'demo-1', code: 'RER-SAR-001', name: 'Sungudi Zari Checked Saree',
    description: 'A beautiful Sungudi saree with traditional zari checked pattern. Perfect for festive occasions.',
    price: 1299, stock: 5, images: [], instagramUrl: null,
    fabric: 'Soft cotton', length: '6.5m', blousePiece: true,
  },
  {
    id: 'demo-2', code: 'RER-SAR-002', name: 'Onam Special Kasavu Saree',
    description: 'Traditional Kerala Kasavu saree. Ideal for Onam celebrations and temple visits.',
    price: 1899, stock: 3, images: [], instagramUrl: null,
    fabric: 'Pure cotton', length: '6.2m', blousePiece: true,
  },
]
