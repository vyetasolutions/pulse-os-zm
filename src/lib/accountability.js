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
