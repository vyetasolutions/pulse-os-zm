#!/bin/bash
set -e

echo "== Installing recharts =="
npm install recharts

mkdir -p src/lib src/components

# ------------------------------------------------------------
# Data fetching helper
# ------------------------------------------------------------
cat > src/lib/accountability.js << 'EOF'
import { supabase } from './supabase'

export async function fetchPlatformSummary() {
  const { data, error } = await supabase
    .from('platform_accountability_summary')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function fetchConstituencyLeaderboard() {
  const { data, error } = await supabase
    .from('constituency_accountability')
    .select('*')
    .order('resolution_rate_pct', { ascending: false, nullsFirst: false })
  if (error) throw error
  return data
}
EOF

# ------------------------------------------------------------
# LandingStats component with real charts + graceful empty states
# ------------------------------------------------------------
cat > src/components/LandingStats.jsx << 'EOF'
import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { fetchPlatformSummary, fetchConstituencyLeaderboard } from '../lib/accountability'

const COLORS = ['#4f46e5', '#e2e8f0'] // resolved, pending

export default function LandingStats() {
  const [summary, setSummary] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchPlatformSummary(), fetchConstituencyLeaderboard()])
      .then(([s, l]) => {
        setSummary(s)
        setLeaderboard(l)
      })
      .catch(() => {
        // fail silently on the landing page — stats are a bonus, not a blocker
        setSummary(null)
        setLeaderboard([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-xs text-slate-400 text-center py-8">Loading platform stats...</div>
  }

  if (!summary) return null

  const pendingCount = Math.max(summary.total_issues - summary.resolved_count, 0)
  const donutData = [
    { name: 'Resolved', value: summary.resolved_count },
    { name: 'In progress / pending', value: pendingCount }
  ]

  const activeConstituencies = leaderboard.filter((c) => c.total_issues > 0).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Stat cards — always meaningful, even at low volume */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Reports" value={summary.total_issues} />
        <StatCard label="Resolved" value={summary.resolved_count} />
        <StatCard label="Resolution Rate" value={`${summary.resolution_rate_pct}%`} />
        <StatCard label="Overdue" value={summary.overdue_count} tone={summary.overdue_count > 0 ? 'warn' : 'default'} />
      </div>

      {/* Donut: resolved vs pending — only when there's something to show */}
      {summary.total_issues > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Resolution Status
          </h3>
          <div className="w-full h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                >
                  {donutData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 mt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> Resolved</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Pending</span>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Be the first to report an issue"
          subtitle="This platform is just getting started — your report puts your constituency on the map."
        />
      )}

      {/* Constituency leaderboard — only constituencies with real activity */}
      {activeConstituencies.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Constituency Resolution Rates
          </h3>
          <div className="w-full h-52">
            <ResponsiveContainer>
              <BarChart data={activeConstituencies} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="constituency_name"
                  width={90}
                  tick={{ fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="resolution_rate_pct" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No constituencies with reports yet"
          subtitle="Sign up and put your constituency on the leaderboard first."
        />
      )}
    </div>
  )
}

function StatCard({ label, value, tone = 'default' }) {
  const toneClass = tone === 'warn' && value > 0
    ? 'text-rose-600'
    : 'text-slate-900'
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-center">
      <p className={`text-base font-black ${toneClass}`}>{value}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight">{label}</p>
    </div>
  )
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
      <p className="text-sm font-bold text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  )
}
EOF

echo ""
echo "== Done =="
echo "src/lib/accountability.js and src/components/LandingStats.jsx have been rewritten."
echo "Since LandingStats.jsx already existed and is likely imported in AuthScreen.jsx,"
echo "no import changes should be needed — same component name, same export shape."
