'use client'

import { useState } from 'react'
import { updateProductQuick } from './actions'

export function ProductClientRow({ product }: { product: any }) {
  const [stock, setStock] = useState(product.stock)
  const [price, setPrice] = useState(product.price)
  const [isPublished, setIsPublished] = useState(product.isPublished)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await updateProductQuick(product.id, { stock, price, isPublished })
    setIsSaving(false)
    setHasChanges(false)
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'white' }}>
      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
          )}
          <div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-brand-primary)' }}>{product.code}</div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{product.name}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <input 
          type="number" 
          value={price} 
          onChange={e => { setPrice(parseFloat(e.target.value)); setHasChanges(true) }}
          className="form-input" 
          style={{ width: 100, padding: 'var(--space-1) var(--space-2)' }} 
        />
      </td>
      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <input 
          type="number" 
          value={stock} 
          onChange={e => { setStock(parseInt(e.target.value)); setHasChanges(true) }}
          className="form-input" 
          style={{ width: 80, padding: 'var(--space-1) var(--space-2)' }} 
        />
      </td>
      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={isPublished} 
            onChange={e => { setIsPublished(e.target.checked); setHasChanges(true) }}
            style={{ accentColor: 'var(--color-brand-primary)' }}
          />
          <span style={{ fontSize: 'var(--text-xs)', color: isPublished ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
            {isPublished ? 'Active' : 'Hidden'}
          </span>
        </label>
      </td>
      <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
        {hasChanges && (
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn btn-primary btn-sm"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </td>
    </tr>
  )
}
