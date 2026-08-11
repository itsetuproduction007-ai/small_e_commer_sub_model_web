import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import { OrderStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Real-time order tracking for your Rang E Renju purchase.',
  robots: 'noindex, nofollow',
}

interface TrackPageProps {
  params: Promise<{ token: string }>
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING',   label: 'Order Placed',       icon: '🛍️' },
  { status: 'CONFIRMED', label: 'Payment Confirmed',   icon: '✅' },
  { status: 'PACKED',    label: 'Packed',              icon: '📦' },
  { status: 'SHIPPED',   label: 'Shipped',             icon: '🚚' },
  { status: 'DELIVERED', label: 'Delivered',           icon: '🎉' },
]

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED']

export default async function TrackPage({ params }: TrackPageProps) {
  const { token } = await params

  let order: {
    id: string
    orderCode: string
    status: OrderStatus
    totalAmount: number
    paymentRef: string | null
    paymentStatus: string
    createdAt: Date
    updatedAt: Date
    customer: { name: string; phone: string }
    items: { id: string; quantity: number; price: number; product: { code: string; name: string; images: string[] } }[]
    statusHistory: { id: string; status: OrderStatus; note: string | null; createdAt: Date }[]
  } | null = null

  try {
    order = await prisma.order.findUnique({
      where: { trackingToken: token },
      select: {
        id: true, orderCode: true, status: true, totalAmount: true,
        paymentRef: true, paymentStatus: true, createdAt: true, updatedAt: true,
        customer: { select: { name: true, phone: true } },
        items: {
          include: { product: { select: { code: true, name: true, images: true } } },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
  } catch {
    // DB not configured — show a graceful message
  }

  if (!order) return notFound()

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <>
      <Navbar />
      <main>
        <div className="container-narrow" style={{ padding: 'var(--space-12) var(--space-6)' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="page-hero-eyebrow">Order Tracking</span>
            <h1 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-3xl)' }}>
              {order.orderCode}
            </h1>
            <p>Hi {order.customer.name} 👋 Here&apos;s the latest status of your order.</p>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className={`badge badge-${order.status.toLowerCase()}`} style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              {isCancelled ? '❌ Cancelled' : STATUS_STEPS.find(s => s.status === order.status)?.label || order.status}
            </span>
          </div>

          {/* Progress Timeline */}
          {!isCancelled && (
            <div className="card card-body" style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
                Order Progress
              </h2>

              {/* Visual progress bar */}
              <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
                <div style={{ height: 4, background: 'var(--color-bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${((currentStatusIndex) / (STATUS_ORDER.length - 1)) * 100}%`,
                    background: 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-accent))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i <= currentStatusIndex
                    const isActive = i === currentStatusIndex
                    return (
                      <div key={step.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', maxWidth: 64 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '1rem',
                          background: isDone ? (isActive ? 'var(--color-brand-primary)' : 'var(--color-success)') : 'var(--color-bg-muted)',
                          border: `2px solid ${isDone ? (isActive ? 'var(--color-brand-primary)' : 'var(--color-success)') : 'var(--color-border)'}`,
                          transition: 'all var(--transition-base)',
                          boxShadow: isActive ? '0 0 0 4px hsla(340,65%,30%,0.15)' : 'none',
                        }}>
                          {step.icon}
                        </div>
                        <span style={{
                          fontSize: 'var(--text-xs)', textAlign: 'center', lineHeight: 1.3,
                          color: isDone ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                          fontWeight: isActive ? 600 : 400,
                        }}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status History */}
              {order.statusHistory.length > 0 && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-6) 0' }} />
                  <h3 style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                    History
                  </h3>
                  <div className="timeline">
                    {[...order.statusHistory].reverse().map((event, i) => (
                      <div key={event.id} className="timeline-item">
                        <div className="timeline-line" />
                        <div className={`timeline-dot ${i === 0 ? 'active' : 'done'}`}>
                          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="timeline-content">
                          <p className="timeline-title">
                            {STATUS_STEPS.find(s => s.status === event.status)?.label || event.status}
                          </p>
                          {event.note && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{event.note}</p>}
                          <p className="timeline-date">{formatDate(event.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Order Details */}
          <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="card-body">
              <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
                Order Details
              </h2>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <div className="product-code-badge" style={{ marginBottom: 'var(--space-1)' }}>{item.product.code}</div>
                    <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{item.product.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--color-brand-primary)', fontSize: 'var(--text-lg)' }}>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Help */}
          <div style={{ textAlign: 'center' }}>
            <p className="text-muted text-sm" style={{ marginBottom: 'var(--space-4)' }}>
              Need help with your order?
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210'}?text=${encodeURIComponent(`Hi! I need help with my order ${order.orderCode}.\n\n(Admin link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders#${order.orderCode})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              id="track-whatsapp-help-btn"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
