import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ProductClientRow } from './ProductClientRow'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [
      { stock: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <nav style={{
        background: 'var(--color-brand-primary-dark)', color: 'white',
        padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rang E Renju</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Products & Inventory</div>
        </div>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
          ← Admin Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 style={{ marginBottom: 'var(--space-1)' }}>Inventory Management</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Quickly update stock levels, prices, and visibility.</p>
          </div>
          <Link href="/admin/import" className="btn btn-outline">
            📥 Import New
          </Link>
        </div>
        
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                {['Product', 'Price (₹)', 'Stock', 'Visibility', ''].map(h => (
                  <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <ProductClientRow key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No products found. Import from Instagram first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
