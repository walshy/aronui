'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MotifLogo, MOTIF_DIR } from '@/components/motifs'
import Icon from '@/components/icon'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <MotifLogo dir={MOTIF_DIR} />
        </div>

        <div className="login-head">
          <h1>Sign in to Aronui</h1>
          <span className="chip chip-teal login-pill">
            <span className="sdot teal" /> Te Mātaiaho 2025
          </span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="login-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@school.ac.nz"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="login-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="login-error">
              <Icon name="shield" size={14} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-teal btn-lg login-submit" disabled={loading}>
            {loading ? <span className="spin" /> : <Icon name="arrow" size={16} />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-footer">
          New to Aronui? Contact your school administrator.
        </p>
      </div>
    </div>
  )
}
