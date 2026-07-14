import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'
import { createChurch, slugifyChurchName } from '@/services/churches'

type ChurchHint = {
  name: string
  city: string
  country: string
  suggestedSlug: string
}

export function CreateChurchPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hint = (location.state as { churchHint?: ChurchHint } | null)?.churchHint

  const [name, setName] = useState(hint?.name ?? '')
  const [slug, setSlug] = useState(hint?.suggestedSlug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(hint?.suggestedSlug))
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState(hint?.city ?? '')
  const [country, setCountry] = useState(hint?.country ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugTouched) setSlug(slugifyChurchName(name))
  }, [name, slugTouched])

  if (!loading && !user) {
    return <Navigate to="/auth" replace state={{ from: { pathname: '/churches/new' } }} />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setBusy(true)
    setError('')
    try {
      const church = await createChurch({
        name: name.trim(),
        slug: slug.trim(),
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
      })
      navigate(`/c/${church.slug}/feed`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create church')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <header
        className="border-b border-[var(--color-border)] px-4 py-3"
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link to="/churches" className="inline-flex items-center gap-2">
            <TrinityLogo size={36} />
          </Link>
          <Link to="/churches" className="text-sm text-[var(--color-text-muted)]">
            Cancel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="font-[Cormorant_Garamond,Georgia,serif] text-3xl text-[var(--color-accent)]">
          Create your church portal
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Priests and parish admins can create one public portal and a private member community.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm text-[var(--color-text-muted)]">Church name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-[var(--color-text-muted)]">Portal URL slug</span>
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(slugifyChurchName(e.target.value))
              }}
              pattern="[a-z0-9-]{2,48}"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            />
            <span className="text-xs text-[var(--color-text-muted)]">
              trinity.app/churches/{slug || 'your-slug'}
            </span>
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-[var(--color-text-muted)]">Tagline</span>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-[var(--color-text-muted)]">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-sm text-[var(--color-text-muted)]">City</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-[var(--color-text-muted)]">Country</span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              />
            </label>
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[var(--color-accent)] py-3 font-semibold text-[var(--color-bg)] disabled:opacity-60"
          >
            {busy ? 'Creating…' : 'Create portal'}
          </button>
        </form>
      </main>
    </div>
  )
}
