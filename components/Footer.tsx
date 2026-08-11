import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="flex justify-between" style={{ flexWrap: 'wrap', gap: 'var(--space-8)' }}>
          <div>
            <div className="footer-brand">Rang E Renju</div>
            <p className="footer-tagline">Handpicked Indian Textiles &amp; Sarees</p>
            <p className="text-sm text-muted mt-4" style={{ maxWidth: 320 }}>
              Curated collection of Sungudi, cotton, and zari weaves.
              Shipped with care across India.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                Shop
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <li><Link href="/shop" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>All Products</Link></li>
                <li><Link href="/shop?category=SAR" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Sarees</Link></li>
                <li><Link href="/shop?category=KUR" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Kurtis</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                Help
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <li><Link href="/track" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Track Order</Link></li>
                <li>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                  >
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Rang E Renju. All rights reserved.
          </p>
          <p className="footer-copy">
            Seen something you love? DM us on Instagram.
          </p>
        </div>
      </div>
    </footer>
  )
}
