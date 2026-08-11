export default function StorySection() {
  const values = [
    { icon: '🧵', title: 'Made by hand', text: 'Weaving, draping and finishing done by skilled artisans.' },
    { icon: '🌏', title: 'Rooted in India', text: 'Sourced from looms and villages across the country.' },
    { icon: '🎨', title: 'Colour-led', text: 'Jewel tones, deep textures and threads that tell a story.' },
  ]
  return (
    <section className="story-section" aria-labelledby="story-heading" style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-subtle)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-10)', alignItems: 'center' }}>
        <div>
          <span className="page-hero-eyebrow">Our Story</span>
          <h2 id="story-heading" style={{ marginBottom: 'var(--space-4)', fontFamily: 'var(--font-display)' }}>
            Colours that tell stories, threads chosen with care
          </h2>
          <p>
            Rang E Renju began with a simple idea — find striking Indian textile pieces on
            Instagram and bring them to you, handpicked and verified. Today we help you shop
            that saree or set mundu you loved, quickly and safely, with personal service
            over WhatsApp.
          </p>
          <a
            className="btn btn-primary"
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            id="story-whatsapp-btn"
          >
            Chat With Us
          </a>
        </div>

        <ul className="story-values" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {values.map((v) => (
            <li key={v.title} className="story-value" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem', lineHeight: 1 }} aria-hidden="true">{v.icon}</span>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-1)' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
