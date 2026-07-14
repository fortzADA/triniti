import { NavLink, useParams } from 'react-router-dom'

const tabs = [
  { path: 'feed', label: 'Feed', icon: '⌂', end: true },
  { path: 'groups', label: 'Groups', icon: '◎', end: false },
  { path: 'messages', label: 'Messages', icon: '✉', end: false },
  { path: 'notifications', label: 'Alerts', icon: '◉', end: false },
  { path: 'profile', label: 'Profile', icon: '☺', end: false },
]

export function TabBar() {
  const { slug } = useParams<{ slug: string }>()
  const base = slug ? `/c/${slug}` : ''

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`${base}/${tab.path}`}
            end={tab.end}
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
