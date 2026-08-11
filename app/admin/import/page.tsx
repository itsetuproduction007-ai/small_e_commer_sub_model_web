'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface ParsedProduct {
  id: string
  suggestedCode: string
  name: string
  description: string
  price?: number
  fabric?: string
  instagramUrl?: string
  instagramPostId?: string
  captionRaw: string
  mediaUrls: string[]
  detectedProductCode?: string
  date: string
  approved: boolean
  stock?: number
}

export default function InstagramImportPage() {
  const [phase, setPhase] = useState<'upload' | 'parsing' | 'review' | 'importing' | 'done'>('upload')
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [importLog, setImportLog] = useState<string[]>([])
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setPhase('parsing')

    try {
      const text = await file.text()
      let json: unknown

      try {
        json = JSON.parse(text)
      } catch {
        throw new Error('Invalid JSON file. Please upload the Instagram export posts JSON file.')
      }

      // Send to parser API
      const res = await fetch('/api/admin/instagram-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: json }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Parsing failed')

      // Mark all as approved initially; user can deselect
      setParsedProducts(result.products.map((p: ParsedProduct) => ({ ...p, approved: true })))
      setPhase('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPhase('upload')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.json') || file.type === 'application/json')) {
      handleFileSelect(file)
    } else {
      setError('Please drop a .json file from your Instagram data export.')
    }
  }, [handleFileSelect])

  const handleImport = async () => {
    const toImport = parsedProducts.filter(p => p.approved)
    if (toImport.length === 0) { setError('No products selected to import.'); return }

    setPhase('importing')
    setImportLog([])
    let count = 0

    for (const product of toImport) {
      const log = `Importing ${product.suggestedCode} — ${product.name}...`
      setImportLog(prev => [...prev, log])

      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: product.suggestedCode,
            name: product.name,
            description: product.description,
            price: product.price || 0,
            stock: product.stock ?? 1,
            images: product.mediaUrls,
            instagramUrl: product.instagramUrl,
            fabric: product.fabric,
            isDraft: false,
            isPublished: true,
          }),
        })
        if (res.ok) {
          count++
          setImportLog(prev => [...prev.slice(0, -1), `✅ ${product.suggestedCode} imported`])
        } else {
          const d = await res.json()
          setImportLog(prev => [...prev.slice(0, -1), `❌ ${product.suggestedCode}: ${d.error}`])
        }
      } catch {
        setImportLog(prev => [...prev.slice(0, -1), `❌ ${product.suggestedCode}: network error`])
      }
    }

    setImportedCount(count)
    setPhase('done')
  }

  const toggleApproval = (id: string) => {
    setParsedProducts(prev => prev.map(p => p.id === id ? { ...p, approved: !p.approved } : p))
  }

  const updateProduct = (id: string, field: keyof ParsedProduct, value: string | number) => {
    setParsedProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Top Bar */}
      <nav style={{
        background: 'var(--color-brand-primary-dark)', color: 'white',
        padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rang E Renju</div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Instagram Import</div>
        </div>
        <Link href="/admin" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
          ← Admin Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-8)' }}>
        <h1 style={{ marginBottom: 'var(--space-4)' }}>Import from Instagram</h1>
        <p style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
          Upload your Instagram data export JSON file to automatically extract products from your post captions.
          All imported products are drafts — you review and approve before they go live.
        </p>

        {/* Instructions */}
        <div className="alert alert-info" style={{ marginBottom: 'var(--space-8)' }}>
          <span>ℹ️</span>
          <div>
            <strong>How to get your Instagram Export data:</strong>
            <ol style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
              <li>Open the Instagram app and go to <strong>Settings</strong> → <strong>Your Activity</strong> → <strong>Download your information</strong>.</li>
              <li>Request a download of your data. Make sure to select <strong>JSON format</strong>.</li>
              <li>Once Instagram emails you the download link, download the ZIP file and extract it on your computer.</li>
              <li>Open the extracted folder and look inside the <code>your_instagram_activity/media/</code> folder.</li>
              <li>Find the file named <code>posts_1.json</code> (or <code>posts_2.json</code> if you have many posts) and upload it here!</li>
            </ol>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        {/* Upload Phase */}
        {phase === 'upload' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? 'var(--color-brand-primary)' : 'var(--color-border-strong)'}`,
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-16)',
              textAlign: 'center',
              background: dragging ? 'hsl(340,30%,98%)' : 'var(--color-bg-card)',
              transition: 'all var(--transition-base)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📸</div>
            <h2 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-xl)' }}>
              Drop your Instagram posts JSON here
            </h2>
            <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
              or click to browse
            </p>
            <label className="btn btn-primary" htmlFor="instagram-file-input" style={{ cursor: 'pointer' }}>
              Choose File
            </label>
            <input
              id="instagram-file-input"
              type="file"
              accept=".json,application/json"
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            />
          </div>
        )}

        {/* Parsing Phase */}
        {phase === 'parsing' && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>⚙️</div>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Analysing your Instagram data...</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Extracting product codes, prices, and details from captions.</p>
          </div>
        )}

        {/* Review Phase */}
        {phase === 'review' && parsedProducts.length > 0 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ marginBottom: 'var(--space-1)' }}>Review {parsedProducts.length} Products Found</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  {parsedProducts.filter(p => p.approved).length} selected for import.
                  Edit details, uncheck products to skip, then import.
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleImport}
                id="instagram-import-submit-btn"
              >
                Import {parsedProducts.filter(p => p.approved).length} Products →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {parsedProducts.map(product => (
                <div
                  key={product.id}
                  className="card"
                  style={{
                    opacity: product.approved ? 1 : 0.4,
                    border: product.approved ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <input
                          type="checkbox"
                          checked={product.approved}
                          onChange={() => toggleApproval(product.id)}
                          id={`import-approve-${product.id}`}
                          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-brand-primary)' }}
                        />
                        <label htmlFor={`import-approve-${product.id}`} style={{ cursor: 'pointer' }}>
                          {product.approved ? '✅ Import this product' : '⬜ Skip'}
                        </label>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{product.date}</div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                      {/* Image Preview */}
                      {product.mediaUrls?.[0] ? (
                        <div style={{ flexShrink: 0, width: 120, height: 160, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-bg-subtle)' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.mediaUrls[0]} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ flexShrink: 0, width: 120, height: 160, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                          No image
                        </div>
                      )}

                      {/* Form Details */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor={`import-code-${product.id}`}>Product Code</label>
                          <input
                            id={`import-code-${product.id}`}
                            type="text"
                            className="form-input"
                            value={product.suggestedCode}
                            onChange={e => updateProduct(product.id, 'suggestedCode', e.target.value)}
                            style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                          />
                          {product.detectedProductCode && product.detectedProductCode !== product.suggestedCode && (
                            <span className="form-hint">Found in caption: {product.detectedProductCode}</span>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor={`import-price-${product.id}`}>Price (₹)</label>
                          <input
                            id={`import-price-${product.id}`}
                            type="number"
                            className="form-input"
                            value={product.price || ''}
                            onChange={e => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor={`import-stock-${product.id}`}>Initial Stock</label>
                          <input
                            id={`import-stock-${product.id}`}
                            type="number"
                            className="form-input"
                            value={product.stock ?? 1}
                            onChange={e => updateProduct(product.id, 'stock', parseInt(e.target.value, 10))}
                            placeholder="1"
                            min="0"
                          />
                        </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label" htmlFor={`import-name-${product.id}`}>Product Name</label>
                        <input
                          id={`import-name-${product.id}`}
                          type="text"
                          className="form-input"
                          value={product.name}
                          onChange={e => updateProduct(product.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label" htmlFor={`import-desc-${product.id}`}>Description</label>
                        <textarea
                          id={`import-desc-${product.id}`}
                          className="form-textarea"
                          value={product.description}
                          onChange={e => updateProduct(product.id, 'description', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    </div>

                    {/* Caption preview */}
                    <details style={{ marginTop: 'var(--space-4)' }}>
                      <summary style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        View original caption
                      </summary>
                      <pre style={{
                        marginTop: 'var(--space-2)', padding: 'var(--space-3)',
                        background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {product.captionRaw}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleImport}
                id="instagram-import-submit-bottom-btn"
              >
                Import {parsedProducts.filter(p => p.approved).length} Products →
              </button>
            </div>
          </div>
        )}

        {/* Importing Phase */}
        {phase === 'importing' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Importing products...</h2>
            <div className="card card-body" style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>
              {importLog.map((line, i) => (
                <div key={i} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)', color: line.startsWith('✅') ? 'var(--color-success)' : line.startsWith('❌') ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done Phase */}
        {phase === 'done' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Import Complete!</h2>
            <p style={{ marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              Successfully imported {importedCount} products into your catalogue.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <Link href="/admin" className="btn btn-outline" id="import-done-admin-btn">← Back to Dashboard</Link>
              <Link href="/shop" className="btn btn-primary" id="import-done-shop-btn">View Shop →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
