import { useState } from 'react'
import { supabase } from '../lib/supabase'
import logoFull from '../assets/logo-full.png'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setSubmitting(true)
    setError('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <img src={logoFull} alt="Civic Pulse" className="h-16 mx-auto object-contain" />
        {success ? (
          <div className="text-center space-y-2">
            <span className="text-3xl">✅</span>
            <p className="text-sm font-bold text-slate-900">Password updated</p>
            <a href="/" className="text-xs text-indigo-700 underline">Continue to sign in</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h1 className="text-base font-black text-slate-900 text-center">Set a new password</h1>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 pr-16 border border-slate-200 rounded-xl bg-slate-50 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
