import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ComposeBox } from '@/components/ComposeBox'
import { PostCard } from '@/components/PostCard'
import { TrinityLogo } from '@/components/TrinityLogo'
import { createPost, fetchFeed } from '@/services/posts'
import type { Post } from '@/lib/types'

export function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!user) return
    try {
      setError('')
      const data = await fetchFeed(user.id)
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md">
        <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <TrinityLogo size={28} />
          <span className="text-[var(--color-accent)]">Trinity</span>
          <span className="font-normal text-[var(--color-text-muted)]">Feed</span>
        </h1>
      </header>

      <ComposeBox
        onSubmit={async (body) => {
          if (!user) return
          const post = await createPost(user.id, body)
          setPosts((prev) => [post, ...prev])
        }}
      />

      {loading && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading feed…</p>
      )}
      {error && <p className="px-4 py-4 text-sm text-[var(--color-danger)]">{error}</p>}
      {!loading && !posts.length && !error && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          No posts yet. Be the first to share something.
        </p>
      )}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onChanged={load} />
      ))}
    </div>
  )
}
