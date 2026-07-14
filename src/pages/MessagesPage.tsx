import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/Avatar'
import {
  fetchConversations,
  fetchMessages,
  getOrCreateDirectConversation,
  sendMessage,
  subscribeToMessages,
} from '@/services/messages'
import { getProfileByUsername } from '@/services/auth'
import type { Conversation, Message } from '@/lib/types'

export function MessagesPage() {
  const { user, profile } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = useCallback(async () => {
    if (!user) return
    try {
      setConversations(await fetchConversations(user.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  async function startChat(e: FormEvent) {
    e.preventDefault()
    if (!user || !username.trim()) return
    try {
      const other = await getProfileByUsername(username.trim())
      if (!other) throw new Error('User not found')
      if (other.id === user.id) throw new Error('Cannot message yourself')
      const id = await getOrCreateDirectConversation(user.id, other.id)
      navigate(`/messages/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start chat')
    }
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-bold">Messages</h1>
      </header>

      <form onSubmit={startChat} className="flex gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Message @username"
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-bg)]"
        >
          Chat
        </button>
      </form>

      {error && <p className="px-4 py-2 text-sm text-[var(--color-danger)]">{error}</p>}
      {loading && <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">Loading…</p>}

      <ul>
        {conversations.map((conv) => {
          const other = (conv.members || []).find((m) => m.id !== profile?.id)
          return (
            <li key={conv.id}>
              <Link
                to={`/messages/${conv.id}`}
                className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 hover:bg-[var(--color-surface)]"
              >
                <Avatar profile={other} link={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {other?.display_name || 'Conversation'}
                  </p>
                  <p className="truncate text-sm text-[var(--color-text-muted)]">
                    {conv.last_message?.body || 'No messages yet'}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {!loading && !conversations.length && (
        <p className="px-4 py-8 text-center text-[var(--color-text-muted)]">
          Start a conversation by entering a username above.
        </p>
      )}
    </div>
  )
}

export function ConversationPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    let channel: ReturnType<typeof subscribeToMessages> | null = null

    async function load() {
      try {
        setMessages(await fetchMessages(id!))
      } finally {
        setLoading(false)
      }
    }

    void load()
    channel = subscribeToMessages(id, (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
    })

    return () => {
      void channel?.unsubscribe()
    }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function onSend(e: FormEvent) {
    e.preventDefault()
    if (!user || !id || !body.trim()) return
    const text = body.trim()
    setBody('')
    const msg = await sendMessage(id, user.id, text)
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--color-border)] px-4 py-3">
        <Link to="/messages" className="text-sm text-[var(--color-accent)]">
          ← Messages
        </Link>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading && <p className="text-center text-[var(--color-text-muted)]">Loading…</p>}
        {messages.map((msg) => {
          const mine = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? 'bg-[var(--color-accent-dim)] text-white'
                    : 'bg-[var(--color-surface-raised)]'
                }`}
              >
                {!mine && (
                  <p className="mb-0.5 text-xs text-[var(--color-text-muted)]">
                    {msg.sender?.display_name || profile?.display_name}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSend}
        className="flex gap-2 border-t border-[var(--color-border)] px-3 py-3"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Message…"
          className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={!body.trim()}
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  )
}
