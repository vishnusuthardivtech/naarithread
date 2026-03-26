// Legacy StatCard - replaced by new Card component
// Kept for compatibility
export default function StatCard({ label, value, hint, className = '' }) {
  return (
    <div className={`admin-card p-6 rounded-xl border bg-bg-card ${className}`}>
      <p className="text-text-secondary text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
      <p className="text-text-secondary text-sm">{hint}</p>
    </div>
  )
}
