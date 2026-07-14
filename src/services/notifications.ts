import { supabase } from '@/lib/supabase'
import type { Notification, NotificationType } from '@/lib/types'

export async function createNotification(input: {
  user_id: string
  type: NotificationType
  actor_id: string | null
  entity_id: string | null
}) {
  const { error } = await supabase.from('notifications').insert(input)
  if (error) console.error('Failed to create notification', error)
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error

  const notifications = (data || []) as Notification[]
  const actorIds = [...new Set(notifications.map((n) => n.actor_id).filter(Boolean))] as string[]

  if (!actorIds.length) return notifications

  const { data: actors } = await supabase.from('profiles').select('*').in('id', actorIds)
  const actorMap = new Map((actors || []).map((a) => [a.id, a]))

  return notifications.map((n) => ({
    ...n,
    actor: n.actor_id ? actorMap.get(n.actor_id) || null : null,
  }))
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)
  if (error) throw error
}

export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: Notification) => void,
) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNotification(payload.new as Notification)
      },
    )
    .subscribe()
}
