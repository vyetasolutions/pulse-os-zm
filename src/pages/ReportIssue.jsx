import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories, uploadEvidence, createIssue } from '../lib/issues'

export default function ReportIssue({ session, profile }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState(3)
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [isIncognito, setIsIncognito] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successCode, setSuccessCode] = useState('')

  useEffect(() => {
    fetchCategories().then(setCategories).catch((e) => setError(e.message))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!category) return setError('Please choose what type of issue this is.')
    setSubmitting(true)
    setError('')
    try {
      let photoUrl = null
      if (file) {
        photoUrl = await uploadEvidence(file, session.user.id)
      }
      const issue = await createIssue({
        userId: session.user.id,
        constituencyId: profile.constituency_id,
        constituencyName: profile.constituency_name || 'GEN',
        category,
        severity,
        description,
        photoUrl,
        isIncognito
      })
      setSuccessCode(issue.ticket_code)
    } catch (err) {
      setError('Could not submit your report. ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (successCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-emerald-200 p-6 text-center space-y-3">
          <span className="text-3xl">✅</span>
          <h1 className="text-lg font-black text-slate-900">Report Submitted</h1>
          <p className="text-xs text-slate-500">Your tracking code:</p>
          <p className="font-mono text-lg font-bold text-indigo-700 bg-indigo-50 py-2 rounded-xl">{successCode}</p>
          <p className="text-[11px] text-slate-400">Save this code to track your report's progress.</p>
          <button
            onClick={() => navigate('/reports')}
            className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl mt-2"
          >
            View My Reports
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h1 className="text-lg font-black text-slate-900 mb-1">Report an Issue</h1>
        <p className="text-xs text-slate-500 mb-5">What's wrong? Help us understand.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">What type of issue?</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                    category === c.key ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-[10px] font-bold text-slate-600 leading-tight">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">How bad is it?</label>
            <input
              type="range"
              min="1"
              max="5"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>🟢 Stable</span>
              <span>💥 Critical</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Add a photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tell us more (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Where exactly? Any landmark nearby?"
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none resize-none"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={isIncognito}
              onChange={(e) => setIsIncognito(e.target.checked)}
            />
            Report without showing my name to others
          </label>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}
