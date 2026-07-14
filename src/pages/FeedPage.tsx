import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useChurch } from '@/contexts/ChurchContext'
import { ComposeBox } from '@/components/ComposeBox'
import { PostCard } from '@/components/PostCard'
import { createPost, fetchFeed } from '@/services/posts'
import type { Post } from '@/lib/types'

export function FeedPage() {
  const { user } = useAuth()
  const { church, churchPath } = useChurch()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!user) return
    try {
      setError('')
      const data = await fetchFeed(user.id, { churchId: church.id })
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [user, church.id])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-[var(--color-accent)]">{church.name}</span>
            <span className="ml-2 font-normal text-[var(--color-text-muted)]">Feed</span>
          </h1>
          <Link to={`/churches/${church.slug}`} className="text-xs text-[var(--color-text-muted)]">
            Portal
          </Link>
        </div>
      </header>

      <ComposeBox
        onSubmit={async (body) => {
          if (!user) return
          const post = await createPost(user.id, body, { churchId: church.id })
          setPosts((prev) => [post, ...prev])
        }}
      />

      {loading && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading feed…</p>
      )}
      {error && <p className="px-4 py-4 text-sm text-[var(--color-danger)]">{error}</p>}
      {!loading && !posts.length && !error && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          No posts yet. Be the first to share something with {church.name}.
        </p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onChanged={load}
          postHref={churchPath(`post/${post.id}`)}
          authorHref={post.author ? churchPath(`u/${post.author.username}`) : undefined}
          groupHref={
            post.group ? churchPath(`groups/${post.group.slug}`) : undefined
          }
        />
      ))}
    </div>
  )
}
