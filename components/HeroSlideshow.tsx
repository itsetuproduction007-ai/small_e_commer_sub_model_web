'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SLIDES = [
  {
    id: 'festive',
    image: '/demo/saree_red.png',
    eyebrow: 'New Collection Available',
    title: 'The Wedding Season Edit',
    subtitle:
      'Rich silks, gold zari and bridal-ready drapes — handpicked for your most special days.',
    cta: { label: 'Shop the Edit', href: '/shop?category=SAR' },
  },
  {
    id: 'festival',
    image: '/demo/saree_green.png',
    eyebrow: 'Celebrate the Season',
    title: 'Onam & Diwali Collection',
    subtitle:
      'Kasavu, kanjivaram and festive cotton weaves to mark every festival in style.',
    cta: { label: 'Shop Festive', href: '/shop' },
  },
  {
    id: 'handpicked',
    image: '/demo/dupatta_yellow.png',
    eyebrow: 'Colours That Tell Stories',
    title: 'Handpicked, Not Mass-Produced',
    subtitle:
      'Every piece discovered on Instagram, every thread chosen with care and craft.',
    cta: { label: 'Browse All', href: '/shop' },
  },
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => clearInterval(id)
  }, [total])

  const slide = SLIDES[index]

  return (
    <section className="hero-section" aria-roledescription="carousel" aria-label="Featured collections">
      <div className="hero-slide" key={slide.id} aria-hidden={false}>
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-slide-overlay" aria-hidden="true" />
        <div className="container hero-slide-content">
          <span className="page-hero-eyebrow">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={slide.cta.href} className="btn btn-accent btn-lg" id="hero-slide-cta">
              {slide.cta.label}
            </Link>
            <Link href="/track" className="btn btn-outline btn-lg" id="hero-track-btn">
              Track My Order
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-dots" role="tablist" aria-label="Choose slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hero-dot${i === index ? ' is-active' : ''}`}
            aria-label={`Show slide: ${s.title}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
