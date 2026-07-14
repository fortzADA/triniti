import { supabase } from '@/lib/supabase'
import type { Comment, Post } from '@/lib/types'
import { createNotification } from './notifications'

async function enrichPosts(posts: Post[], userId?: string): Promise<Post[]> {
  if (!posts.length) return []

  const postIds = posts.map((p) => p.id)
  const authorIds = [...new Set(posts.map((p) => p.author_id))]
  const groupIds = [...new Set(posts.map((p) => p.group_id).filter(Boolean))] as string[]

  const [{ data: authors }, { data: likes }, { data: comments }, { data: groups }] =
    await Promise.all([
      supabase.from('profiles').select('*').in('id', authorIds),
      supabase.from('likes').select('post_id, user_id').in('post_id', postIds),
      supabase.from('comments').select('post_id').in('post_id', postIds),
      groupIds.length
        ? supabase.from('groups').select('*').in('id', groupIds)
        : Promise.resolve({ data: [] as never[] }),
    ])

  const authorMap = new Map((authors || []).map((a) => [a.id, a]))
  const groupMap = new Map((groups || []).map((g) => [g.id, g]))
  const likeCounts = new Map<string, number>()
  const likedByMe = new Set<string>()
  const commentCounts = new Map<string, number>()

  for (const like of likes || []) {
    likeCounts.set(like.post_id, (likeCounts.get(like.post_id) || 0) + 1)
    if (userId && like.user_id === userId) likedByMe.add(like.post_id)
  }
  for (const c of comments || []) {
    commentCounts.set(c.post_id, (commentCounts.get(c.post_id) || 0) + 1)
  }

  return posts.map((p) => ({
    ...p,
    author: authorMap.get(p.author_id),
    group: p.group_id ? groupMap.get(p.group_id) || null : null,
    like_count: likeCounts.get(p.id) || 0,
    comment_count: commentCounts.get(p.id) || 0,
    liked_by_me: likedByMe.has(p.id),
  }))
}

export async function fetchFeed(userId?: string, groupId?: string | null): Promise<Post[]> {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (groupId) {
    query = query.eq('group_id', groupId)
  } else {
    query = query.is('group_id', null)
  }

  const { data, error } = await query
  if (error) throw error
  return enrichPosts((data || []) as Post[], userId)
}

export async function fetchPostsByAuthor(authorId: string, userId?: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', authorId)
    .is('group_id', null)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return enrichPosts((data || []) as Post[], userId)
}

export async function createPost(
  authorId: string,
  body: string,
  groupId?: string | null,
  mediaUrl?: string | null,
): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: authorId,
      body,
      group_id: groupId || null,
      media_url: mediaUrl || null,
    })
    .select()
    .single()
  if (error) throw error
  const [enriched] = await enrichPosts([data as Post], authorId)
  return enriched
}

export async function toggleLike(postId: string, userId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    if (error) throw error
    return false
  }

  const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: userId })
  if (error) throw error

  const { data: post } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  if (post && post.author_id !== userId) {
    await createNotification({
      user_id: post.author_id,
      type: 'like',
      actor_id: userId,
      entity_id: postId,
    })
  }

  return true
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error

  const comments = (data || []) as Comment[]
  if (!comments.length) return []

  const authorIds = [...new Set(comments.map((c) => c.author_id))]
  const { data: authors } = await supabase.from('profiles').select('*').in('id', authorIds)
  const authorMap = new Map((authors || []).map((a) => [a.id, a]))

  return comments.map((c) => ({ ...c, author: authorMap.get(c.author_id) }))
}

export async function createComment(postId: string, authorId: string, body: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, body })
    .select()
    .single()
  if (error) throw error

  const { data: post } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  if (post && post.author_id !== authorId) {
    await createNotification({
      user_id: post.author_id,
      type: 'comment',
      actor_id: authorId,
      entity_id: postId,
    })
  }

  return data as Comment
}
