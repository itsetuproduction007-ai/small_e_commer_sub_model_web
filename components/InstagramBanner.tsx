const IG_PROFILE_URL = 'https://www.instagram.com/rang_e_renju/'

export default function InstagramBanner() {
  return (
    <section className="instagram-banner" aria-labelledby="instagram-banner-heading">
      <div className="container instagram-banner-inner">
        <div>
          <h2 id="instagram-banner-heading">Follow the colour on Instagram</h2>
          <p>
            New drops, behind-the-scenes, and pieces you won&apos;t find anywhere else —
            posted daily at <strong>@rang_e_renju</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <a
            href={IG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            id="instagram-follow-btn"
          >
            📸 Follow @rang_e_renju
          </a>
          <a
            href="/shop"
            className="btn btn-outline"
            id="instagram-shop-btn"
          >
            Shop the Feed
          </a>
        </div>
      </div>
    </section>
  )
}
