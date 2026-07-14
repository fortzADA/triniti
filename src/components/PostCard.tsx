import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '@/lib/types'
import { Avatar } from './Avatar'
import { toggleLike } from '@/services/posts'
import { useAuth } from '@/contexts/AuthContext'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

type Props = {
  post: Post
  onChanged?: () => void
}

export function PostCard({ post, onChanged }: Props) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(!!post.liked_by_me)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [busy, setBusy] = useState(false)

  async function onLike() {
    if (!user || busy) return
    setBusy(true)
    const prevLiked = liked
    const prevCount = likeCount
    setLiked(!prevLiked)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)
    try {
      await toggleLike(post.id, user.id, prevLiked)
      onChanged?.()
    } catch {
      setLiked(prevLiked)
      setLikeCount(prevCount)
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="border-b border-[var(--color-border)] px-4 py-4">
      <div className="flex gap-3">
        <Avatar profile={post.author} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <Link
              to={`/u/${post.author?.username}`}
              className="truncate font-semibold hover:underline"
            >
              {post.author?.display_name || 'Member'}
            </Link>
            <span className="truncate text-sm text-[var(--color-text-muted)]">
              @{post.author?.username}
            </span>
            <span className="ml-auto shrink-0 text-xs text-[var(--color-text-muted)]">
              {timeAgo(post.created_at)}
            </span>
          </div>
          {post.group && (
            <Link
              to={`/groups/${post.group.slug}`}
              className="text-xs text-[var(--color-accent-dim)] hover:underline"
            >
              in {post.group.name}
            </Link>
          )}
          <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {post.body}
          </p>
          {post.media_url && (
            <img
              src={post.media_url}
              alt=""
              className="mt-3 max-h-80 w-full rounded-lg object-cover border border-[var(--color-border)]"
            />
          )}
          <div className="mt-3 flex gap-6 text-sm text-[var(--color-text-muted)]">
            <button
              type="button"
              onClick={onLike}
              className={`hover:text-[var(--color-like)] ${liked ? 'text-[var(--color-like)]' : ''}`}
            >
              ♥ {likeCount}
            </button>
            <Link to={`/post/${post.id}`} className="hover:text-[var(--color-text)]">
              💬 {post.comment_count || 0}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
