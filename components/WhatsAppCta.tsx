'use client'

import { useState, type FormEvent } from 'react'
import { generateWhatsAppUrl } from '@/lib/utils'

export default function WhatsAppCta() {
  const [phone, setPhone] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const message = `Hi Rang E Renju! Please notify me when new pieces arrive.`
    window.open(generateWhatsAppUrl('919876543210', message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="whatsapp-cta" aria-labelledby="whatsapp-cta-heading">
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <span className="page-hero-eyebrow">Never Miss a Drop</span>
        <h2 id="whatsapp-cta-heading">Join our WhatsApp circle</h2>
        <p>
          Share your number and we&apos;ll personally message you about new arrivals and
          pre-orders.
        </p>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 400, margin: 'var(--space-6) auto 0' }}>
          <input
            type="tel"
            className="form-input"
            placeholder="Your 10-digit number"
            aria-label="WhatsApp number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength={10}
            required
            pattern="[0-9]{10}"
            id="whatsapp-cta-input"
          />
          <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }} id="whatsapp-cta-submit">
            Notify Me
          </button>
        </form>
      </div>
    </section>
  )
}
