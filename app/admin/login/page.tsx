'use client'

import { useState } from 'react'
import { verifyAdminPin } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await verifyAdminPin(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="card card-body" style={{ width: '100%', maxWidth: 400, padding: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-brand-primary-dark)' }}>
            Rang E Renju
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 'var(--space-1)' }}>
            Staff Access
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
            {error}
          </div>
        )}

        <form action={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="pin">Enter PIN</label>
            <input
              type="password"
              id="pin"
              name="pin"
              className="form-input"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="••••••"
              required
              maxLength={6}
              style={{
                fontSize: '2rem',
                textAlign: 'center',
                letterSpacing: '0.5em',
                padding: 'var(--space-4)'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary btn-lg btn-full ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
