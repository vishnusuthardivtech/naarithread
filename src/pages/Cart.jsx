import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { catalogConstants } from '../services/catalogService'
import { formatPrice } from '../utils/storage'

export default function Cart() {
  const { cartItems, changeCartQuantity, removeFromCart } = useApp()
  const navigate = useNavigate()
  const [cartError, setCartError] = useState('')
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getSelectedSize = (item) => item.selectedSize || item.size || ''

  const proceedToCheckout = () => {
    setCartError('')
    if (cartItems.some((item) => !getSelectedSize(item))) {
      setCartError('Please select size for all products')
      return
    }

    navigate('/checkout')
  }

  const updateQuantity = (item, quantity) => {
    setCartError('')
    try {
      changeCartQuantity(item.id, quantity, getSelectedSize(item))
    } catch (error) {
      setCartError(error instanceof Error ? error.message : 'Unable to update cart')
    }
  }

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
                  <div className="cart-card" key={`${item.id}-${getSelectedSize(item)}`} onClick={() => navigate(`/product?id=${item.id}`)}>
                    <div className="cart-image">
                      <img
                        src={imageToShow}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-details">
                      <h3>{item.name}</h3>
                      <p className="cart-price">{formatPrice(item.price)}</p>
                      <p className="cart-price">{getSelectedSize(item) ? `Size: ${getSelectedSize(item)}` : 'Size not selected'}</p>
                      <div className="quantity-box">
                        <button onClick={(event) => { event.stopPropagation(); updateQuantity(item, Math.max(1, item.quantity - 1)) }}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={(event) => { event.stopPropagation(); updateQuantity(item, item.quantity + 1) }}>+</button>
                      </div>
                      <div className="cart-actions"><button className="remove-btn" onClick={(event) => { event.stopPropagation(); removeFromCart(item.id, getSelectedSize(item)) }}>Remove</button></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <h2 id="cartTotal" className="cart-total">{`Total: ${formatPrice(total)}`}</h2>
            {cartError ? <p className="product-card-error">{cartError}</p> : null}
            <div className="buy-all-wrapper"><button className="buy-all-btn" onClick={proceedToCheckout}>Proceed to Checkout</button></div>
          </>
        )}
      </section>
    </>
  )
}

