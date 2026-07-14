import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { TabBar } from './TabBar'
import { TrinityLogo } from './TrinityLogo'
import { isSupabaseConfigured } from '@/lib/supabase'

export function AppShell() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-text-muted)]">
        Loading Trinity…
      </div>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-4 px-6 text-center">
        <div className="flex justify-center">
          <TrinityLogo size={64} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-accent)]">Trinity</h1>
        <p className="text-[var(--color-text-muted)]">
          Add your Supabase credentials to <code className="text-[var(--color-text)]">.env</code>{' '}
          (see <code className="text-[var(--color-text)]">.env.example</code>) and restart the
          dev server.
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col">
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: 'var(--safe-top)',
          paddingBottom: 'calc(4.5rem + var(--safe-bottom))',
        }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
