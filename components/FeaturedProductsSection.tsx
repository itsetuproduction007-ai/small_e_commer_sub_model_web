import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

// Opt-in badges & discounts are code-keyed here (no DB schema change).
// Add the real product codes as products get imported.
const BADGES: Record<string, string> = {
  'RER-SAR-001': 'Best Seller',
  'RER-SAR-002': 'Limited Edition',
  'RER-KUR-002': 'Best Seller',
}

// Percent off per product code (festival offers).
const DISCOUNTS: Record<string, number> = {
  'RER-SAR-003': 20,
  'RER-KUR-001': 15,
}

// Placeholder image per category prefix when a product has no photo yet.
const PREFIX_IMAGE: Record<string, string> = {
  SAR: '/demo/saree_red.png',
  KUR: '/demo/kurta_blue.png',
  LEH: '/demo/saree_green.png',
  MEN: '/demo/dupatta_yellow.png',
  DUP: '/demo/dupatta_yellow.png',
}

interface ProductLite {
  code: string
  name: string
  price: number
  fabric: string | null
  blousePiece: boolean
  images: string[]
}

const DEMO_PRODUCTS: ProductLite[] = [
  {
    code: 'RER-SAR-001',
    name: 'Sungudi Zari Checked Saree',
    price: 1299,
    fabric: 'Soft cotton, 6.5m length',
    blousePiece: true,
    images: [],
  },
  {
    code: 'RER-SAR-002',
    name: 'Onam Special Kasavu Saree',
    price: 1899,
    fabric: 'Pure cotton, Kerala traditional',
    blousePiece: true,
    images: [],
  },
  {
    code: 'RER-SAR-003',
    name: 'Rose Pink Block Print Cotton',
    price: 999,
    fabric: 'Cotton, hand block print',
    blousePiece: false,
    images: [],
  },
  {
    code: 'RER-KUR-002',
    name: 'Kalamkari Floral Kurta',
    price: 1099,
    fabric: 'Cotton, South Indian hand paint',
    blousePiece: false,
    images: [],
  },
]

function categoryPrefix(code: string): string {
  return code.split('-')[1] ?? 'SAR'
}

async function getProducts(): Promise<ProductLite[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isPublished: true, isDraft: false },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        code: true,
        name: true,
        price: true,
        fabric: true,
        blousePiece: true,
        images: true,
      },
    })
    return rows.length ? rows : DEMO_PRODUCTS
  } catch {
    return DEMO_PRODUCTS
  }
}

export default async function FeaturedProductsSection() {
  const products = await getProducts()

  return (
    <section className="featured-products" aria-labelledby="featured-heading" style={{ padding: 'var(--space-16) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="page-hero-eyebrow">Most Loved</span>
          <h2 id="featured-heading" style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>
            Best Sellers &amp; Signature Pieces
          </h2>
          <p style={{ maxWidth: 480, margin: '0 auto', color: 'var(--color-text-secondary)' }}>
            The pieces our customers keep coming back for — with festive offers on select styles.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => {
            const badge = BADGES[product.code]
            const offPct = DISCOUNTS[product.code]
            const displayPrice = offPct
              ? Math.round((product.price * (100 - offPct)) / 100)
              : product.price
            const imageSrc =
              product.images[0] ??
              PREFIX_IMAGE[categoryPrefix(product.code)] ??
              '/demo/saree_red.png'

            return (
              <article key={product.code} className="product-card">
                <div className="product-card-image-wrap">
                  {badge && <span className="product-card-badge">{badge}</span>}
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-card-info">
                  <p className="product-card-name">{product.name}</p>
                  <p className="product-card-code" style={{ position: 'static', background: 'none', color: 'var(--color-text-muted)', padding: 0 }}>
                    {product.code}
                  </p>
                  {product.fabric && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{product.fabric}</p>
                  )}
                  <p className="product-card-price">
                    {formatPrice(displayPrice)}
                    {offPct && (
                      <span className="sale-strike" aria-label={`was ${formatPrice(product.price)}`}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                    {offPct && <span className="sale-tag">{offPct}% OFF</span>}
                  </p>
                </div>
                <div className="product-card-actions">
                  <Link href={`/product/${product.code}`} className="btn btn-primary btn-sm" style={{ flex: 1 }} id={`featured-buy-${product.code}`}>
                    Buy Now
                  </Link>
                  <Link href={`/product/${product.code}`} className="btn btn-ghost btn-sm" id={`featured-view-${product.code}`}>
                    View
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
          <Link href="/shop" className="btn btn-outline" id="featured-view-all-btn">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  )
}