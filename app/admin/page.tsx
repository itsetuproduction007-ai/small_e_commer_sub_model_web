import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import { OrderStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Admin Dashboard — Rang E Renju',
  robots: 'noindex, nofollow',
}

const LOW_STOCK_THRESHOLD = 3

export default async function AdminDashboard() {
  let stats = { totalOrders: 0, pendingOrders: 0, revenueToday: 0, ordersToday: 0 }
  let recentOrders: {
    id: string; orderCode: string; status: OrderStatus; totalAmount: number; createdAt: Date;
    customer: { name: string }; items: { product: { code: string; name: string } }[];
  }[] = []
  let lowStockProducts: { id: string; code: string; name: string; stock: number; price: number }[] = []
  let dbError = false

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalOrders, pendingOrders, todayOrders, lowStock, recent] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PACKED'] } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: today } },
        select: { totalAmount: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD }, isPublished: true },
        select: { id: true, code: true, name: true, stock: true, price: true },
        orderBy: { stock: 'asc' },
      }),
      prisma.order.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, orderCode: true, status: true, totalAmount: true, createdAt: true,
          customer: { select: { name: true } },
          items: { include: { product: { select: { code: true, name: true } } } },
        },
      }),
    ])

    stats = {
      totalOrders,
      pendingOrders,
      revenueToday: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      ordersToday: todayOrders.length,
    }
    lowStockProducts = lowStock
    recentOrders = recent
  } catch {
    dbError = true
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Admin Top Bar */}
      <nav style={{
        background: 'var(--color-brand-primary-dark)', color: 'white',
        padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rang E Renju</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <Link href="/admin/import" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }} id="admin-import-link">
            📥 Import from Instagram
          </Link>
          <Link href="/shop" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }} id="admin-view-shop-link">
            🛍️ View Shop
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'var(--space-8)' }}>
        {dbError && (
          <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)' }}>
            <span>⚠️</span>
            <span>Database not connected. Set <code>DATABASE_URL</code> in <code>.env.local</code>. Showing placeholder data.</span>
          </div>
        )}

        <h1 style={{ marginBottom: 'var(--space-8)', fontSize: 'var(--text-2xl)' }}>Overview</h1>

        {/* Stats Grid */}
        <div className="stats-grid stagger-children" style={{ marginBottom: 'var(--space-8)' }}>
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '🛍️' },
            { label: 'Pending / Active', value: stats.pendingOrders, icon: '⏳', highlight: stats.pendingOrders > 0 },
            { label: 'Orders Today', value: stats.ordersToday, icon: '📅' },
            { label: 'Revenue Today', value: formatPrice(stats.revenueToday), icon: '💰' },
          ].map(stat => (
            <div key={stat.label} className="stat-card" style={{
              borderLeft: stat.highlight ? `4px solid var(--color-brand-accent)` : undefined,
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{stat.icon}</div>
              <div className="stat-card-label">{stat.label}</div>
              <div className="stat-card-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Recent Orders */}
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              Recent Orders
              {stats.pendingOrders > 0 && (
                <span style={{ background: 'var(--color-brand-accent)', color: 'var(--color-brand-primary-dark)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {stats.pendingOrders} active
                </span>
              )}
            </h2>

            <div className="card" style={{ overflow: 'hidden' }}>
              {recentOrders.length === 0 ? (
                <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No orders yet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                      {['Order', 'Customer', 'Product', 'Amount', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                          background: i % 2 === 0 ? 'white' : 'var(--color-bg)',
                          transition: 'background var(--transition-fast)',
                        }}
                      >
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'monospace', fontWeight: 700 }}>
                          {order.orderCode}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{order.customer.name}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-muted)' }}>
                          {order.items[0]?.product.code}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600 }}>
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <span className={`badge badge-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <Link
                            href={`/admin/orders`}
                            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)', fontWeight: 600, textDecoration: 'none' }}
                            id={`admin-view-order-${order.orderCode}`}
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              ⚠️ Low Stock
              {lowStockProducts.length > 0 && (
                <span style={{ background: 'var(--color-warning-bg)', color: 'hsl(38,80%,30%)', borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                  {lowStockProducts.length}
                </span>
              )}
            </h2>

            <div className="card">
              {lowStockProducts.length === 0 ? (
                <div className="card-body" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  ✓ All products are well stocked.
                </div>
              ) : (
                <ul style={{ listStyle: 'none' }}>
                  {lowStockProducts.map((p, i) => (
                    <li
                      key={p.id}
                      style={{
                        padding: 'var(--space-4)',
                        borderBottom: i < lowStockProducts.length - 1 ? '1px solid var(--color-border)' : 'none',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)' }}>{p.code}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{p.name}</div>
                      </div>
                      <div style={{
                        fontWeight: 700,
                        color: p.stock === 0 ? 'var(--color-error)' : 'var(--color-warning)',
                        fontSize: 'var(--text-sm)',
                      }}>
                        {p.stock === 0 ? 'SOLD OUT' : `${p.stock} left`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick Links */}
            <div style={{ marginTop: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link href="/admin/import" className="btn btn-primary btn-sm" id="admin-quick-import">
                  📥 Import from Instagram
                </Link>
                <Link href="/admin/products" className="btn btn-outline btn-sm" id="admin-quick-products">
                  📦 Manage Products
                </Link>
                <Link href="/admin/report" className="btn btn-ghost btn-sm" id="admin-quick-report">
                  📊 Daily Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
