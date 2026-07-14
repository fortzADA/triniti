import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'
import {
  approveMember,
  getChurchBySlug,
  listPendingMembers,
  rejectMember,
  requestJoinChurch,
} from '@/services/churches'
import type { Church, ChurchMember } from '@/lib/types'

export function ChurchPortalPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [church, setChurch] = useState<Church | null>(null)
  const [pending, setPending] = useState<ChurchMember[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const membership = church?.my_membership
  const isActive = membership?.status === 'active'
  const isAdmin =
    isActive && (membership?.role === 'owner' || membership?.role === 'admin')

  const load = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError('')
    try {
      const data = await getChurchBySlug(slug, user?.id)
      setChurch(data)
      if (
        data?.my_membership &&
        (data.my_membership.role === 'owner' || data.my_membership.role === 'admin') &&
        data.my_membership.status === 'active'
      ) {
        setPending(await listPendingMembers(data.id))
      } else {
        setPending([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load church')
    } finally {
      setLoading(false)
    }
  }, [slug, user?.id])

  useEffect(() => {
    void load()
  }, [load])

  async function onJoin() {
    if (!church) return
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/churches/${church.slug}` } } })
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await requestJoinChurch(church.id, user.id)
      setMessage('Join request sent. An admin will review it.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request join')
    } finally {
      setBusy(false)
    }
  }

  async function onApprove(userId: string) {
    if (!church) return
    await approveMember(church.id, userId)
    await load()
  }

  async function onReject(userId: string) {
    if (!church) return
    await rejectMember(church.id, userId)
    await load()
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
        Loading portal…
      </div>
    )
  }

  if (!church) {
    return (
      <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-3 px-6 text-center">
        <p className="text-[var(--color-danger)]">{error || 'Church not found'}</p>
        <Link to="/churches" className="text-[var(--color-accent)]">
          Back to marketplace
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <header
        className="border-b border-[var(--color-border)] px-4 py-3"
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link to="/churches" className="inline-flex items-center gap-2">
            <TrinityLogo size={36} />
          </Link>
          <Link to="/churches" className="text-sm text-[var(--color-text-muted)]">
            Marketplace
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-gold,#d4af37)] uppercase">
          Parish portal
        </p>
        <h1 className="mt-2 font-[Cormorant_Garamond,Georgia,serif] text-4xl text-[var(--color-accent)]">
          {church.name}
        </h1>
        {church.tagline && (
          <p className="mt-2 text-lg text-[var(--color-gold,#d4af37)]">{church.tagline}</p>
        )}
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {[church.city, church.country].filter(Boolean).join(', ')}
          {church.member_count != null ? ` · ${church.member_count} members` : ''}
        </p>

        {church.description && (
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-[var(--color-text)]">
            {church.description}
          </p>
        )}

        <div className="mt-8 space-y-2 text-sm text-[var(--color-text-muted)]">
          {church.website && (
            <p>
              Website:{' '}
              <a href={church.website} className="text-[var(--color-accent)]" target="_blank" rel="noreferrer">
                {church.website}
              </a>
            </p>
          )}
          {church.email && <p>Email: {church.email}</p>}
          {church.phone && <p>Phone: {church.phone}</p>}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {isActive ? (
            <Link
              to={`/c/${church.slug}/feed`}
              className="rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)]"
            >
              Enter community
            </Link>
          ) : membership?.status === 'pending' ? (
            <span className="rounded-md border border-[var(--color-border)] px-5 py-3 text-[var(--color-text-muted)]">
              Join request pending
            </span>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onJoin()}
              className="rounded-md bg-[var(--color-accent)] px-5 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-60"
            >
              {busy ? 'Sending…' : 'Request to join'}
            </button>
          )}
        </div>

        {message && <p className="mt-4 text-sm text-[var(--color-accent)]">{message}</p>}
        {error && <p className="mt-4 text-sm text-[var(--color-danger)]">{error}</p>}

        {isAdmin && (
          <section className="mt-12 border-t border-[var(--color-border)] pt-8">
            <h2 className="text-xl font-semibold text-[var(--color-accent)]">Pending join requests</h2>
            {!pending.length && (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">No pending requests.</p>
            )}
            <ul className="mt-4 space-y-3">
              {pending.map((m) => (
                <li
                  key={m.user_id}
                  className="flex items-center justify-between gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
                >
                  <div>
                    <p className="font-medium">{m.profile?.display_name || 'Member'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      @{m.profile?.username || m.user_id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void onApprove(m.user_id)}
                      className="text-sm text-[var(--color-accent)]"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void onReject(m.user_id)}
                      className="text-sm text-[var(--color-danger)]"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
