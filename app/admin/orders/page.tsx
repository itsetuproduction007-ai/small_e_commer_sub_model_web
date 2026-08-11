import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { OrderStatusClient } from './OrderStatusClient'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      items: {
        include: { product: true }
      }
    }
  })

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <nav style={{
        background: 'var(--color-brand-primary-dark)', color: 'white',
        padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rang E Renju</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Orders</div>
        </div>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
          ← Admin Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--space-8)' }}>
        <h1 style={{ marginBottom: 'var(--space-6)' }}>Order Management</h1>
        
        {orders.length === 0 ? (
          <div className="card card-body" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No orders found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {orders.map(order => (
              <div key={order.id} id={order.orderCode} className="card" style={{ borderLeft: `4px solid ${getStatusColor(order.status)}` }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h2 style={{ fontFamily: 'monospace', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>{order.orderCode}</h2>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Highlight */}
                  <div style={{ background: 'var(--color-success-bg, #ecfdf5)', border: '1px solid #10b981', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '1.5rem' }}>💳</span>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>Payment Reference (UPI)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-lg)', fontWeight: 700, color: '#064e3b', letterSpacing: '0.05em' }}>
                          {order.paymentRef || 'NOT PROVIDED'}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>Amount Expected</div>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#064e3b' }}>{formatPrice(order.totalAmount)}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 'var(--space-6)' }}>
                    {/* Customer Info */}
                    <div style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                      <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Customer</h3>
                      <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0' }}>{order.customer.phone}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                        {order.customer.address}
                        {'\n'}{order.customer.city}, {order.customer.state} - {order.customer.pincode}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Items ({order.items.length})</h3>
                      <ul style={{ listStyle: 'none' }}>
                        {order.items.map(item => (
                          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                              <div style={{ fontWeight: 600, color: 'var(--color-brand-primary)', fontFamily: 'monospace' }}>{item.quantity}x</div>
                              {item.product.images && item.product.images[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.product.images[0]} alt={item.product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                              )}
                              <div>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.product.name}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.product.code}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div>
                      <h3 style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Status Management</h3>
                      <OrderStatusClient orderId={order.id} currentStatus={order.status} />
                      
                      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <a 
                          href={`https://wa.me/91${order.customer.phone.replace(/\D/g, '')}?text=${
                            order.status === 'PENDING'
                              ? encodeURIComponent(`Hi ${order.customer.name}, we noticed you placed an order (${order.orderCode}) but we haven't received your UPI payment yet. Let us know if you need any help!`)
                              : order.status === 'CONFIRMED'
                              ? encodeURIComponent(`Hi ${order.customer.name}, your payment for order ${order.orderCode} is verified! We are processing it now. You can track your order status here:\n${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${order.trackingToken}`)
                              : order.status === 'SHIPPED'
                              ? encodeURIComponent(`Great news ${order.customer.name}! Your order ${order.orderCode} has been shipped. Track it here:\n${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track/${order.trackingToken}`)
                              : encodeURIComponent(`Hi ${order.customer.name}, we've received your order ${order.orderCode} at Rang E Renju!`)
                          }`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-outline btn-sm"
                        >
                          📱 WhatsApp Customer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING': return 'var(--color-warning)'
    case 'CONFIRMED': return 'var(--color-brand-primary)'
    case 'PACKED': return '#3b82f6'
    case 'SHIPPED': return 'var(--color-success)'
    case 'DELIVERED': return 'var(--color-success)'
    case 'CANCELLED': return 'var(--color-error)'
    default: return 'var(--color-border-strong)'
  }
}
