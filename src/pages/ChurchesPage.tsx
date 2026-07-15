import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TrinityLogo } from '@/components/TrinityLogo'
import { buildGlobePins, type GlobeChurchPin } from '@/data/romanianChurches'
import { listPublicChurches } from '@/services/churches'
import type { Church } from '@/lib/types'

const ChurchGlobe = lazy(() =>
  import('@/components/ChurchGlobe').then((m) => ({ default: m.ChurchGlobe })),
)

function scorePinMatch(pin: GlobeChurchPin, q: string): number {
  const city = pin.city.toLowerCase()
  const country = pin.country.toLowerCase()
  const name = pin.name.toLowerCase()
  const slug = pin.suggestedSlug.toLowerCase()

  if (city === q || slug === q) return 100
  if (city.startsWith(q)) return 90
  if (name.startsWith(q)) return 80
  if (city.includes(q)) return 70
  if (name.includes(q)) return 60
  if (country.startsWith(q) || country.includes(q)) return 40
  if (slug.includes(q)) return 30
  return 0
}

function findBestPin(pins: GlobeChurchPin[], query: string): GlobeChurchPin | null {
  const q = query.trim().toLowerCase()
  if (!q) return null

  let best: GlobeChurchPin | null = null
  let bestScore = 0
  for (const pin of pins) {
    const score = scorePinMatch(pin, q)
    if (score > bestScore) {
      best = pin
      bestScore = score
    }
  }
  return bestScore > 0 ? best : null
}

