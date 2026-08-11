import Link from 'next/link'

export default function HeritageBanner() {
  return (
    <section className="heritage-banner" aria-labelledby="heritage-heading">
      <div className="container">
        <span className="page-hero-eyebrow" style={{ color: 'var(--color-brand-accent-light)' }}>
          Our Heritage
        </span>
        <h2 id="heritage-heading">
          Rooted in the looms of Varanasi, Kanchipuram &amp; Jaipur
        </h2>
        <p>
          Every drape we handpick carries a weaver&apos;s story — of sungudi villages in
          Tamil Nadu, kasavu households in Kerala, and generations of Indian handloom.
          When you wear Rang E Renju, you carry that tradition with you.
        </p>
        <Link href="/shop" className="btn btn-accent" id="heritage-shop-btn">
          Explore the Craft
        </Link>
      </div>
    </section>
  )
}
