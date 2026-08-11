'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/Button'
import { CheckCircle, Circle, Shield, Lock } from 'lucide-react'

interface ProductInfo {
  code: string
  name: string
  price: number
  stock: number
  fabric?: string | null
}

type CheckoutStep = 'details' | 'payment' | 'confirm'

function CheckoutContent() {
  const searchParams = useSearchParams()
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
        body: JSON.stringify({ productCode, customer: formData, paymentRef: upiRef.trim() }),
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

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'details', label: 'Your Details' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Success' },
  ]
  const stepOrder: CheckoutStep[] = ['details', 'payment', 'confirm']
  const currentStepIdx = stepOrder.indexOf(step)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-10">

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Secure UPI Payment</h1>
            <p className="text-brand font-medium mt-1">Frictionless Purchasing</p>
          </div>

          {!productCode ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="text-xl font-serif font-semibold mb-2">No product selected</h2>
              <p className="text-gray-500 mb-6">Please select a product from the shop to continue.</p>
              <Link href="/shop">
                <Button variant="primary">Return to Shop</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* 3-Step Progress Bar */}
              <div className="flex items-center mb-10">
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        i < currentStepIdx ? 'bg-green-500 text-white' :
                        i === currentStepIdx ? 'bg-brand text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {i < currentStepIdx ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap ${i === currentStepIdx ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${i < currentStepIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Product Summary Card */}
              {product && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex justify-between items-center">
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-700 font-mono text-xs px-3 py-1 rounded-full mb-1">{product.code}</span>
                    <p className="font-serif font-semibold text-gray-900">{product.name}</p>
                    {product.fabric && <p className="text-sm text-gray-400">{product.fabric}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand font-serif">{formatPrice(product.price)}</p>
                    <p className="text-xs text-gray-400">Qty: 1</p>
                  </div>
                </div>
              )}
              {loadingProduct && !product && (
                <div className="h-20 bg-gray-100 rounded-2xl mb-6 animate-pulse" />
              )}

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex gap-2 items-center">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              {/* Step 1: Your Details */}
              {step === 'details' && (
                <form onSubmit={handleDetailSubmit} noValidate>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                    <h2 className="font-sans font-semibold text-gray-900 mb-5">Your Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-brand">*</span></label>
                        <input id="name" type="text" required placeholder="e.g. Priya Nair"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number <span className="text-brand">*</span></label>
                          <input id="phone" type="tel" required maxLength={10} placeholder="10-digit number"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 text-xs">(Optional)</span></label>
                          <input id="email" type="email" placeholder="priya@email.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="font-sans font-semibold text-gray-900 mb-5">Delivery Address</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-brand">*</span></label>
                        <input id="address" type="text" required placeholder="House no., Street, Area..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input id="city" type="text" placeholder="Chennai"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} />
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-brand">*</span></label>
                          <input id="pincode" type="text" required maxLength={6} placeholder="600001"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                            value={formData.pincode} onChange={e => setFormData(p => ({ ...p, pincode: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input id="state" type="text" placeholder="Tamil Nadu"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          value={formData.state} onChange={e => setFormData(p => ({ ...p, state: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" fullWidth size="lg" id="checkout-details-submit">
                    Continue to Payment →
                  </Button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-6 mt-6 grayscale opacity-60">
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Lock className="w-3 h-3" /> Secure Payment</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Shield className="w-3 h-3" /> UPI Verified</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500"><CheckCircle className="w-3 h-3" /> No Account Needed</div>
                  </div>
                </form>
              )}

              {/* Step 2: UPI Payment */}
              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
                    <p className="text-4xl font-serif font-bold text-brand mb-3">{formatPrice(amount)}</p>
                    <p className="text-sm text-gray-500 mb-4">UPI ID: <span className="font-mono font-bold text-gray-800">{upiId}</span></p>
                    <div className="flex justify-center gap-3">
                      <a href={`upi://pay?pa=${upiId}&pn=RangERenju&am=${amount}&cu=INR`}
                        className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#600018] transition-colors">
                        Open UPI App
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <label htmlFor="upi-ref" className="block text-sm font-medium text-gray-700 mb-2">
                      UPI Transaction ID <span className="text-brand">*</span>
                    </label>
                    <input id="upi-ref" type="text" required placeholder="e.g. 123456789012"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      value={upiRef} onChange={e => setUpiRef(e.target.value)} />
                    <p className="text-xs text-gray-400 mt-2">Find the 12-digit transaction ID in your UPI app after payment.</p>
                  </div>
                  <div className="space-y-3">
                    <Button type="submit" fullWidth size="lg" disabled={submitting} id="checkout-payment-submit">
                      {submitting ? 'Confirming...' : 'Confirm Order'}
                    </Button>
                    <button type="button" onClick={() => setStep('details')}
                      className="w-full py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      ← Back
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {step === 'confirm' && orderResult && (
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Order Placed!</h2>
                  <p className="text-gray-500 mb-8">We&apos;ll verify your payment and confirm shortly on WhatsApp.</p>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-8 space-y-3">
                    <p className="text-xs text-gray-400">Order Number</p>
                    <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-brand">{orderResult.orderCode}</span>
                    <ul className="mt-4 space-y-2">
                      {['We verify your UPI payment (within 1 hour)', 'You receive a WhatsApp confirmation', 'Order packed and shipped within 2–4 days'].map(s => (
                        <li key={s} className="flex gap-2 text-sm text-gray-600"><span className="text-green-500">✓</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
                      target="_blank" rel="noopener noreferrer" id="checkout-whatsapp-btn"
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#25D366] text-white font-medium text-base hover:bg-[#1ebe5d] transition-colors">
                      📱 Confirm on WhatsApp
                    </a>
                    <Link href={`/track/${orderResult.trackingToken}`} id="checkout-track-btn"
                      className="flex items-center justify-center w-full py-4 rounded-full border-2 border-brand text-brand font-medium text-base hover:bg-brand hover:text-white transition-colors">
                      Track My Order
                    </Link>
                    <Link href="/shop" className="block w-full py-3 text-sm text-center text-gray-400 hover:text-gray-700 transition-colors">
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