export function ChurchesPage() {
  const { user } = useAuth()
  const [churches, setChurches] = useState<Church[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<GlobeChurchPin | null>(null)
  const [searchMiss, setSearchMiss] = useState(false)
  const [flyKey, setFlyKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setChurches(await listPublicChurches())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load churches')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const pins = useMemo(() => buildGlobePins(churches), [churches])

  /** Debounced search → select best pin so the globe spins there. */
  useEffect(() => {
    const q = search.trim()
    if (!q) {
      setSearchMiss(false)
      return
    }

    const t = window.setTimeout(() => {
      const match = findBestPin(pins, q)
      if (match) {
        setSearchMiss(false)
        setSelected((prev) => (prev?.id === match.id ? prev : match))
      } else {
        setSearchMiss(true)
      }
    }, 280)

    return () => window.clearTimeout(t)
  }, [search, pins])

  function goToSearch(e?: FormEvent) {
    e?.preventDefault()
    const match = findBestPin(pins, search)
    if (match) {
      setSearchMiss(false)
      setSelected(match)
      setFlyKey((k) => k + 1)
    } else if (search.trim()) {
      setSearchMiss(true)
    }
  }

  const authSignupTo = '/auth'
  const authState = selected
    ? {
        from: {
          pathname: selected.portalSlug
            ? `/churches/${selected.portalSlug}`
            : '/churches/new',
        },
        churchHint: {
          name: selected.name,
          city: selected.city,
          country: selected.country,
          suggestedSlug: selected.suggestedSlug,
        },
      }
    : { from: { pathname: '/churches' } }

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <header
        className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md"
        style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <TrinityLogo size={36} />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={user ? '/churches/new' : '/auth'}
              state={user ? undefined : { from: { pathname: '/churches/new' } }}
              className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-[var(--color-bg)]"
            >
              Create church
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="rounded-md border border-[var(--color-gold)] px-3 py-1.5 text-sm text-[var(--color-gold)]"
              >
                Sign up
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-gold)] uppercase">
          Find a church
        </p>
        <h1 className="mt-2 font-[Cormorant_Garamond,Georgia,serif] text-4xl text-[var(--color-accent)] md:text-5xl">
          Romanian churches worldwide
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
          Spin the Earth globe and tap a pin — it slow-motions into that parish.
        </p>

        <form className="mt-5 flex flex-wrap gap-2" onSubmit={goToSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a city or parish — globe zooms there"
            className="min-w-[220px] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm"
          >
            Go
          </button>
        </form>

        {searchMiss && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            No pin matches “{search.trim()}”. Try a city like London, Paris, or Cluj.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="relative h-[min(70vh,640px)] overflow-hidden border border-[var(--color-border)] bg-[radial-gradient(ellipse_at_center,#0f241c_0%,#070f0c_70%)] shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
                  Loading Earth…
                </div>
              }
            >
              <ChurchGlobe
                pins={pins}
                selectedId={selected?.id ?? null}
                flyKey={flyKey}
                onSelect={setSelected}
              />
            </Suspense>

            <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-md bg-[var(--color-bg)]/75 px-3 py-2 text-xs text-[var(--color-text-muted)] backdrop-blur-sm">
              <span className="mr-3 inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-gold)]" />
                Landmark
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                Live on Trinity
              </span>
            </div>
          </div>

          <aside className="border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-5 lg:sticky lg:top-24 lg:self-start">
            {selected ? (
              <div className="animate-[pres-fade-up_0.45s_ease-out]">
                <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)] uppercase">
                  Selected parish
                </p>
                <h2 className="mt-2 font-[Cormorant_Garamond,Georgia,serif] text-2xl text-[var(--color-accent)]">
                  {selected.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {selected.address
                    ? selected.address
                    : `${selected.city}, ${selected.country}`}
                </p>
                {selected.address && (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {selected.city}, {selected.country}
                  </p>
                )}
                {selected.portalSlug ? (
                  <p className="mt-3 text-sm text-[var(--color-accent)]">
                    This parish has a Trinity portal.
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    Not on Trinity yet — sign up to join, or create a portal for this community.
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-2">
                  {!user ? (
                    <Link
                      to={authSignupTo}
                      state={authState}
                      className="rounded-md bg-[var(--color-accent)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-bg)]"
                    >
                      Sign up
                    </Link>
                  ) : null}

                  {selected.portalSlug ? (
                    <>
                      <Link
                        to={`/churches/${selected.portalSlug}`}
                        className="rounded-md border border-[var(--color-gold)] px-4 py-2.5 text-center text-sm text-[var(--color-gold)]"
                      >
                        View portal
                      </Link>
                      {user ? (
                        <Link
                          to={`/churches/${selected.portalSlug}`}
                          className="rounded-md border border-[var(--color-border)] px-4 py-2.5 text-center text-sm"
                        >
                          Request to join
                        </Link>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      to={user ? '/churches/new' : '/auth'}
                      state={
                        user
                          ? undefined
                          : { from: { pathname: '/churches/new' }, churchHint: authState.churchHint }
                      }
                      className="rounded-md border border-[var(--color-gold)] px-4 py-2.5 text-center text-sm text-[var(--color-gold)]"
                    >
                      Create portal here
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="mt-1 text-sm text-[var(--color-text-muted)] underline-offset-2 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-gold)] uppercase">
                  How it works
                </p>
                <h2 className="mt-2 font-[Cormorant_Garamond,Georgia,serif] text-2xl text-[var(--color-accent)]">
                  Tap a pin
                </h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
                  <li>Tap a pin on the Earth globe.</li>
                  <li>The camera turns, then slow-motions into that parish.</li>
                  <li>Sign up to join — or open a live portal if it already exists.</li>
                </ol>
                <p className="mt-5 text-xs text-[var(--color-text-muted)]">
                  {loading ? 'Syncing live churches…' : `${pins.length} pins on the map`}
                </p>
              </div>
            )}
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="font-[Cormorant_Garamond,Georgia,serif] text-2xl text-[var(--color-accent)]">
            Live Trinity portals
          </h2>
          <ul className="mt-4 space-y-3">
            {churches.map((church) => (
              <li key={church.id}>
                <Link
                  to={`/churches/${church.slug}`}
                  className="block border-t-2 border-[var(--color-gold)] bg-[var(--color-surface)]/80 px-4 py-4 transition hover:bg-[var(--color-surface-raised)]"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-accent)]">{church.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {[church.city, church.country].filter(Boolean).join(', ') || 'Location coming soon'}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {!loading && !churches.length && !error && (
            <p className="mt-6 text-[var(--color-text-muted)]">
              No public portals yet — create one from a pin or use Create church.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
