import { supabase } from '@/lib/supabase'
import type { Conversation, Message, Profile } from '@/lib/types'
import { createNotification } from './notifications'

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data: memberships, error } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId)
  if (error) throw error

  const ids = (memberships || []).map((m) => m.conversation_id)
  if (!ids.length) return []

  const { data: conversations, error: cErr } = await supabase
    .from('conversations')
    .select('*')
    .in('id', ids)
    .order('created_at', { ascending: false })
  if (cErr) throw cErr

  const result: Conversation[] = []

  for (const conv of conversations || []) {
    const { data: memberRows } = await supabase
      .from('conversation_members')
      .select('user_id')
      .eq('conversation_id', conv.id)

    const memberIds = (memberRows || []).map((m) => m.user_id)
    const { data: profiles } = await supabase.from('profiles').select('*').in('id', memberIds)

    const { data: lastMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1)

    result.push({
      ...(conv as Conversation),
      members: (profiles || []) as Profile[],
      last_message: (lastMessages?.[0] as Message) || null,
    })
  }

  return result.sort((a, b) => {
    const aTime = a.last_message?.created_at || a.created_at
    const bTime = b.last_message?.created_at || b.created_at
    return bTime.localeCompare(aTime)
  })
}

export async function getOrCreateDirectConversation(
  _currentUserId: string,
  otherUserId: string,
): Promise<string> {
  const { data, error } = await supabase.rpc('create_direct_conversation', {
    other_user_id: otherUserId,
  })
  if (error) throw error
  return data as string
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error

  const messages = (data || []) as Message[]
  if (!messages.length) return []

  const senderIds = [...new Set(messages.map((m) => m.sender_id))]
  const { data: senders } = await supabase.from('profiles').select('*').in('id', senderIds)
  const senderMap = new Map((senders || []).map((s) => [s.id, s]))

  return messages.map((m) => ({ ...m, sender: senderMap.get(m.sender_id) }))
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select()
    .single()
  if (error) throw error

  const { data: members } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId)

  await Promise.all(
    (members || [])
      .filter((m) => m.user_id !== senderId)
      .map((m) =>
        createNotification({
          user_id: m.user_id,
          type: 'message',
          actor_id: senderId,
          entity_id: conversationId,
        }),
      ),
  )

  return data as Message
}

export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: Message) => void,
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message)
      },
    )
    .subscribe()
}
