import { useEffect, useState } from 'react'
import { fetchPlatformSummary, fetchAllConstituencyAccountability } from '../lib/issues'

export default function LandingStats() {
  const [summary, setSummary] = useState(null)
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchPlatformSummary(), fetchAllConstituencyAccountability()])
      .then(([s, c]) => {
        setSummary(s)
        setTop(c.slice(0, 3))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-900 px-4 py-6 text-center">
        <p className="text-xs text-slate-400">Loading community stats...</p>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="bg-slate-900 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-4">
        <p className="text-center text-white text-sm font-black">
          Your report can move a fixable problem forward.
        </p>
        <p className="text-center text-slate-400 text-[11px]">
          Sign up to add your voice — every report is tracked publicly until it's resolved.
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-white">{summary.total_issues}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">Reports filed</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-emerald-400">{summary.resolution_rate_pct ?? 0}%</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">Resolved</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-rose-400">{summary.overdue_count}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">Overdue</p>
          </div>
        </div>

        {top.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide px-1">
              Most responsive constituencies
            </p>
            {top.map((c, i) => (
              <div key={c.constituency_id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-[11px] text-white font-bold">#{i + 1} {c.constituency_name}</span>
                <span className="text-[11px] text-emerald-400 font-black">{c.resolution_rate_pct ?? 0}%</span>
              </div>
            ))}
          </div>
        )}

        <a href="/public" className="block text-center text-[10px] text-slate-400 underline pt-1">
          See full accountability breakdown
        </a>
      </div>
    </div>
  )
}
