import { supabase } from './supabase'

export async function fetchManageableProfiles(profile) {
  let query = supabase
    .from('profiles')
    .select('id, full_name, phone, role, constituency_id, created_at, constituencies(name)')
    .order('created_at', { ascending: false })

  if (profile.role === 'constituency_admin') {
    query = query.eq('constituency_id', profile.constituency_id)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateUserRole(userId, newRole) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
  if (error) throw error
}

export async function fetchConstituenciesList() {
  const { data, error } = await supabase
    .from('constituencies')
    .select('id, name')
    .order('name')
  if (error) throw error
  return data
}
