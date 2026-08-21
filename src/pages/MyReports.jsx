import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyIssues } from '../lib/issues'

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  acknowledged: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reopened: 'bg-rose-50 text-rose-700 border-rose-200',
  closed_duplicate: 'bg-slate-50 text-slate-500 border-slate-200'
}

export default function MyReports({ session }) {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyIssues(session.user.id)
      .then(setIssues)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [session.user.id])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-black text-slate-900">My Reports</h1>
          <button
            onClick={() => navigate('/report')}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl"
          >
            + New Report
          </button>
        </div>
        {loading && <p className="text-xs text-slate-400">Loading...</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {!loading && issues.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-8">No reports yet.</p>
        )}
        {issues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-bold text-indigo-700">{issue.ticket_code}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusColors[issue.status] || ''}`}>
                {issue.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600">{issue.description || 'No description added.'}</p>
            <p className="text-[10px] text-slate-400">
              {new Date(issue.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
