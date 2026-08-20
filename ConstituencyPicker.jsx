import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ConstituencyPicker({ userId, onComplete }) {
  const [provinces, setProvinces] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedConstituency, setSelectedConstituency] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProvinces() {
      const { data, error } = await supabase
        .from('constituencies')
        .select('province')
        .eq('is_active', true)

      if (error) {
        setError('Could not load provinces. Check your connection.')
        return
      }
      const unique = [...new Set(data.map((r) => r.province))].sort()
      setProvinces(unique)
    }
    loadProvinces()
  }, [])

  useEffect(() => {
    if (!selectedProvince) {
      setConstituencies([])
      return
    }
    async function loadConstituencies() {
      const { data, error } = await supabase
        .from('constituencies')
        .select('id, name')
        .eq('province', selectedProvince)
        .eq('is_active', true)
        .order('name')

      if (!error) setConstituencies(data)
    }
    loadConstituencies()
  }, [selectedProvince])

  async function handleContinue() {
    if (!selectedConstituency) return
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('profiles')
      .update({ constituency_id: selectedConstituency })
      .eq('id', userId)

    setLoading(false)
    if (error) {
      setError('Could not save your selection. Please try again.')
      return
    }
    onComplete(selectedConstituency)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-black text-slate-900 mb-1">Where are you?</h1>
        <p className="text-xs text-slate-500 mb-5">
          This helps us route your reports to the right office.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value)
                setSelectedConstituency('')
              }}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white"
            >
              <option value="">Select province...</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Constituency</label>
            <select
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              disabled={!selectedProvince}
              className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-50"
            >
              <option value="">
                {selectedProvince ? 'Select constituency...' : 'Choose a province first'}
              </option>
              {constituencies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            onClick={handleContinue}
            disabled={!selectedConstituency || loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
