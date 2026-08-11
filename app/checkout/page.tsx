'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────
interface ProductInfo {
  code: string
  name: string
  price: number
  stock: number
  fabric?: string | null
}

type CheckoutStep = 'details' | 'payment' | 'confirm'

interface FormState {
  error?: string
  success?: boolean
  orderCode?: string
  trackingToken?: string
}

// ── Main Component ─────────────────────────────────────────────────────────
function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productCode = searchParams.get('product')?.toUpperCase() || ''

  const [step, setStep] = useState<CheckoutStep>('details')
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '', pincode: '', city: '', state: '',
  })
  const [upiRef, setUpiRef] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderCode: string; trackingToken: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch product info
  useEffect(() => {
    if (!productCode) { setLoadingProduct(false); return }
    fetch(`/api/products/${productCode}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoadingProduct(false) })
      .catch(() => setLoadingProduct(false))
  }, [productCode])

  const handleDetailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError('Please fill in all required fields.'); return
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.'); return
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode.'); return
    }
    setError(null)
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!upiRef.trim()) { setError('Please enter your UPI transaction ID.'); return }
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode,
          customer: formData,
          paymentRef: upiRef.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order creation failed')
      setOrderResult({ orderCode: data.orderCode, trackingToken: data.trackingToken })
      setStep('confirm')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'rangErenju@upi'
  const amount = product?.price || 0

  return (
    <>
      <Navbar />
      <main>
        <div className="container-narrow" style={{ padding: 'var(--space-12) var(--space-6)' }}>

          {/* Empty State Guard */}
          {!productCode ? (
            <div className="card card-body" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛒</div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>No product selected</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
                Please select a product from the shop to continue with checkout.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Return to Shop
              </Link>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-10)', gap: 0 }}>
            {(['details', 'payment', 'confirm'] as CheckoutStep[]).map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--text-sm)',
                  background: step === s ? 'var(--color-brand-primary)' :
                    (['details', 'payment', 'confirm'].indexOf(step) > i ? 'var(--color-success)' : 'var(--color-bg-muted)'),
                  color: step === s || ['details', 'payment', 'confirm'].indexOf(step) > i ? 'white' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-base)',
                  flexShrink: 0,
                }}>
                  {['details', 'payment', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: 600, marginLeft: 'var(--space-2)',
                  color: step === s ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {s === 'details' ? 'Your Details' : s === 'payment' ? 'Pay via UPI' : 'Confirmed'}
                </span>
                {i < 2 && (
                  <div style={{ flex: 1, height: 2, margin: '0 var(--space-3)', background: ['details', 'payment', 'confirm'].indexOf(step) > i ? 'var(--color-success)' : 'var(--color-border)', transition: 'background var(--transition-base)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Product Summary */}
          {product && (
            <div className="card card-body" style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="product-code-badge" style={{ marginBottom: 'var(--space-2)' }}>{product.code}</div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.name}</p>
                {product.fabric && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{product.fabric}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-brand-primary)', fontFamily: 'var(--font-display)' }}>
                  {formatPrice(product.price)}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>× 1</div>
              </div>
            </div>
          )}

          {loadingProduct && !product && (
            <div className="card card-body skeleton" style={{ height: 80, marginBottom: 'var(--space-8)' }} />
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }} role="alert">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* ── Step 1: Customer Details ── */}
          {step === 'details' && (
            <div className="animate-fade-in">
              <h1 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-2xl)' }}>Your Details</h1>
              <form onSubmit={handleDetailSubmit} noValidate>
                <div className="card card-body" style={{ marginBottom: 'var(--space-6)' }}>
                  <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>Contact</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label form-label-required" htmlFor="checkout-name">Full Name</label>
                      <input id="checkout-name" type="text" className="form-input" placeholder="e.g. Priya Nair"
                        value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required" htmlFor="checkout-phone">Phone (WhatsApp)</label>
                      <input id="checkout-phone" type="tel" className="form-input" placeholder="10-digit number"
                        value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required maxLength={10} />
                      <span className="form-hint">Your order updates will be sent here.</span>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="checkout-email">Email (Optional)</label>
                      <input id="checkout-email" type="email" className="form-input" placeholder="priya@email.com"
                        value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="card card-body" style={{ marginBottom: 'var(--space-8)' }}>
                  <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>Delivery Address</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label form-label-required" htmlFor="checkout-address">Street Address</label>
                      <textarea id="checkout-address" className="form-textarea" placeholder="House no., Street, Area..."
                        value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} required rows={3} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="checkout-city">City / Town</label>
                      <input id="checkout-city" type="text" className="form-input" placeholder="Chennai"
                        value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required" htmlFor="checkout-pincode">Pincode</label>
                      <input id="checkout-pincode" type="text" className="form-input" placeholder="600001"
                        value={formData.pincode} onChange={e => setFormData(p => ({ ...p, pincode: e.target.value }))} required maxLength={6} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label" htmlFor="checkout-state">State</label>
                      <input id="checkout-state" type="text" className="form-input" placeholder="Tamil Nadu"
                        value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-full" id="checkout-details-submit">
                  Continue to Payment →
                </button>
              </form>
            </div>
          )}

          {/* ── Step 2: UPI Payment ── */}
          {step === 'payment' && (
            <div className="animate-fade-in">
              <h1 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-2xl)' }}>Pay via UPI</h1>

              <div className="upi-box" style={{ marginBottom: 'var(--space-8)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Amount to Pay
                </p>
                <div className="upi-box-amount">{formatPrice(amount)}</div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                  UPI ID: <strong style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{upiId}</strong>
                </p>

                {/* QR Code placeholder — in production, generate with a UPI deep link */}
                <div className="upi-qr-placeholder" aria-label="UPI QR Code">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>📱</div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>QR code will appear here</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>or use UPI ID above</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                  <a
                    href={`upi://pay?pa=${upiId}&pn=RangERenju&am=${amount}&cu=INR`}
                    className="btn btn-primary btn-sm"
                    id="checkout-open-upi-app"
                  >
                    Open UPI App
                  </a>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="card card-body" style={{ marginBottom: 'var(--space-6)' }}>
                  <div className="form-group">
                    <label className="form-label form-label-required" htmlFor="checkout-upi-ref">
                      UPI Transaction ID / Reference Number
                    </label>
                    <input
                      id="checkout-upi-ref"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 123456789012"
                      value={upiRef}
                      onChange={e => setUpiRef(e.target.value)}
                      required
                      style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                    />
                    <span className="form-hint">
                      After paying, find the 12-digit transaction ID in your UPI app and enter it above.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg btn-full${submitting ? ' btn-loading' : ''}`}
                    disabled={submitting}
                    id="checkout-payment-submit"
                  >
                    {submitting ? '' : 'Confirm Order'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep('details')}
                    id="checkout-back-btn"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 'confirm' && orderResult && (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎉</div>
              <h1 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>Order Placed!</h1>
              <p style={{ marginBottom: 'var(--space-6)' }}>
                Your order has been received. We&apos;ll verify your payment and confirm shortly.
              </p>

              <div className="card card-body" style={{ marginBottom: 'var(--space-8)', display: 'inline-block', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <div className="form-hint">Order Number</div>
                    <div className="product-code-badge" style={{ marginTop: 'var(--space-1)' }}>{orderResult.orderCode}</div>
                  </div>
                  <div>
                    <div className="form-hint">What happens next?</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      {[
                        'We verify your UPI payment (usually within 1 hour)',
                        'You receive a WhatsApp confirmation',
                        'Your order is packed and shipped within 2–4 days',
                        'Track your order anytime using the link below',
                      ].map(step => (
                        <li key={step} style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 340, margin: '0 auto' }}>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(`Hi Rang E Renju team! I just placed an order.\n\nOrder Number: ${orderResult.orderCode}\nName: ${formData.name}\nPhone: ${formData.phone}\n\nI have completed the UPI payment.\n\n(Admin link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders#${orderResult.orderCode})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg btn-full"
                  style={{ background: '#25D366', borderColor: '#25D366', color: 'white' }}
                  id="checkout-whatsapp-btn"
                >
                  📱 Confirm on WhatsApp
                </a>
                <Link
                  href={`/track/${orderResult.trackingToken}`}
                  className="btn btn-outline btn-lg btn-full"
                  id="checkout-track-order-btn"
                >
                  Track My Order
                </Link>
                <Link href="/shop" className="btn btn-ghost btn-full" id="checkout-continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
          
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// Suspense wrapper — required by Next.js because useSearchParams is used
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
