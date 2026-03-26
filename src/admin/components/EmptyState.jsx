export default function EmptyState({ title = 'No data', description = 'Nothing to show here yet' }) {
  return (
    <div className="empty-state text-center py-20 px-8 border-2 border-dashed border-border-dashed rounded-xl">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-bg-hover flex items-center justify-center">
        <span className="text-2xl font-semibold text-text-secondary">0</span>
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mx-auto">{description}</p>
    </div>
  )
}
