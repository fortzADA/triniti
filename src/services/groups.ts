import { supabase } from '@/lib/supabase'
import type { Group } from '@/lib/types'

export async function fetchGroups(userId?: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error

  const groups = (data || []) as Group[]
  if (!groups.length) return []

  const groupIds = groups.map((g) => g.id)
  const { data: members } = await supabase
    .from('group_members')
    .select('group_id, user_id')
    .in('group_id', groupIds)

  const counts = new Map<string, number>()
  const membership = new Set<string>()
  for (const m of members || []) {
    counts.set(m.group_id, (counts.get(m.group_id) || 0) + 1)
    if (userId && m.user_id === userId) membership.add(m.group_id)
  }

  return groups.map((g) => ({
    ...g,
    member_count: counts.get(g.id) || 0,
    is_member: membership.has(g.id),
  }))
}

export async function fetchGroupBySlug(slug: string, userId?: string): Promise<Group | null> {
  const { data, error } = await supabase.from('groups').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) return null

  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', data.id)

  return {
    ...(data as Group),
    member_count: members?.length || 0,
    is_member: userId ? (members || []).some((m) => m.user_id === userId) : false,
  }
}

export async function createGroup(
  createdBy: string,
  name: string,
  description: string,
): Promise<Group> {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || `group-${Date.now()}`

  const { data, error } = await supabase
    .from('groups')
    .insert({
      name,
      slug,
      description: description || null,
      created_by: createdBy,
    })
    .select()
    .single()
  if (error) throw error

  await supabase.from('group_members').insert({
    group_id: data.id,
    user_id: createdBy,
    role: 'admin',
  })

  return { ...(data as Group), member_count: 1, is_member: true }
}

export async function joinGroup(groupId: string, userId: string) {
  const { error } = await supabase.from('group_members').insert({
    group_id: groupId,
    user_id: userId,
    role: 'member',
  })
  if (error) throw error
}

export async function leaveGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
  if (error) throw error
}
