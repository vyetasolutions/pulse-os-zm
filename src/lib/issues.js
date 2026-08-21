import { supabase } from './supabase'

export async function fetchCategories() {
  const { data, error } = await supabase.from('issue_categories').select('*')
  if (error) throw error
  return data
}

export async function uploadEvidence(file, userId) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('evidence').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('evidence').getPublicUrl(path)
  return data.publicUrl
}

function generateTicketCode(constituencyName) {
  const prefix = (constituencyName || 'GEN').substring(0, 3).toUpperCase()
  const suffix = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${suffix}`
}

export async function createIssue({
  userId, constituencyId, constituencyName, category, severity,
  description, photoUrl, isIncognito
}) {
  const ticketCode = generateTicketCode(constituencyName)
  const { data, error } = await supabase
    .from('issues')
    .insert({
      ticket_code: ticketCode,
      reporter_id: userId,
      constituency_id: constituencyId,
      category,
      severity,
      description,
      photo_url: photoUrl || null,
      is_incognito: isIncognito,
      status: 'pending'
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchMyIssues(userId) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchConstituencyIssues(constituencyId, statusFilter) {
  let query = supabase
    .from('issues')
    .select('*, profiles!issues_reporter_id_fkey(full_name)')
    .eq('constituency_id', constituencyId)
    .order('created_at', { ascending: false })
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateIssueStatus(issueId, newStatus, oldStatus, userId, notes) {
  const { error: updateErr } = await supabase
    .from('issues')
    .update({ status: newStatus })
    .eq('id', issueId)
  if (updateErr) throw updateErr

  const { error: historyErr } = await supabase
    .from('issue_status_history')
    .insert({
      issue_id: issueId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: userId,
      notes: notes || null
    })
  if (historyErr) throw historyErr
}

export async function fetchAccountability(constituencyId) {
  let query = supabase.from('constituency_accountability').select('*')
  if (constituencyId) query = query.eq('constituency_id', constituencyId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchRoutingRule(constituencyId, category) {
  const { data, error } = await supabase
    .from('routing_rules')
    .select('*')
    .eq('constituency_id', constituencyId)
    .eq('category', category)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createReferral({ issueId, agency, referenceCode, contactPerson, contactPhone, notes, userId }) {
  const { data, error } = await supabase
    .from('issue_referrals')
    .insert({
      issue_id: issueId,
      agency,
      reference_code: referenceCode || null,
      contact_person: contactPerson || null,
      contact_phone: contactPhone || null,
      notes: notes || null,
      referred_by: userId
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchReferrals(issueId) {
  const { data, error } = await supabase
    .from('issue_referrals')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchEscalations(constituencyId) {
  let query = supabase
    .from('issue_escalation')
    .select('*')
    .neq('escalation_level', 'none')
  if (constituencyId) query = query.eq('constituency_id', constituencyId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchPlatformSummary() {
  const { data, error } = await supabase
    .from('platform_accountability_summary')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function fetchAllConstituencyAccountability() {
  const { data, error } = await supabase
    .from('constituency_accountability')
    .select('*')
    .order('resolution_rate_pct', { ascending: false })
  if (error) throw error
  return data
}
