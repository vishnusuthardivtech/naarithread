export default function LoadingState({ label = 'Loading admin data...' }) {
  return (
    <div className="loading-state text-center py-20 px-8">
      <div className="loading-spinner mx-auto mb-4" />
      <p className="text-text-secondary text-lg font-medium">{label}</p>
    </div>
  )
}
