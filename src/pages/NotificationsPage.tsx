import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/Avatar'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from '@/services/notifications'
import type { Notification } from '@/lib/types'

function labelFor(n: Notification) {
  const name = n.actor?.display_name || 'Someone'
  switch (n.type) {
    case 'like':
      return `${name} liked your post`
    case 'comment':
      return `${name} commented on your post`
    case 'message':
      return `${name} sent you a message`
    case 'group_invite':
      return `${name} invited you to a group`
    case 'follow':
      return `${name} followed you`
    default:
      return 'New notification'
  }
}

function linkFor(n: Notification) {
  if (n.type === 'message' && n.entity_id) return `/messages/${n.entity_id}`
  if ((n.type === 'like' || n.type === 'comment') && n.entity_id) return `/post/${n.entity_id}`
  return '/notifications'
}

export function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    try {
      setItems(await fetchNotifications(user.id))
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!user) return
    const channel = subscribeToNotifications(user.id, (n) => {
      setItems((prev) => [n, ...prev])
    })
    return () => {
      void channel.unsubscribe()
    }
  }, [user])

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-bold">Notifications</h1>
        {user && items.some((n) => !n.read_at) && (
          <button
            type="button"
            className="text-sm text-[var(--color-accent)]"
            onClick={async () => {
              await markAllNotificationsRead(user.id)
              await load()
            }}
          >
            Mark all read
          </button>
        )}
      </header>

      {loading && <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>}

      <ul>
        {items.map((n) => (
          <li key={n.id}>
            <Link
              to={linkFor(n)}
              onClick={async () => {
                if (!n.read_at) {
                  await markNotificationRead(n.id)
                  setItems((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, read_at: new Date().toISOString() } : item,
                    ),
                  )
                }
              }}
              className={`flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 ${
                n.read_at ? 'opacity-70' : 'bg-[var(--color-surface)]'
              }`}
            >
              <Avatar profile={n.actor} link={false} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{labelFor(n)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              {!n.read_at && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {!loading && !items.length && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          You are all caught up.
        </p>
      )}
    </div>
  )
}
