import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ComposeBox } from '@/components/ComposeBox'
import { PostCard } from '@/components/PostCard'
import {
  createGroup,
  fetchGroupBySlug,
  fetchGroups,
  joinGroup,
  leaveGroup,
} from '@/services/groups'
import { createPost, fetchFeed } from '@/services/posts'
import type { Group, Post } from '@/lib/types'

export function GroupsPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!user) return
    try {
      setGroups(await fetchGroups(user.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!user || !name.trim()) return
    try {
      const group = await createGroup(user.id, name.trim(), description.trim())
      setGroups((prev) => [group, ...prev])
      setShowCreate(false)
      setName('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group')
    }
  }

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-bold">Groups</h1>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="text-sm font-medium text-[var(--color-accent)]"
        >
          {showCreate ? 'Cancel' : 'New'}
        </button>
      </header>

      {showCreate && (
        <form onSubmit={onCreate} className="space-y-2 border-b border-[var(--color-border)] px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-[var(--color-bg)]"
          >
            Create
          </button>
        </form>
      )}

      {loading && <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>}
      {error && <p className="px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}

      <ul>
        {groups.map((group) => (
          <li key={group.id} className="border-b border-[var(--color-border)] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link to={`/groups/${group.slug}`} className="font-semibold hover:underline">
                  {group.name}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {group.description || 'No description'}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {group.member_count || 0} members
                </p>
              </div>
              {user && (
                <button
                  type="button"
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
                    group.is_member
                      ? 'border border-[var(--color-border)] text-[var(--color-text-muted)]'
                      : 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                  }`}
                  onClick={async () => {
                    if (group.is_member) {
                      await leaveGroup(group.id, user.id)
                    } else {
                      await joinGroup(group.id, user.id)
                    }
                    await load()
                  }}
                >
                  {group.is_member ? 'Leave' : 'Join'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!loading && !groups.length && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          No groups yet. Create one to gather your community.
        </p>
      )}
    </div>
  )
}

export function GroupDetailPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!slug || !user) return
    try {
      const g = await fetchGroupBySlug(slug, user.id)
      setGroup(g)
      if (g?.is_member) {
        setPosts(await fetchFeed(user.id, g.id))
      } else {
        setPosts([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group')
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>
  }

  if (!group) {
    return <p className="px-4 py-8 text-center text-[var(--color-danger)]">Group not found</p>
  }

  return (
    <div>
      <header className="border-b border-[var(--color-border)] px-4 py-4">
        <Link to="/groups" className="text-sm text-[var(--color-accent)]">
          ← Groups
        </Link>
        <h1 className="mt-2 text-xl font-bold">{group.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{group.description}</p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {group.member_count} members
        </p>
        {user && (
          <button
            type="button"
            className="mt-3 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-[var(--color-bg)]"
            onClick={async () => {
              if (group.is_member) await leaveGroup(group.id, user.id)
              else await joinGroup(group.id, user.id)
              await load()
            }}
          >
            {group.is_member ? 'Leave group' : 'Join group'}
          </button>
        )}
      </header>

      {error && <p className="px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}

      {group.is_member ? (
        <>
          <ComposeBox
            placeholder={`Share with ${group.name}…`}
            onSubmit={async (body) => {
              if (!user) return
              const post = await createPost(user.id, body, group.id)
              setPosts((prev) => [post, ...prev])
            }}
          />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onChanged={load} />
          ))}
          {!posts.length && (
            <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
              No posts in this group yet.
            </p>
          )}
        </>
      ) : (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          Join this group to see and create posts.
        </p>
      )}
    </div>
  )
}
