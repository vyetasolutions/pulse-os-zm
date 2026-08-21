import { useEffect, useState } from 'react'
import { fetchManageableProfiles, updateUserRole } from '../lib/roles'

const ROLES = ['citizen', 'officer', 'constituency_admin', 'platform_admin']

const roleColors = {
  citizen: 'bg-slate-50 text-slate-500 border-slate-200',
  officer: 'bg-blue-50 text-blue-700 border-blue-200',
  constituency_admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  platform_admin: 'bg-rose-50 text-rose-700 border-rose-200'
}

export default function RoleManagement({ session, profile }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [search, setSearch] = useState('')

  const isPlatformAdmin = profile.role === 'platform_admin'

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchManageableProfiles(profile)
      setUsers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(user, newRole) {
    if (newRole === 'platform_admin' && !isPlatformAdmin) {
      setError('Only a platform admin can assign that role.')
      return
    }
    setBusyId(user.id)
    setError('')
    try {
      await updateUserRole(user.id, newRole)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-lg font-black text-slate-900">Role Management</h1>
          <p className="text-xs text-slate-500">
            {isPlatformAdmin
              ? 'Manage roles across all constituencies.'
              : `Manage roles within ${profile.constituency_name || 'your constituency'}.`}
          </p>
        </div>

        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white outline-none"
        />

        {error && <p className="text-xs text-rose-600">{error}</p>}
        {loading && <p className="text-xs text-slate-400">Loading...</p>}

        <div className="space-y-2">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{u.full_name || 'Unnamed user'}</p>
                <p className="text-[10px] text-slate-400">
                  {u.constituencies?.name || 'No constituency'} · {u.phone || 'no phone'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${roleColors[u.role]}`}>
                  {u.role.replace('_', ' ')}
                </span>
                <select
                  value={u.role}
                  disabled={busyId === u.id || (u.id === session.user.id)}
                  onChange={(e) => handleRoleChange(u, e.target.value)}
                  className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-40"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} disabled={r === 'platform_admin' && !isPlatformAdmin}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">No users found.</p>
          )}
        </div>

        <p className="text-[10px] text-slate-400 pt-2">
          You can't change your own role. {!isPlatformAdmin && 'Only a platform admin can assign the platform admin role.'}
        </p>
      </div>
    </div>
  )
}
