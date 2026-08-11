import Image from 'next/image'
import Link from 'next/link'

const LOOKS = [
  {
    image: '/demo/saree_red.png',
    title: 'The Wedding Edit',
    subtitle: 'Bridal silks & gold zari',
    href: '/shop?category=SAR',
  },
  {
    image: '/demo/kurta_blue.png',
    title: 'The Onam Edit',
    subtitle: 'Kasavu & festive cotton',
    href: '/shop?category=KUR',
  },
  {
    image: '/demo/dupatta_yellow.png',
    title: 'The Daily Drape',
    subtitle: 'Everyday comfort weaves',
    href: '/shop',
  },
]

export default function LookbookSection() {
  return (
    <section className="lookbook" aria-labelledby="lookbook-heading" style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="page-hero-eyebrow">Seasonal Lookbook</span>
          <h2 id="lookbook-heading" style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>
            Curated Edits for Every Occasion
          </h2>
          <p style={{ maxWidth: 480, margin: '0 auto', color: 'var(--color-text-secondary)' }}>
            Wedding season, festivals or everyday — we&apos;ve styled the collections for you.
          </p>
        </div>

        <div className="lookbook-grid">
          {LOOKS.map((look) => (
            <Link key={look.title} href={look.href} className="lookbook-card" id={`lookbook-${look.title.replace(/\s/g, '-').toLowerCase()}`}>
              <Image src={look.image} alt={look.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
              <div className="lookbook-overlay" aria-hidden="true" />
              <div className="lookbook-caption">
                <h3>{look.title}</h3>
                <p>{look.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}