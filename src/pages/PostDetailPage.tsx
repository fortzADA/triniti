import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useChurch } from '@/contexts/ChurchContext'
import { Avatar } from '@/components/Avatar'
import { PostCard } from '@/components/PostCard'
import { supabase } from '@/lib/supabase'
import type { Comment, Post } from '@/lib/types'
import { getProfile } from '@/services/auth'
import { createComment, fetchComments, fetchFeed } from '@/services/posts'

export function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { church, churchPath } = useChurch()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!id || !user) return
    try {
      const feed = await fetchFeed(user.id, { churchId: church.id })
      let found = feed.find((p) => p.id === id) || null

      if (!found) {
        const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
        if (data && (data as Post).church_id === church.id) {
          const author = await getProfile(data.author_id)
          const { count: likeCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', id)
          const { data: myLike } = await supabase
            .from('likes')
            .select('post_id')
            .eq('post_id', id)
            .eq('user_id', user.id)
            .maybeSingle()
          found = {
            ...(data as Post),
            author: author || undefined,
            like_count: likeCount || 0,
            liked_by_me: !!myLike,
            comment_count: 0,
          }
        }
      }

      setPost(found)
      const list = await fetchComments(id)
      setComments(list)
      if (found) {
        setPost({ ...found, comment_count: list.length })
      }
    } finally {
      setLoading(false)
    }
  }, [id, user, church.id])

  useEffect(() => {
    void load()
  }, [load])

  async function onComment(e: FormEvent) {
    e.preventDefault()
    if (!user || !id || !body.trim() || busy) return
    setBusy(true)
    try {
      await createComment(id, user.id, body.trim())
      setBody('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>
  }

  if (!post) {
    return <p className="px-4 py-8 text-center text-[var(--color-danger)]">Post not found</p>
  }

  return (
    <div>
      <header className="border-b border-[var(--color-border)] px-4 py-3">
        <Link to={churchPath('feed')} className="text-sm text-[var(--color-accent)]">
          ← Feed
        </Link>
      </header>
      <PostCard
        post={post}
        onChanged={load}
        postHref={churchPath(`post/${post.id}`)}
        authorHref={post.author ? churchPath(`u/${post.author.username}`) : undefined}
        groupHref={post.group ? churchPath(`groups/${post.group.slug}`) : undefined}
      />
      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Comments
        </h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <Avatar profile={c.author} size="sm" />
              <div>
                <p className="text-sm font-medium">{c.author?.display_name}</p>
                <p className="text-sm">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
        {!comments.length && (
          <p className="text-sm text-[var(--color-text-muted)]">No comments yet.</p>
        )}
        <form className="mt-4 flex gap-2" onSubmit={onComment}>
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
          />
          <button
            type="submit"
            disabled={busy || !body.trim()}
            className="rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-40"
          >
            Reply
          </button>
        </form>
      </div>
    </div>
  )
}
