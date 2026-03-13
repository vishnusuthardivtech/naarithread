export default function CartBadge({ count, className = 'badge pulse cart-badge' }) {
  return <span className={className}>{count}</span>
}

