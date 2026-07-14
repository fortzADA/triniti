import { supabase } from '@/lib/supabase'
import type { Church, ChurchMember } from '@/lib/types'

export function slugifyChurchName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || `church-${Date.now()}`
  )
}

export async function listPublicChurches(search?: string): Promise<Church[]> {
  let query = supabase
    .from('churches')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (search?.trim()) {
    const q = `%${search.trim()}%`
    query = query.or(`name.ilike.${q},city.ilike.${q},country.ilike.${q}`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Church[]
}

export async function getChurchBySlug(slug: string, userId?: string): Promise<Church | null> {
  const { data, error } = await supabase
    .from('churches')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  const church = data as Church

  const { count } = await supabase
    .from('church_members')
    .select('*', { count: 'exact', head: true })
    .eq('church_id', church.id)
    .eq('status', 'active')

  let my_membership: ChurchMember | null = null
  if (userId) {
    const { data: membership } = await supabase
      .from('church_members')
      .select('*')
      .eq('church_id', church.id)
      .eq('user_id', userId)
      .maybeSingle()
    my_membership = (membership as ChurchMember) || null
  }

  return {
    ...church,
    member_count: count || 0,
    my_membership,
  }
}

export async function createChurch(input: {
  name: string
  slug: string
  tagline?: string
  description?: string
  city?: string
  country?: string
}): Promise<Church> {
  const { data, error } = await supabase.rpc('create_church', {
    p_name: input.name,
    p_slug: input.slug,
    p_tagline: input.tagline || null,
    p_description: input.description || null,
    p_city: input.city || null,
    p_country: input.country || null,
  })
  if (error) throw error
  return data as Church
}

export async function requestJoinChurch(churchId: string, userId: string): Promise<ChurchMember> {
  const { data, error } = await supabase
    .from('church_members')
    .insert({
      church_id: churchId,
      user_id: userId,
      role: 'member',
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data as ChurchMember
}

export async function listMyMemberships(userId: string): Promise<ChurchMember[]> {
  const { data, error } = await supabase
    .from('church_members')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error

  const memberships = (data || []) as ChurchMember[]
  if (!memberships.length) return []

  const churchIds = memberships.map((m) => m.church_id)
  const { data: churches } = await supabase.from('churches').select('*').in('id', churchIds)
  const map = new Map((churches || []).map((c) => [c.id, c as Church]))

  return memberships.map((m) => ({ ...m, church: map.get(m.church_id) }))
}

export async function listPendingMembers(churchId: string): Promise<ChurchMember[]> {
  const { data, error } = await supabase
    .from('church_members')
    .select('*')
    .eq('church_id', churchId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) throw error

  const memberships = (data || []) as ChurchMember[]
  if (!memberships.length) return []

  const userIds = memberships.map((m) => m.user_id)
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds)
  const map = new Map((profiles || []).map((p) => [p.id, p]))

  return memberships.map((m) => ({ ...m, profile: map.get(m.user_id) }))
}

export async function approveMember(churchId: string, userId: string) {
  const { error } = await supabase
    .from('church_members')
    .update({ status: 'active', role: 'member' })
    .eq('church_id', churchId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function rejectMember(churchId: string, userId: string) {
  const { error } = await supabase
    .from('church_members')
    .delete()
    .eq('church_id', churchId)
    .eq('user_id', userId)
  if (error) throw error
}
