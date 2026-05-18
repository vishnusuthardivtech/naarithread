import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAddress } from '../hooks/useAddress'
import { useOrders } from '../hooks/useOrders'
import { updateCatalogStockLevels } from '../services/catalogService'
import { formatPrice } from '../utils/storage'
import { states } from '../data/site'

export default function Checkout() {
  const { user, cartItems, emptyCart, validateCartItemsAgainstStock } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { defaultAddress } = useAddress(user)
  const { addOrder } = useOrders(user)
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors] = useState({})
  const [checkoutError, setCheckoutError] = useState('')
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address1: '', address2: '', city: '', state: '', pincode: '', upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '' })
  const buyNowItems = Array.isArray(location.state?.buyNowItems) ? location.state.buyNowItems : []
  const checkoutItems = buyNowItems.length ? buyNowItems : cartItems
  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const getSelectedSize = (item) => item.selectedSize || item.size || ''

  useEffect(() => {
    if (!defaultAddress) {
      return
    }

    setForm((current) => ({
      ...current,
      fullName: current.fullName || defaultAddress.name || '',
      phone: current.phone || defaultAddress.phone || '',
      address1: current.address1 || defaultAddress.line1 || defaultAddress.address || '',
      address2: current.address2 || defaultAddress.line2 || '',
      city: current.city || defaultAddress.city || '',
      state: current.state || defaultAddress.state || '',
      pincode: current.pincode || defaultAddress.pincode || '',
      email: current.email || user?.email || '',
    }))
  }, [defaultAddress, user])

  const placeOrder = () => {
    setCheckoutError('')
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = 'Enter valid phone number'
    if (!form.email.includes('@')) nextErrors.email = 'Enter valid email'
    if (!form.address1.trim()) nextErrors.address1 = 'Address is required'
    if (!form.city.trim()) nextErrors.city = 'City is required'
    if (!form.state) nextErrors.state = 'Select your state'
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = 'Enter valid 6-digit pincode'
    if (payment === 'upi' && !form.upiId.includes('@')) nextErrors.upiId = 'Enter valid UPI ID'
    if (payment === 'card' && String(form.cardNumber).replace(/\s/g, '').length < 16) nextErrors.cardNumber = 'Enter valid card details'
    if (payment === 'card' && form.cardCvv.length !== 3) nextErrors.cardCvv = 'Enter valid card details'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    if (checkoutItems.some((item) => !getSelectedSize(item))) {
      setCheckoutError('Please select size for all products')
      return
    }

    const stockValidation = validateCartItemsAgainstStock(checkoutItems)
    if (!stockValidation.valid) {
      setCheckoutError(stockValidation.error)
      return
    }

    const stockUpdate = updateCatalogStockLevels(checkoutItems)
    if (!stockUpdate.success) {
      setCheckoutError(stockUpdate.error || 'Unable to place order')
      return
    }

    addOrder({
      products: checkoutItems,
      total,
      address: {
        fullName: form.fullName.trim() || user?.name || '',
        phone: form.phone.trim(),
        email: form.email.trim() || user?.email || '',
        address1: form.address1.trim(),
        address2: form.address2.trim(),
        city: form.city.trim(),
        state: form.state,
        pincode: form.pincode.trim(),
      },
    })
    if (!buyNowItems.length) {
      emptyCart()
    }
    navigate('/orders')
  }

  return (
    <section className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-wrapper">
        <div className="checkout-form">
          <h2>Billing Details</h2>
          {['fullName', 'phone', 'email', 'address1', 'address2', 'city', 'pincode'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field === 'address1' ? 'Address Line 1' : field === 'address2' ? 'Address Line 2' : field.charAt(0).toUpperCase() + field.slice(1)}{field !== 'address2' ? ' ' : ''}{field !== 'address2' ? <span>*</span> : null}</label>
              <input type={field === 'email' ? 'email' : 'text'} id={field} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
              <small className="error">{errors[field]}</small>
            </div>
          ))}
          <div className="form-group"><label>State <span>*</span></label><select id="state" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })}><option value="">Select State</option>{states.map((state) => <option key={state}>{state}</option>)}</select><small className="error">{errors.state}</small></div>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {checkoutError ? <p className="product-card-error">{checkoutError}</p> : null}
          <div id="checkoutItems">{checkoutItems.map((item) => <div className="checkout-item" key={`${item.id}-${getSelectedSize(item)}`}><span>{item.name}{getSelectedSize(item) ? ` (Size: ${getSelectedSize(item)})` : ''} x {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}</div>
          <h3 id="checkoutTotal">{checkoutItems.length ? `Total: ${formatPrice(total)}` : ''}</h3>
          <hr style={{ margin: '25px 0', borderColor: 'rgba(212,175,55,0.2)' }} />
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className="payment-option"><input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={(event) => setPayment(event.target.value)} />Cash on Delivery</label>
          </div>
          <button id="placeOrderBtn" className="place-order-btn" onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </section>
  )
}
