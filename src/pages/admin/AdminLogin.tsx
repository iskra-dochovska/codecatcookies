import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setSubmitting(false)
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-cookie-charcoal px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-cookie-charcoal/15 bg-white p-8"
      >
        <h1 className="text-center text-xl font-black text-cookie-brown uppercase">
          Admin login
        </h1>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-cookie-charcoal/20 px-4 py-2 text-cookie-charcoal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border border-cookie-charcoal/20 px-4 py-2 text-cookie-charcoal"
          />
        </label>

        {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-bold text-cookie-cream uppercase disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
