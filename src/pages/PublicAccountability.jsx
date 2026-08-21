import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlatformSummary, fetchAllConstituencyAccountability } from '../lib/issues'

export default function PublicAccountability() {
  const [summary, setSummary] = useState(null)
  const [constituencies, setConstituencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchPlatformSummary(), fetchAllConstituencyAccountability()])
      .then(([s, c]) => {
        setSummary(s)
        setConstituencies(c)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black text-slate-900">Public Accountability</h1>
            <p className="text-xs text-slate-500">How constituencies are responding to citizen reports</p>
          </div>
          <Link to="/reports" className="text-xs font-bold text-indigo-700 underline">Sign in</Link>
        </div>

        {loading && <p className="text-xs text-slate-400">Loading...</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}

        {summary && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{summary.total_issues}</p>
              <p className="text-[10px] text-slate-500">reports filed</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">{summary.resolution_rate_pct ?? 0}%</p>
              <p className="text-[10px] text-slate-500">resolved</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-2xl font-black text-rose-600">{summary.overdue_count}</p>
              <p className="text-[10px] text-slate-500">overdue (7d+)</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700">By constituency, ranked by resolution rate</p>
          {constituencies.map((c, i) => (
            <div key={c.constituency_id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
              <span className="text-sm font-black text-slate-300 w-6">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{c.constituency_name}</p>
                <p className="text-[10px] text-slate-400">
                  {c.total_issues} reports · {c.resolved_count} resolved
                  {c.avg_resolution_hours && ` · avg ${Math.round(c.avg_resolution_hours / 24)}d to resolve`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">{c.resolution_rate_pct ?? 0}%</p>
                {c.overdue_count > 0 && (
                  <p className="text-[10px] font-bold text-rose-600">{c.overdue_count} overdue</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
