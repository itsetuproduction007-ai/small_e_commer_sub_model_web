import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { PrintButton } from './PrintButton'

export default async function DailyReportPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { 
      createdAt: { gte: today },
      status: { in: ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'] }
    },
    include: {
      items: { include: { product: true } }
    }
  })

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  
  // Aggregate items for the packing list
  const packingMap: Record<string, { product: any, count: number }> = {}
  orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PACKED').forEach(order => {
    order.items.forEach(item => {
      if (!packingMap[item.productId]) {
        packingMap[item.productId] = { product: item.product, count: 0 }
      }
      packingMap[item.productId].count += item.quantity
    })
  })

  const packingList = Object.values(packingMap).sort((a, b) => b.count - a.count)

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <nav style={{
        background: 'var(--color-brand-primary-dark)', color: 'white',
        padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }} className="print-hide">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rang E Renju</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily Report</div>
        </div>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
          ← Admin Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--space-1)' }}>Daily Report & Packing List</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>{today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <PrintButton />
        </div>

        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)', textAlign: 'center', background: 'var(--color-brand-primary)', color: 'white' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, marginBottom: 'var(--space-2)' }}>Today's Revenue</h2>
          <div style={{ fontSize: '3rem', fontWeight: 700 }}>{formatPrice(totalRevenue)}</div>
          <p style={{ marginTop: 'var(--space-2)', opacity: 0.8 }}>From {orders.length} confirmed orders</p>
        </div>

        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          Packing List
        </h2>
        
        {packingList.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No pending items to pack for today.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-md)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border-strong)' }}>
                <th style={{ padding: 'var(--space-3) 0', textAlign: 'left' }}>Qty</th>
                <th style={{ padding: 'var(--space-3) 0', textAlign: 'left' }}>Code</th>
                <th style={{ padding: 'var(--space-3) 0', textAlign: 'left' }}>Product Name</th>
                <th style={{ padding: 'var(--space-3) 0', textAlign: 'right' }}>Check</th>
              </tr>
            </thead>
            <tbody>
              {packingList.map((item, i) => (
                <tr key={item.product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4) 0', fontWeight: 700, fontSize: '1.2rem' }}>{item.count}x</td>
                  <td style={{ padding: 'var(--space-4) 0', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{item.product.code}</td>
                  <td style={{ padding: 'var(--space-4) 0', fontWeight: 600 }}>{item.product.name}</td>
                  <td style={{ padding: 'var(--space-4) 0', textAlign: 'right' }}>
                    <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-strong)', borderRadius: 4, display: 'inline-block' }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .print-hide { display: none !important; }
          body { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #ddd !important; color: black !important; background: white !important; }
        }
      `}} />
    </div>
  )
}
