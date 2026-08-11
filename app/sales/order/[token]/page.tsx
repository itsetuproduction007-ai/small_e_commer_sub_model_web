'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────
interface OrderDetail {
  orderCode: string
  status: string
  paymentStatus: string
  totalAmount: number
  paymentRef: string | null
  createdAt: string
  updatedAt: string
  customer: {
    name: string; phone: string; email: string | null;
    address: string; pincode: string; city: string | null; state: string | null;
  }
  items: {
    id: string; quantity: number; price: number
    product: { code: string; name: string }
  }[]
  statusHistory: { id: string; status: string; note: string | null; createdAt: string }[]
  trackingToken: string
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', PACKED: 'Packed',
  SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
}

const NEXT_ACTION: Record<string, { label: string; status: string; color: string } | null> = {
  PENDING:   { label: '✅ Confirm Payment', status: 'CONFIRMED', color: 'var(--color-info)' },
  CONFIRMED: { label: '📦 Mark as Packed',  status: 'PACKED',    color: 'hsl(270,60%,48%)' },
  PACKED:    { label: '🚚 Mark as Shipped', status: 'SHIPPED',   color: 'hsl(190,70%,38%)' },
  SHIPPED:   { label: '🎉 Mark as Delivered', status: 'DELIVERED', color: 'var(--color-success)' },
  DELIVERED: null,
  CANCELLED: null,
}

// ── Component ──────────────────────────────────────────────────────────────
export default function StaffOrderPage() {
  const { token } = useParams<{ token: string }>()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/staff/order/${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return
    setUpdating(true)
    setError(null)
    setSuccessMsg(null)
    setWhatsappUrl(null)

    try {
      const res = await fetch(`/api/orders/${token}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')

      // Refresh order data
      const fresh = await fetch(`/api/staff/order/${token}`)
      const freshData = await fresh.json()
      setOrder(freshData)
      setSuccessMsg(`Order updated to ${STATUS_LABELS[newStatus]}!`)
      if (data.whatsappCustomerUrl) setWhatsappUrl(data.whatsappCustomerUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUpdating(false)
    }
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <h2>Order not found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>This link may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  const nextAction = NEXT_ACTION[order.status]

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh', padding: 'var(--space-6)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Staff Portal Header */}
        <div style={{
          background: 'var(--color-brand-primary-dark)', color: 'white',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-1)' }}>
              Staff Order View
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              Rang E Renju
            </div>
          </div>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
            Admin →
          </Link>
        </div>

        {/* Order Code + Status */}
        <div className="card card-body" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Order</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
                {order.orderCode}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge badge-${order.status.toLowerCase()}`}>
                {STATUS_LABELS[order.status]}
              </span>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                {formatDate(new Date(order.createdAt))}
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Payment Status</span>
              <span style={{
                fontSize: 'var(--text-sm)', fontWeight: 600,
                color: order.paymentStatus === 'PAID' ? 'var(--color-success)' :
                  order.paymentStatus === 'PENDING_VERIFICATION' ? 'var(--color-warning)' : 'var(--color-error)',
              }}>
                {order.paymentStatus.replace('_', ' ')}
              </span>
            </div>
            {order.paymentRef && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>UPI Ref</span>
                <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'monospace', fontWeight: 600 }}>{order.paymentRef}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Order Total</span>
            <span style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)' }}>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="card card-body" style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
            Customer
          </h2>
          <dl style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {[
              { label: 'Name', value: order.customer.name },
              { label: 'Phone', value: order.customer.phone },
              { label: 'Address', value: `${order.customer.address}, ${order.customer.city || ''} ${order.customer.pincode}${order.customer.state ? ', ' + order.customer.state : ''}` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                <dt style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', flexShrink: 0 }}>{item.label}</dt>
                <dd style={{ fontSize: 'var(--text-sm)', fontWeight: 500, textAlign: 'right' }}>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
            <a
              href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.name}! Regarding your order ${order.orderCode} from Rang E Renju.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              id="staff-whatsapp-customer-btn"
            >
              💬 WhatsApp Customer
            </a>
          </div>
        </div>

        {/* Items */}
        <div className="card card-body" style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
            Items to Ship
          </h2>
          {order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>{item.product.code}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.product.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{formatPrice(item.price)}</div>
            </div>
          ))}
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
            <span>✅</span><span>{successMsg}</span>
          </div>
        )}

        {/* WhatsApp customer notification */}
        {whatsappUrl && (
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
            <span>📱</span>
            <span>
              <strong>Notify the customer:</strong>{' '}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 600 }}>
                Send WhatsApp update →
              </a>
            </span>
          </div>
        )}

        {/* Next Action */}
        {nextAction && (
          <div className="card card-body" style={{ marginBottom: 'var(--space-4)', border: '2px solid var(--color-brand-accent)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Next step:
            </p>
            <button
              className={`btn btn-lg btn-full${updating ? ' btn-loading' : ''}`}
              style={{ background: nextAction.color, color: 'white', border: 'none', boxShadow: 'var(--shadow-md)' }}
              onClick={() => handleStatusUpdate(nextAction.status)}
              disabled={updating}
              id={`staff-action-${nextAction.status.toLowerCase()}-btn`}
            >
              {updating ? '' : nextAction.label}
            </button>
          </div>
        )}

        {/* Cancel */}
        {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-error)' }}
              onClick={() => {
                if (confirm('Are you sure you want to cancel this order?')) {
                  handleStatusUpdate('CANCELLED')
                }
              }}
              id="staff-cancel-order-btn"
            >
              Cancel Order
            </button>
          </div>
        )}

        {/* Customer tracking link */}
        <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Customer tracking link
          </p>
          <a
            href={`${baseUrl}/track/${order.trackingToken}`}
            style={{ fontSize: 'var(--text-xs)', fontFamily: 'monospace', color: 'var(--color-brand-primary)', wordBreak: 'break-all' }}
          >
            {baseUrl}/track/{order.trackingToken}
          </a>
        </div>
      </div>
    </div>
  )
}
