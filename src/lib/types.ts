export type Profile = {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type Post = {
  id: string
  author_id: string
  group_id: string | null
  body: string
  media_url: string | null
  created_at: string
  author?: Profile
  like_count?: number
  comment_count?: number
  liked_by_me?: boolean
  group?: Group | null
}

export type Comment = {
  id: string
  post_id: string
  author_id: string
  body: string
  created_at: string
  author?: Profile
}

export type Group = {
  id: string
  name: string
  slug: string
  description: string | null
  avatar_url: string | null
  created_by: string
  created_at: string
  member_count?: number
  is_member?: boolean
}

export type Conversation = {
  id: string
  is_group_dm: boolean
  created_at: string
  members?: Profile[]
  last_message?: Message | null
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  sender?: Profile
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'group_invite'
  | 'message'
  | 'follow'

export type Notification = {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string | null
  entity_id: string | null
  read_at: string | null
  created_at: string
  actor?: Profile | null
}
