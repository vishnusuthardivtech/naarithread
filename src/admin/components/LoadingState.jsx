export default function LoadingState({ label = 'Loading admin data...' }) {
  return (
    <div className="empty-panel loading-panel">
      <div className="loading-spinner" />
      <p>{label}</p>
    </div>
  )
}
