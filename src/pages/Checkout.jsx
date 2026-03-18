import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getCurrentUser } from '../utils/cart'
import { readStorage, writeStorage, formatPrice } from '../utils/storage'
import { states } from '../data/site'

export default function Checkout() {
  const { cartItems, emptyCart } = useApp()
  const navigate = useNavigate()
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', address1: '', address2: '', city: '', state: '', pincode: '', upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '' })
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const placeOrder = () => {
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

    const user = getCurrentUser()
    const orderKey = `ntOrders_${user.email}`
    const existingOrders = readStorage(orderKey, [])
    const newOrders = cartItems.map((item) => ({
      orderId: `NT_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date().toISOString(),
      items: [item],
      total: item.price * item.quantity,
      paymentMethod: payment,
      customerName: form.fullName.trim() || user.name,
      customerEmail: form.email.trim() || user.email,
      userEmail: user.email,
      address: { ...form },
      date: new Date().toLocaleDateString(),
      status: 'Processing',
    }))
    writeStorage(orderKey, [...existingOrders, ...newOrders])
    emptyCart()
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
          <div id="checkoutItems">{cartItems.map((item) => <div className="checkout-item" key={item.id}><span>{item.name} × {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}</div>
          <h3 id="checkoutTotal">{cartItems.length ? `Total: ${formatPrice(total)}` : ''}</h3>
          <hr style={{ margin: '25px 0', borderColor: 'rgba(212,175,55,0.2)' }} />
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className="payment-option"><input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={(event) => setPayment(event.target.value)} />Cash on Delivery</label>
            <label className="payment-option"><input type="radio" name="payment" value="upi" checked={payment === 'upi'} onChange={(event) => setPayment(event.target.value)} />UPI</label>
            <label className="payment-option"><input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={(event) => setPayment(event.target.value)} />Credit / Debit Card</label>
          </div>
          <div id="upiSection" className={`payment-extra${payment === 'upi' ? '' : ' hidden'}`}><input type="text" id="upiId" placeholder="Enter UPI ID (example@upi)" value={form.upiId} onChange={(event) => setForm({ ...form, upiId: event.target.value })} /><small className="error">{errors.upiId}</small></div>
          <div id="cardSection" className={`payment-extra${payment === 'card' ? '' : ' hidden'}`}><input type="text" id="cardNumber" placeholder="Card Number" value={form.cardNumber} onChange={(event) => setForm({ ...form, cardNumber: event.target.value })} /><input type="text" id="cardExpiry" placeholder="MM/YY" value={form.cardExpiry} onChange={(event) => setForm({ ...form, cardExpiry: event.target.value })} /><input type="text" id="cardCvv" placeholder="CVV" value={form.cardCvv} onChange={(event) => setForm({ ...form, cardCvv: event.target.value })} /><small className="error">{errors.cardNumber || errors.cardCvv}</small></div>
          <button id="placeOrderBtn" className="place-order-btn" onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </section>
  )
}

