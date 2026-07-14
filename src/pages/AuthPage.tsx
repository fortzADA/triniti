import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'
import { signInWithEmail, signInWithOAuth, signUpWithEmail } from '@/services/auth'
import { isSupabaseConfigured } from '@/lib/supabase'

export function AuthPage() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/feed'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-4 px-6 text-center">
        <div className="flex justify-center">
          <TrinityLogo size={72} />
        </div>
        <p className="text-[var(--color-text-muted)]">
          Configure <code>.env</code> with your Supabase URL and anon key to continue.
        </p>
      </div>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        if (!username.match(/^[a-z0-9_]{3,24}$/i)) {
          throw new Error('Username must be 3–24 chars: letters, numbers, underscore')
        }
        await signUpWithEmail(email, password, displayName || username, username.toLowerCase())
        setMessage('Check your email to confirm your account, then sign in.')
        setMode('signin')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  async function onOAuth(provider: 'google' | 'apple') {
    setBusy(true)
    setError('')
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth failed')
      setBusy(false)
    }
  }

  return (
    <div
      className="mx-auto flex h-full max-w-md flex-col justify-center px-6"
      style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mb-8">
        <TrinityLogo size={80} />
        <p className="mt-3 text-[var(--color-text-muted)]">
          Connect with groups, share posts, and message your community.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <>
            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-accent-dim)]"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-accent-dim)]"
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-accent-dim)]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-accent-dim)]"
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-1 rounded-lg bg-[var(--color-accent)] py-2.5 font-semibold text-[var(--color-bg)] disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        or continue with
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onOAuth('google')}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 font-medium hover:bg-[var(--color-surface-raised)]"
        >
          Google
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onOAuth('apple')}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 font-medium hover:bg-[var(--color-surface-raised)]"
        >
          Apple
        </button>
      </div>

      <button
        type="button"
        className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError('')
          setMessage('')
        }}
      >
        {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>

      {error && <p className="mt-4 text-sm text-[var(--color-danger)]">{error}</p>}
      {message && <p className="mt-4 text-sm text-[var(--color-accent)]">{message}</p>}
    </div>
  )
}
