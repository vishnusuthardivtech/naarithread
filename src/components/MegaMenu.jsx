import { Link } from 'react-router-dom'
import { assetPath } from '../data/site'

export default function MegaMenu({ onNavigate, isOpen }) {
  return (
    <div
      className="mega-menu"
      style={
        isOpen
          ? {
              display: 'grid',
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'auto',
            }
          : {
              display: 'none',
              opacity: 0,
              visibility: 'hidden',
              pointerEvents: 'none',
            }
      }
    >
      <Link to="/collection1" onClick={onNavigate}>
        <div className="mega-card">
          <img src={assetPath('best-seller/1.jpg')} alt="Mirror Lehenga" />
          <button className="mega-btn">Mirror Lehenga</button>
        </div>
      </Link>
      <Link to="/collection2" onClick={onNavigate}>
        <div className="mega-card">
          <img src={assetPath('best-seller/2.jpg')} alt="Sequence Lehenga" />
          <button className="mega-btn">Sequence Lehenga</button>
        </div>
      </Link>
      <Link to="/collection3" onClick={onNavigate}>
        <div className="mega-card">
          <img src={assetPath('best-seller/3.jpg')} alt="Party Lehenga" />
          <button className="mega-btn">Party Lehenga</button>
        </div>
      </Link>
    </div>
  )
}
