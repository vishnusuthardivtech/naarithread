import { Link } from 'react-router-dom'

export default function MobileMenu({ open, onClose }) {
  return (
    <div className={`mobile-collections${open ? ' active' : ''}`} id="mobileCollections">
      <div className="mobile-collections-header">
        <span>Collections</span>
        <button id="closeCollections" onClick={onClose}>X</button>
      </div>

      <Link to="/collection1" onClick={onClose}>Mirror Lehenga</Link>
      <Link to="/collection2" onClick={onClose}>Sequence Lehenga</Link>
      <Link to="/collection3" onClick={onClose}>Party Lehenga</Link>
    </div>
  )
}
