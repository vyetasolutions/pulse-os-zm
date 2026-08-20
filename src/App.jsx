import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import AuthScreen from './components/AuthScreen'
import ConstituencyPicker from './components/ConstituencyPicker'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [debugError, setDebugError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile load failed:', error)
      setDebugError(`Profile load error: ${error.message} (code: ${error.code})`)
      setLoading(false)
      return
    }

    console.log('Profile loaded:', data)
    setProfile(data)
    setDebugError(null)
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading...</div>
  }

  if (!session) return <AuthScreen onAuthed={() => {}} />

  // Surface any profile load failure directly on screen instead of falling through silently
  if (debugError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-700 space-y-2">
          <p className="font-bold">Something went wrong loading your profile:</p>
          <p className="font-mono">{debugError}</p>
          <button
            onClick={() => loadProfile(session.user.id)}
            className="bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-lg mt-2"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (profile && !profile.constituency_id) {
    return (
      <ConstituencyPicker
        userId={session.user.id}
        onComplete={() => loadProfile(session.user.id)}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
      <p className="text-sm text-slate-700">
        Signed in as <strong>{session.user.email}</strong>
      </p>
      <p className="text-xs text-slate-400">
        Constituency: {profile?.constituency_id ? profile.constituency_id : 'none set'}
      </p>
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
