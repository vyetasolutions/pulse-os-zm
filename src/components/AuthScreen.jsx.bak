import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      if (error) setError(error.message)
      else onAuthed(data.user)
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onAuthed(data.user)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-black text-slate-900 mb-1">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          {mode === 'signup'
            ? 'Report issues, track progress, help your community.'
            : 'Sign in to continue.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white"
          />

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          className="w-full text-center text-xs text-indigo-600 font-bold mt-4"
        >
          {mode === 'signup' ? 'Already have an account? Sign in' : "New here? Create an account"}
        </button>
      </div>
    </div>
  )
}
