import { useState, type FormEvent } from 'react'
import { subscribeEmail } from '../lib/subscribe'

type Props = {
  open: boolean
  onClose: () => void
}

function NotifyModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await subscribeEmail(email)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-cookie-cream p-6 text-cookie-charcoal dark:bg-cookie-charcoal dark:text-cookie-cream"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="float-right text-xl leading-none text-cookie-brown dark:text-cookie-gold"
        >
          &times;
        </button>

        {status === 'success' ? (
          <p className="pt-6 pb-2 text-center font-bold">
            Thanks! We&apos;ll let you know when we launch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-8">
            <label htmlFor="notify-email" className="text-sm font-semibold">
              Get notified when we launch
            </label>
            <input
              id="notify-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-full border border-cookie-brown/30 bg-transparent px-4 py-2 text-sm outline-none focus:border-cookie-rust dark:border-cookie-gold/40"
            />
            {status === 'error' && <p className="text-sm text-cookie-rust">{error}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-full bg-cookie-rust px-6 py-2 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Notify me'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default NotifyModal
