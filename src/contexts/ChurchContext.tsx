import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getChurchBySlug } from '@/services/churches'
import type { Church, ChurchMember } from '@/lib/types'

type ChurchContextValue = {
  church: Church
  membership: ChurchMember | null
  isAdmin: boolean
  isActiveMember: boolean
  churchPath: (subpath?: string) => string
  refresh: () => Promise<void>
}

const ChurchContext = createContext<ChurchContextValue | undefined>(undefined)

export function ChurchProvider({ children }: { children?: ReactNode }) {
  const { slug } = useParams<{ slug: string }>()
  const { user, loading: authLoading } = useAuth()
  const [church, setChurch] = useState<Church | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!slug) return
    const data = await getChurchBySlug(slug, user?.id)
    setChurch(data)
  }, [slug, user?.id])

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!slug || authLoading) return
      setLoading(true)
      setError('')
      try {
        const data = await getChurchBySlug(slug, user?.id)
        if (!mounted) return
        setChurch(data)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load church')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [slug, user?.id, authLoading])

  const value = useMemo(() => {
    if (!church) return undefined
    const membership = church.my_membership || null
    const isActiveMember = membership?.status === 'active'
    const isAdmin =
      isActiveMember && (membership?.role === 'owner' || membership?.role === 'admin')
    return {
      church,
      membership,
      isAdmin,
      isActiveMember,
      churchPath: (subpath = '') => {
        const clean = subpath.replace(/^\//, '')
        return clean ? `/c/${church.slug}/${clean}` : `/c/${church.slug}`
      },
      refresh,
    }
  }, [church, refresh])

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
        Loading parish…
      </div>
    )
  }

  if (error || !church || !value) {
    return (
      <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-3 px-6 text-center">
        <p className="text-[var(--color-danger)]">{error || 'Church not found'}</p>
        <a href="/churches" className="text-[var(--color-accent)]">
          Back to churches
        </a>
      </div>
    )
  }

  if (!value.isActiveMember) {
    return <Navigate to={`/churches/${church.slug}`} replace />
  }

  return (
    <ChurchContext.Provider value={value}>{children ?? <Outlet />}</ChurchContext.Provider>
  )
}

export function useChurch() {
  const ctx = useContext(ChurchContext)
  if (!ctx) throw new Error('useChurch must be used within ChurchProvider')
  return ctx
}
