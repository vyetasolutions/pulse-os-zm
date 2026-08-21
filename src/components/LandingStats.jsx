import { useEffect, useState } from 'react'
import {
  fetchPlatformSummary,
  fetchConstituencyLeaderboard,
  fetchTrendingIssues,
  relativeTime
} from '../lib/accountability'

const INK = '#17241C'
const COPPER = '#C1592C'
const GREEN = '#2F6B45'
const GOLD = '#E8A33D'
const SAND = '#FAF6EF'
const LINE = '#E8E1D3'

const statusEmoji = {
  pending: '🟡',
  acknowledged: '👀',
  in_progress: '🔧',
  resolved: '✅',
  reopened: '🔁',
  closed_duplicate: '⚪'
}

export default function LandingStats() {
  const [summary, setSummary] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchPlatformSummary(), fetchConstituencyLeaderboard(), fetchTrendingIssues()])
      .then(([s, l, t]) => {
        setSummary(s)
        setLeaderboard(l)
        setTrending(t)
      })
      .catch(() => {
        setSummary(null)
        setLeaderboard([])
        setTrending([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-xs py-6 text-center" style={{ color: '#9C9484' }}>Loading...</div>
  }
  if (!summary) return null

  const rate = Number(summary.resolution_rate_pct) || 0
  const pendingCount = Math.max(summary.total_issues - summary.resolved_count, 0)
  const activeConstituencies = leaderboard.filter((c) => c.total_issues > 0).slice(0, 5)
  const maxRate = Math.max(...activeConstituencies.map((c) => Number(c.resolution_rate_pct) || 0), 1)

  return (
    <div className="w-full flex justify-center px-4 pt-6 pb-2" style={{ background: SAND }}>
      <div style={{ maxWidth: '400px', width: '100%', fontFamily: "'Inter', sans-serif" }}>

        {/* Signature: pulse mark + headline */}
        <div className="flex items-center gap-2 mb-4">
          <PulseMark color={COPPER} />
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#9C9484', letterSpacing: '0.12em' }}>
            Live from the community
          </p>
        </div>

        {/* Hero: big ring gauge as the single boldest element */}
        <div
          className="rounded-3xl p-5 mb-4 flex items-center gap-5"
          style={{ background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(23,36,28,0.04)' }}
        >
          <RingGauge value={rate} size={92} stroke={10} color={COPPER} track={LINE} />
          <div className="flex-1 min-w-0">
            <p
              className="text-3xl font-black leading-none"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: INK }}
            >
              {rate}%
            </p>
            <p className="text-[11px] font-bold mt-1" style={{ color: '#9C9484' }}>getting fixed</p>
            <div className="flex gap-3 mt-3 text-[11px] font-bold">
              <span style={{ color: GREEN }}>{summary.resolved_count} fixed</span>
              <span style={{ color: '#9C9484' }}>{pendingCount} in progress</span>
            </div>
          </div>
        </div>

        {/* Small stat row — quiet, secondary to the hero ring */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <MiniStat value={summary.total_issues} label="Requests" />
          <MiniStat value={summary.resolved_count} label="Fixed" />
          <MiniStat value={summary.overdue_count} label="Attention" warn={summary.overdue_count > 0} />
        </div>

        {/* Trending feed */}
        {trending.length > 0 && (
          <div
            className="rounded-3xl p-5 mb-4"
            style={{ background: '#fff', border: `1px solid ${LINE}` }}
          >
            <p className="text-[11px] font-black uppercase tracking-wide mb-3" style={{ color: INK, letterSpacing: '0.06em' }}>
              Happening nearby
            </p>
            <div className="space-y-3">
              {trending.map((issue) => (
                <div key={issue.id} className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: '#F4EFE4' }}
                  >
                    {issue.issue_categories?.icon || '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: INK }}>
                      {issue.issue_categories?.label || issue.category} · {issue.constituencies?.name}
                    </p>
                    <p className="text-[10px]" style={{ color: '#9C9484' }}>{relativeTime(issue.created_at)}</p>
                  </div>
                  <span className="text-sm shrink-0">{statusEmoji[issue.status] || '•'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {trending.length === 0 && (
          <EmptyCard
            title="Be the first to try it out"
            subtitle="Let your local office know what needs fixing — it only takes a minute."
          />
        )}

        {/* Leaderboard — custom ranked rows, not a boxed bar chart */}
        {activeConstituencies.length > 0 && (
          <div
            className="rounded-3xl p-5"
            style={{ background: '#fff', border: `1px solid ${LINE}` }}
          >
            <p className="text-[11px] font-black uppercase tracking-wide mb-3" style={{ color: INK, letterSpacing: '0.06em' }}>
              Top performing offices
            </p>
            <div className="space-y-3">
              {activeConstituencies.map((c, i) => {
                const val = Number(c.resolution_rate_pct) || 0
                return (
                  <div key={c.constituency_id} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{
                        background: i === 0 ? GOLD : '#F4EFE4',
                        color: i === 0 ? '#fff' : '#9C9484'
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold truncate" style={{ color: INK }}>{c.constituency_name}</span>
                        <span className="text-[10px] font-black ml-2 shrink-0" style={{ color: COPPER }}>{val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F4EFE4' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(val / maxRate) * 100}%`, background: COPPER }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RingGauge({ value, size, stroke, color, track }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg width={size} height={size} className="shrink-0" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

function PulseMark({ color }) {
  return (
    <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
      <path
        d="M0 8H7L9.5 2L14 14L16.5 8H28"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniStat({ value, label, warn }) {
  return (
    <div
      className="rounded-2xl px-3 py-2.5 text-center"
      style={{ background: warn ? '#FCF1DE' : '#fff', border: `1px solid ${warn ? '#EFD9A8' : LINE}` }}
    >
      <p
        className="text-lg font-black leading-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: warn ? '#B5791E' : INK }}
      >
        {value}
      </p>
      <p className="text-[9px] font-bold uppercase tracking-wide mt-1" style={{ color: '#9C9484' }}>{label}</p>
    </div>
  )
}

function EmptyCard({ title, subtitle }) {
  return (
    <div
      className="rounded-3xl p-6 text-center mb-4"
      style={{ background: '#fff', border: `1px dashed ${LINE}` }}
    >
      <p className="text-sm font-bold" style={{ color: INK }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: '#9C9484' }}>{subtitle}</p>
    </div>
  )
}
