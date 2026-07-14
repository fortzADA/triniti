import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/Avatar'
import { PostCard } from '@/components/PostCard'
import {
  getProfileByUsername,
  signOut,
  updateProfile,
  uploadAvatar,
} from '@/services/auth'
import { fetchPostsByAuthor } from '@/services/posts'
import { getOrCreateDirectConversation } from '@/services/messages'
import type { Post, Profile } from '@/lib/types'

export function ProfilePage() {
  const { profile, user, refreshProfile, setProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setDisplayName(profile?.display_name || '')
    setBio(profile?.bio || '')
    setUsername(profile?.username || '')
  }, [profile])

  const loadPosts = useCallback(async () => {
    if (!user) return
    setPosts(await fetchPostsByAuthor(user.id, user.id))
  }, [user])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setBusy(true)
    setError('')
    try {
      const updated = await updateProfile(user.id, {
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        username: username.trim().toLowerCase(),
      })
      setProfile(updated)
      setEditing(false)
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setBusy(false)
    }
  }

  async function onAvatar(file: File | null) {
    if (!file || !user) return
    setBusy(true)
    try {
      const url = await uploadAvatar(user.id, file)
      const updated = await updateProfile(user.id, { avatar_url: `${url}?t=${Date.now()}` })
      setProfile(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avatar upload failed')
    } finally {
      setBusy(false)
    }
  }

  if (!profile) {
    return <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading profile…</p>
  }

  return (
    <div>
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <h1 className="text-lg font-bold">Profile</h1>
        <button
          type="button"
          onClick={async () => {
            await signOut()
          }}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
        >
          Sign out
        </button>
      </header>

      <div className="px-4 py-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar profile={profile} size="lg" link={false} />
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-bg)]">
              Edit
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onAvatar(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold">{profile.display_name}</h2>
            <p className="text-[var(--color-text-muted)]">@{profile.username}</p>
            {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="mt-3 text-sm text-[var(--color-accent)]"
            >
              {editing ? 'Cancel' : 'Edit profile'}
            </button>
          </div>
        </div>

        {editing && (
          <form onSubmit={onSave} className="mt-4 space-y-2">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
              required
            />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
              required
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]"
            >
              Save
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}
      </div>

      <h3 className="border-t border-[var(--color-border)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        Your posts
      </h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onChanged={loadPosts} />
      ))}
      {!posts.length && (
        <p className="px-4 py-6 text-center text-[var(--color-text-muted)]">No posts yet.</p>
      )}
    </div>
  )
}

export function UserProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setLocalProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!username) return
      try {
        const p = await getProfileByUsername(username)
        setLocalProfile(p)
        if (p) setPosts(await fetchPostsByAuthor(p.id, user?.id))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [username, user?.id])

  if (loading) {
    return <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>
  }

  if (!profile) {
    return <p className="px-4 py-8 text-center text-[var(--color-danger)]">User not found</p>
  }

  const isSelf = user?.id === profile.id

  return (
    <div>
      <header className="border-b border-[var(--color-border)] px-4 py-3">
        <Link to="/feed" className="text-sm text-[var(--color-accent)]">
          ← Feed
        </Link>
      </header>
      <div className="flex items-start gap-4 px-4 py-6">
        <Avatar profile={profile} size="lg" link={false} />
        <div>
          <h1 className="text-xl font-bold">{profile.display_name}</h1>
          <p className="text-[var(--color-text-muted)]">@{profile.username}</p>
          {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
          {isSelf ? (
            <Link to="/profile" className="mt-3 inline-block text-sm text-[var(--color-accent)]">
              Edit your profile
            </Link>
          ) : (
            <button
              type="button"
              className="mt-3 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-[var(--color-bg)]"
              onClick={async () => {
                if (!user) return
                const conversationId = await getOrCreateDirectConversation(user.id, profile.id)
                navigate(`/messages/${conversationId}`)
              }}
            >
              Message
            </button>
          )}
        </div>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {!posts.length && (
        <p className="px-4 py-6 text-center text-[var(--color-text-muted)]">No posts yet.</p>
      )}
    </div>
  )
}
