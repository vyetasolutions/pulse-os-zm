export default function DataPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h1 className="text-lg font-black text-slate-900">Data Policy</h1>
        <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Where your data lives</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your data is stored with Supabase, a hosted database provider, and protected by
            row-level security rules that restrict who can read or modify each record based on
            your role and constituency.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Who can see what</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizens can see their own reports in full, and non-anonymous reports from their
            own constituency. Officers and constituency admins can see all reports within their
            constituency. Platform admins can see aggregate data across all constituencies for
            accountability reporting, but individual household profile answers remain scoped to
            the reporting citizen's own constituency staff.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Retention</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reports and their status history are retained to preserve an accurate accountability
            record for constituencies over time. You can request deletion of your personal
            account details at any time; historical report data may be retained in de-identified
            form for public accountability statistics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Third parties</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not sell or share your personal data with advertisers or unrelated third
            parties. Evidence photos you upload are stored securely and are only accessible via
            links shared with authorized staff handling your report.
          </p>
        </section>
      </div>
    </div>
  )
}
