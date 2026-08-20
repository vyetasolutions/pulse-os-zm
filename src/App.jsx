import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import AuthScreen from './components/AuthScreen'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading...</div>

  if (!session) return <AuthScreen onAuthed={() => {}} />

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
      <p className="text-sm text-slate-700">Signed in as <strong>{session.user.email}</strong></p>
      <button
        onClick={() => supabase.auth.signOut()}
        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
      >
        Sign out
      </button>
    </div>
  )
}

export default App
