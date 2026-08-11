import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function TrackIndexPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <>
      <Navbar />
      <main>
        <div className="container-narrow" style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📦</div>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Track Your Order</h1>
          <p style={{ marginBottom: 'var(--space-8)' }}>
            Enter your order number or use the tracking link sent to your WhatsApp to check your order status.
          </p>

          {error && (
            <div className="alert alert-error" style={{ maxWidth: 400, margin: '0 auto var(--space-6)' }}>
              {error === 'not_found' ? 'Order not found. Please check your order number.' : 'Invalid tracking request.'}
            </div>
          )}

          <form method="get" action="/track/search" style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 400, margin: '0 auto var(--space-8)' }}>
            <input
              type="text"
              name="order"
              className="form-input"
              placeholder="e.g. RER-ORD-1025"
              aria-label="Order number"
              id="track-order-input"
              style={{ fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-primary" id="track-search-btn">Track</button>
          </form>

          <p className="text-muted text-sm">
            Don&apos;t have your order number?{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}
            >
              Contact us on WhatsApp
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
