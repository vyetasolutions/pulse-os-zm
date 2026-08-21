import { useEffect, useState } from 'react'
import { fetchRoutingRule, createReferral, fetchReferrals } from '../lib/issues'

export default function ReferralPanel({ issue, session, onReferred }) {
  const [rule, setRule] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [agency, setAgency] = useState('')
  const [referenceCode, setReferenceCode] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoutingRule(issue.constituency_id, issue.category).then(setRule).catch(() => {})
    fetchReferrals(issue.id).then(setReferrals).catch(() => {})
  }, [issue.id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!agency) return setError('Agency name is required.')
    setSubmitting(true)
    setError('')
    try {
      await createReferral({
        issueId: issue.id,
        agency,
        referenceCode,
        contactPerson,
        contactPhone,
        notes,
        userId: session.user.id
      })
      const updated = await fetchReferrals(issue.id)
      setReferrals(updated)
      setShowForm(false)
      setAgency('')
      setReferenceCode('')
      setContactPerson('')
      setContactPhone('')
      setNotes('')
      if (onReferred) onReferred()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-t border-slate-100 pt-2 mt-2 space-y-2">
      {rule?.external_agency && (
        <p className="text-[10px] text-slate-400">
          Suggested contact: <strong>{rule.external_agency}</strong>
          {rule.external_contact_email && ` · ${rule.external_contact_email}`}
          {rule.external_contact_phone && ` · ${rule.external_contact_phone}`}
        </p>
      )}

      {referrals.map((r) => (
        <div key={r.id} className="bg-slate-50 rounded-lg p-2 text-[10px] text-slate-600">
          Referred to <strong>{r.agency}</strong>
          {r.reference_code && ` · ref ${r.reference_code}`}
          {r.contact_person && ` · contact ${r.contact_person}`}
          <span className="text-slate-400"> · {new Date(r.created_at).toLocaleDateString()}</span>
        </div>
      ))}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-[10px] font-bold text-indigo-700 underline"
        >
          + Log referral to external agency
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2 bg-slate-50 rounded-xl p-3">
          <input
            placeholder="Agency (e.g. ZESCO, Kafubu Water, ZP)"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full text-[11px] p-2 border border-slate-200 rounded-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Reference code"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              className="text-[11px] p-2 border border-slate-200 rounded-lg"
            />
            <input
              placeholder="Contact person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="text-[11px] p-2 border border-slate-200 rounded-lg"
            />
          </div>
          <input
            placeholder="Contact phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full text-[11px] p-2 border border-slate-200 rounded-lg"
          />
          <textarea
            placeholder="Notes (how/when contact was made)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-[11px] p-2 border border-slate-200 rounded-lg resize-none"
          />
          {error && <p className="text-[10px] text-rose-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save referral'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[10px] font-bold text-slate-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
