import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setReady(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center bg-cookie-charcoal text-cookie-cream">
        Loading...
      </div>
    )
  }

  return session ? <AdminDashboard /> : <AdminLogin />
}

export default Admin
