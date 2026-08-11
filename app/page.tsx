import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rang E Renju — Handpicked Indian Textiles & Sarees',
  description: 'Discover our curated collection of Sungudi, cotton, and zari weaves. Shop sarees and ethnic wear with easy UPI payment. Fast shipping across India.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="container" style={{ padding: 'var(--space-20) var(--space-6)' }}>
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
              <span className="page-hero-eyebrow">New Collection Available</span>
              <h1 id="hero-heading" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, hsl(340,70%,18%), hsl(340,65%,30%), hsl(35,80%,42%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Colours That Tell Stories
              </h1>
              <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
                Handpicked sarees and Indian ethnic wear. Each piece discovered on Instagram, each thread chosen with care.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/shop" className="btn btn-primary btn-lg" id="hero-shop-btn">
                  Shop the Collection
                </Link>
                <Link href="/track" className="btn btn-outline btn-lg" id="hero-track-btn">
                  Track My Order
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Journey Section */}
        <section aria-labelledby="instagram-heading" style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-subtle)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="page-hero-eyebrow">How It Works</span>
            <h2 id="instagram-heading" style={{ marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>
              From Instagram to Your Door
            </h2>
            <p style={{ marginBottom: 'var(--space-12)', maxWidth: 480, margin: '0 auto var(--space-12)' }}>
              Spot something beautiful on our Instagram? Here&apos;s how to make it yours.
            </p>

            <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-6)', textAlign: 'left' }}>
              {[
                { step: '01', icon: '📸', title: 'Discover on Instagram', desc: 'See a saree you love in our post or reel.' },
                { step: '02', icon: '🔍', title: 'Find the Product Code', desc: 'Note the code in the caption, e.g. RER-SAR-001.' },
                { step: '03', icon: '🛍️', title: 'Shop From Instagram', desc: 'Tap the bio link and find your exact product instantly.' },
                { step: '04', icon: '💳', title: 'Pay via UPI', desc: 'Easy UPI payment — no account needed.' },
                { step: '05', icon: '📦', title: 'Track Your Order', desc: 'Get a tracking link on WhatsApp. Follow every step.' },
              ].map((item) => (
                <div key={item.step} className="card card-body" style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)',
                    fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-accent-dark)',
                    fontFamily: 'monospace', letterSpacing: '0.08em',
                  }}>
                    {item.step}
                  </div>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-10)' }}>
              <Link href="/shop" className="btn btn-primary" id="how-it-works-shop-btn">
                Browse the Collection →
              </Link>
            </div>
          </div>
        </section>

        {/* Shop From Instagram CTA */}
        <section aria-labelledby="code-search-heading" style={{ padding: 'var(--space-16) 0' }}>
          <div className="container-narrow" style={{ textAlign: 'center' }}>
            <h2 id="code-search-heading" style={{ marginBottom: 'var(--space-4)' }}>
              Have a Product Code?
            </h2>
            <p style={{ marginBottom: 'var(--space-8)' }}>
              Enter the code from the Instagram caption to jump straight to the product.
            </p>
            <form action="/shop" method="get" style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 400, margin: '0 auto' }}>
              <input
                type="text"
                name="code"
                className="form-input"
                placeholder="e.g. RER-SAR-001"
                aria-label="Product code"
                id="homepage-code-input"
                style={{ fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn btn-accent" id="homepage-code-search-btn" style={{ whiteSpace: 'nowrap' }}>
                Find It →
              </button>
            </form>
          </div>
        </section>

        {/* Trust Signals */}
        <section aria-label="Trust signals" style={{ padding: 'var(--space-12) 0', background: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap', textAlign: 'center' }}>
              {[
                { icon: '🚚', label: 'Pan India Shipping' },
                { icon: '💎', label: 'Handpicked Quality' },
                { icon: '📱', label: 'WhatsApp Support' },
                { icon: '🔒', label: 'Secure UPI Payment' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
