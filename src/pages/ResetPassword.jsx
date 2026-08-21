import { useState } from 'react'
import { supabase } from '../lib/supabase'
import logoFull from '../assets/logo-full.png'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      })
      if (error) throw error
      setSent(true)
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
        {sent ? (
          <div className="text-center space-y-2">
            <span className="text-3xl">📧</span>
            <p className="text-sm font-bold text-slate-900">Check your email</p>
            <p className="text-xs text-slate-500">
              We sent a password reset link to {email}. Click it to set a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <h1 className="text-base font-black text-slate-900 text-center">Reset your password</h1>
              <p className="text-xs text-slate-500 text-center mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send reset link'}
            </button>
            <a href="/" className="block text-center text-xs text-slate-500 underline">Back to sign in</a>
          </form>
        )}
      </div>
    </div>
  )
}
