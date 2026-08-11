import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// The store's public Instagram profile (used by the "Loved by Our Customers" callout)
const IG_PROFILE_URL = 'https://www.instagram.com/rang_e_renju/'

// Category tiles: label, subtext, shop filter code and a demo image.
// Images are placeholders from /public/demo until real catalogue photos exist.
const TILES = [
  {
    id: 'saree',
    label: 'Sarees',
    subtext: 'Sungudi, cotton, kanjivaram & zari weaves',
    href: '/shop?category=SAR',
    image: '/demo/saree_red.png',
    alt: 'Red saree draped fabric on a dark background',
  },
  {
    id: 'kurta',
    label: 'Kurtas & Kurtis',
    subtext: 'Hand-block & kalamkari everyday wear',
    href: '/shop?category=KUR',
    image: '/demo/kurta_blue.png',
    alt: 'Blue kurta fabric with print',
  },
  {
    id: 'lehenga',
    label: 'Lehengas',
    subtext: 'Bridal & festive celebration sets',
    href: '/shop?category=LEH',
    image: '/demo/saree_green.png',
    alt: 'Green festive fabric draping',
  },
  {
    id: 'men',
    label: 'Men&apos;s Ethnic',
    subtext: 'Set mundu, shirts & festive wear',
    href: '/shop?category=MEN',
    image: '/demo/dupatta_yellow.png',
    alt: 'Yellow traditional fabric',
  },
  {
    id: 'dupatta',
    label: 'Dupattas & Accessories',
    subtext: 'Finishing touches for every outfit',
    href: '/shop?category=DUP',
    image: '/demo/dupatta_yellow.png',
    alt: 'Traditional yellow dupatta fabric',
  },
]

// Maps each tile id to its product-code prefix (used for the optional live count).
const PREFIX_BY_ID: Record<string, string> = {
  saree: 'SAR',
  kurta: 'KUR',
  lehenga: 'LEH',
  men: 'MEN',
  dupatta: 'DUP',
}

const CALLOUTS = [
  {
    icon: '📦',
    headline: 'Pre-Orders Welcome',
    body: 'Some pieces are made or sourced just for you. Dispatch timelines are noted on each product page.',
  },
  {
    icon: '🎨',
    headline: 'Made Your Way',
    body: 'Want a different border, blouse, or fit? DM us on Instagram — many pieces can be customised.',
  },
  {
    icon: '❤️',
    headline: 'Loved by Our Customers',
    body: 'See what real customers are saying — check our Reviews highlight on Instagram.',
    href: IG_PROFILE_URL,
  },
]

export default async function CategorySection() {
  // Optional live item counts from the product catalogue.
  // Gracefully degrades (counts hidden) when the DB isn't available.
  const counts: Record<string, number> = {}
  try {
    const results = await Promise.all(
      Object.entries(PREFIX_BY_ID).map(([id, prefix]) =>
        prisma.product
          .count({
            where: { code: { startsWith: `RER-${prefix}` }, isPublished: true, isDraft: false },
          })
          .then((n) => ({ id, n }) as { id: string; n: number })
      )
    )
    for (const r of results) counts[r.id] = r.n
  } catch {
    // DB unavailable — render tiles without counts.
  }

  return (
    <section aria-labelledby="category-heading" className="category-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <span className="page-hero-eyebrow">Browse By Style</span>
          <h2 id="category-heading" style={{ marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>
            Shop by Category
          </h2>
          <p style={{ maxWidth: 480, margin: '0 auto', color: 'var(--color-text-secondary)' }}>
            Prefer to browse instead of hunting for a code? Start here.
          </p>
        </div>

        {/* Image tiles */}
        <div className="category-tiles" role="list">
          {TILES.map((tile) => {
            const count = counts[tile.id] ?? 0
            return (
              <Link
                key={tile.id}
                href={tile.href}
                className="category-tile"
                role="listitem"
                aria-label={`${tile.label} — ${tile.subtext}`}
                id={`category-tile-${tile.id}`}
              >
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="category-tile-overlay" aria-hidden="true" />
                <div className="category-tile-body">
                  <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <span className="category-tile-label">{tile.label}</span>
                    {count > 0 && <span className="category-tile-count">{count} {count === 1 ? 'piece' : 'pieces'}</span>}
                  </div>
                  <p className="category-tile-sub">{tile.subtext}</p>
                  <span className="category-tile-cta">Shop the collection →</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Callouts */}
        <div className="category-callouts" style={{ marginTop: 'var(--space-12)' }}>
          {CALLOUTS.map((c) => {
            const inner = (
              <>
                <div style={{ fontSize: '1.75rem', lineHeight: 1 }} aria-hidden="true">{c.icon}</div>
                <h3 className="category-callout-heading">{c.headline}</h3>
                <p className="category-callout-body">{c.body}</p>
              </>
            )
            return c.href ? (
              <a
                key={c.headline}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="category-callout"
                id="category-callout-instagram"
              >
                {inner}
              </a>
            ) : (
              <div key={c.headline} className="category-callout">
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
