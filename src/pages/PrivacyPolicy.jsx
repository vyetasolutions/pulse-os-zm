export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h1 className="text-lg font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">What we collect</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            When you create an account, we collect your name, phone number, and constituency.
            When you submit a report, we collect the issue details, category, severity, and any
            photo you attach. If you choose to complete your household profile, that information
            is optional and used only in aggregate form to inform local insights.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">How we use it</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your reports are shared with the relevant constituency office so they can respond.
            If you mark a report as anonymous, your name is not shown to other citizens or
            included in any public listing of that report, though authorized officers can still
            see it in order to respond to you directly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Aggregate data</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Household profile data (housing type, water access, etc.) is only ever shown to
            others in aggregated, anonymized form — for example, "40% of households in this ward
            report no piped water." Individual responses are never shared outside your own
            constituency's authorized staff.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-800">Your rights</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can request a copy of your data or ask us to delete your account at any time
            by contacting your constituency office through the app.
          </p>
        </section>
      </div>
    </div>
  )
}
