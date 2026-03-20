export default function AdminTopbar({ onMenuToggle }) {
  return (
    <div className="admin-topbar">
      <button type="button" className="hamburger" onClick={onMenuToggle}>
        ☰
      </button>
    </div>
  )
}
