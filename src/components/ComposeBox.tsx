import { useState, type FormEvent } from 'react'

type Props = {
  placeholder?: string
  onSubmit: (body: string) => Promise<void>
  buttonLabel?: string
}

export function ComposeBox({
  placeholder = 'What is happening in your community?',
  onSubmit,
  buttonLabel = 'Post',
}: Props) {
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!body.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      await onSubmit(body.trim())
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-[var(--color-border)] px-4 py-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-accent-dim)]"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-muted)]">{body.length}/2000</span>
        <button
          type="submit"
          disabled={!body.trim() || busy}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-40"
        >
          {busy ? '…' : buttonLabel}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}
    </form>
  )
}
