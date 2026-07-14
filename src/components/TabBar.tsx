import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const tabs = [
  { to: '/feed', label: 'Feed', icon: '⌂' },
  { to: '/groups', label: 'Groups', icon: '◎' },
  { to: '/messages', label: 'Messages', icon: '✉' },
  { to: '/notifications', label: 'Alerts', icon: '◉' },
  { to: '/profile', label: 'Profile', icon: '☺' },
]

export function TabBar() {
  const { profile } = useAuth()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to === '/profile' && profile ? '/profile' : tab.to}
            end={tab.to === '/feed'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] tracking-wide ${
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`
            }
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
