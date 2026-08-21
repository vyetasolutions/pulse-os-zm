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

export async function fetchTrendingIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('id, category, severity, status, created_at, constituencies(name), issue_categories(label, icon)')
    .eq('is_incognito', false)
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) throw error
  return data
}

export function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
