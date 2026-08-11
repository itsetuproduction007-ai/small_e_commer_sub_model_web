const TESTIMONIALS = [
  {
    quote:
      'Ordered a Sungudi saree after seeing it on their Instagram — the drapes were even more beautiful in person. True to the photos and quality was superb.',
    name: 'Priya N.',
    detail: 'Saree • Kerala',
  },
  {
    quote:
      'They customised the blouse piece for my wedding. Such patient, personal service over WhatsApp — it really felt made just for me.',
    name: 'Ananya S.',
    detail: 'Wedding Edit • Bengaluru',
  },
  {
    quote:
      'Fast shipping to my doorstep and the fabric was soft and rich. You can tell every piece is handpicked with care.',
    name: 'Meera R.',
    detail: 'Set Mundu • Chennai',
  },
]

function Stars() {
  return (
    <div aria-label="5 out of 5 stars" style={{ display: 'flex', gap: 'var(--space-1)' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" style={{ color: 'var(--color-brand-accent)', fontSize: 'var(--text-base)' }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="page-hero-eyebrow">Loved by Our Customers</span>
        <h2 id="testimonials-heading">What people say about Rang E Renju</h2>
        <p style={{ maxWidth: 480, margin: '0 auto var(--space-10)' }}>
          Real words from real customers — seen on our Instagram &amp; WhatsApp.
        </p>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="testimonial-card">
              <Stars />
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
