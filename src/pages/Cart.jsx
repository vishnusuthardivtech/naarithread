import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { catalogConstants } from '../services/catalogService'
import { formatPrice } from '../utils/storage'

export default function Cart() {
  const { cartItems, changeCartQuantity, removeFromCart } = useApp()
  const navigate = useNavigate()
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <style>{`
        .cart-empty{min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;}
      `}</style>
      <section className="cart-page">
        <h1 className="cart-title">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h1>Your Cart is Empty</h1>
          </div>
        ) : (
          <>
            <div className="cart-container" id="cartContainer">
              {cartItems.map((item) => {
                const image = item.images?.[0]
                const imageToShow = image || catalogConstants.PLACEHOLDER_IMAGE

                return (
                  <div className="cart-card" key={`${item.id}-${item.size || ''}`}>
                    <div className="cart-image">
                      <img
                        src={imageToShow}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-details">
                      <h3>{item.name}</h3>
                      <p className="cart-price">{formatPrice(item.price)}</p>
                      <div className="quantity-box">
                        <button onClick={() => changeCartQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeCartQuantity(item.id, item.quantity + 1, item.size)}>+</button>
                      </div>
                      <div className="cart-actions"><button className="remove-btn" onClick={() => removeFromCart(item.id, item.size)}>Remove</button></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <h2 id="cartTotal" className="cart-total">{`Total: ${formatPrice(total)}`}</h2>
            <div className="buy-all-wrapper"><button className="buy-all-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button></div>
          </>
        )}
      </section>
    </>
  )
}

