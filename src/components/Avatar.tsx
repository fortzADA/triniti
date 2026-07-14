import { Link, useParams } from 'react-router-dom'
import type { Profile } from '@/lib/types'

type Props = {
  profile?: Profile | null
  size?: 'sm' | 'md' | 'lg'
  link?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
}

export function Avatar({ profile, size = 'md', link = true }: Props) {
  const { slug } = useParams<{ slug?: string }>()
  const initials = (profile?.display_name || profile?.username || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const content = profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt={profile.display_name}
      className={`${sizes[size]} rounded-full object-cover bg-[var(--color-surface-raised)]`}
    />
  ) : (
    <div
      className={`${sizes[size]} rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center font-semibold text-[var(--color-accent)]`}
    >
      {initials}
    </div>
  )

  if (link && profile?.username) {
    const to = slug ? `/c/${slug}/u/${profile.username}` : `/churches`
    return <Link to={to}>{content}</Link>
  }

  return content
}
