import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAddress } from '../hooks/useAddress'
import { useOrders } from '../hooks/useOrders'
import { useWishlist } from '../hooks/useWishlist'
import { states } from '../data/site'
import { readStorage, writeStorage, formatPrice } from '../utils/storage'
import { resolveProductImage } from '../utils/productImages'

const emptyAddressForm = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

const toAddressForm = (address) => ({
  fullName: address.name || '',
  phone: address.phone || '',
  line1: address.line1 || address.address || '',
  line2: address.line2 || '',
  city: address.city || '',
  state: address.state || '',
  pincode: address.pincode || '',
})

export default function Account() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')
  const [profile, setProfile] = useState(() => readStorage(user ? `ntProfile_${user.email}` : '', { name: user?.name || '', phone: '', dob: '' }))
  const { addresses, saveAddress: saveUserAddress, setDefaultAddress, deleteAddress } = useAddress(user)
  const { orders } = useOrders(user)
  const { items: wishlist, removeItem } = useWishlist(user)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)
  const [editAddressId, setEditAddressId] = useState(null)
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    setProfile(readStorage(`ntProfile_${user.email}`, { name: user.name || '', phone: '', dob: '' }))
  }, [navigate, user])

  useEffect(() => {
    console.log('Wishlist:', wishlist)
    console.log('Orders:', orders)
  }, [wishlist, orders])

  if (!user) return null

  const saveProfile = () => {
    writeStorage(`ntProfile_${user.email}`, profile)
    writeStorage('ntLoggedInUser', { ...user, name: profile.name })
    window.alert('Profile updated successfully!')
  }

  const saveAddress = () => {
    saveUserAddress({
      name: addressForm.fullName,
      phone: addressForm.phone,
      line1: addressForm.line1,
      line2: addressForm.line2,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
    }, editAddressId)
    setAddressForm(emptyAddressForm)
    setEditAddressId(null)
    window.alert('Address saved successfully!')
  }

  const updatePassword = () => {
    const users = readStorage('ntUsers', [])
    const userIndex = users.findIndex((item) => item.email === user.email)
    if (userIndex === -1 || users[userIndex].password !== passwordForm.oldPassword) {
      setPasswordError('Old password is incorrect.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    users[userIndex].password = passwordForm.newPassword
    writeStorage('ntUsers', users)
    setPasswordError('Password updated successfully!')
  }

  return (
    <section className="account-section">
      <div className="account-container">
        <div className="account-layout">
          <aside className="account-sidebar">
            <h3>My Account</h3>
            <ul>{['Dashboard', 'Personal Information', 'Address Book', 'My Orders', 'Wishlist', 'Security'].map((item) => <li key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</li>)}</ul>
          </aside>
          <div className="account-content">
            <div className={`account-panel${tab === 'Dashboard' ? ' active' : ''}`}><h2 className="section-title">Welcome back, <span id="userName">{profile.name || user.name}</span></h2><p className="section-subtitle">Manage your orders and personal details</p><div className="account-stats"><div className="stat-card"><h4>{orders.length}</h4><p>Total Orders</p></div><div className="stat-card"><h4>{wishlist.length}</h4><p>Wishlist Items</p></div><div className="stat-card"><h4>{addresses.length}</h4><p>Saved Addresses</p></div></div></div>
            <div className={`account-panel${tab === 'Personal Information' ? ' active' : ''}`}><h2 className="section-title">Personal Information</h2><div className="account-form"><div className="form-group"><label>Full Name</label><input type="text" id="profileName" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></div><div className="form-group"><label>Email</label><input type="email" id="profileEmail" value={user.email} disabled /></div><div className="form-group"><label>Phone Number</label><input type="text" id="profilePhone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></div><div className="form-group"><label>Date of Birth</label><input type="date" id="profileDob" value={profile.dob} onChange={(event) => setProfile({ ...profile, dob: event.target.value })} /></div><button className="hero-btn" id="saveProfileBtn" onClick={saveProfile}>Save Changes</button></div></div>
            <div className={`account-panel${tab === 'Address Book' ? ' active' : ''}`}><h2 className="section-title">Address Book</h2><div id="addressList">{addresses.length === 0 ? <p>No saved addresses yet.</p> : addresses.map((addr) => <div className="address-card" key={addr.id}><h4>Saved Address {addr.isDefault ? <span className="default-badge">Default</span> : null}</h4><p>{addr.name}</p><p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p><p>{addr.city}, {addr.state} - {addr.pincode}</p><p>Phone: {addr.phone}</p><div className="address-actions">{!addr.isDefault ? <button className="set-current-btn" onClick={() => setDefaultAddress(addr.id)}>Set As Default</button> : null}<button className="edit-btn" onClick={() => { setAddressForm(toAddressForm(addr)); setEditAddressId(addr.id) }}>Edit</button><button className="delete-btn" onClick={() => deleteAddress(addr.id)}>Delete</button></div></div>)}</div><hr style={{ margin: '40px 0', borderColor: 'rgba(212,175,55,0.2)' }} /><h3 style={{ color: '#d4af37' }}>Add New Address</h3><div className="account-form" id="addressForm"><div className="form-group"><label>Full Name *</label><input type="text" id="addrName" value={addressForm.fullName} onChange={(event) => setAddressForm({ ...addressForm, fullName: event.target.value })} /></div><div className="form-group"><label>Phone *</label><input type="text" id="addrPhone" value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} /></div><div className="form-group" style={{ gridColumn: 'span 2' }}><label>Address Line 1 *</label><input type="text" id="addrLine1" value={addressForm.line1} onChange={(event) => setAddressForm({ ...addressForm, line1: event.target.value })} /></div><div className="form-group" style={{ gridColumn: 'span 2' }}><label>Address Line 2</label><input type="text" id="addrLine2" value={addressForm.line2} onChange={(event) => setAddressForm({ ...addressForm, line2: event.target.value })} /></div><div className="form-group"><label>City *</label><input type="text" id="addrCity" value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} /></div><div className="form-group"><label>State *</label><select id="addrState" value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })}><option value="">Select State</option>{states.map((state) => <option key={state}>{state}</option>)}</select></div><div className="form-group"><label>Pincode *</label><input type="text" id="addrPincode" value={addressForm.pincode} onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value })} /></div><button className="hero-btn" type="button" id="saveAddressBtn" onClick={saveAddress}>Save Address</button></div></div>
            <div className={`account-panel${tab === 'My Orders' ? ' active' : ''}`} id="ordersPanel"><h2 className="section-title">My Orders</h2><div id="ordersContainer">{orders.length === 0 ? <p>No orders yet</p> : orders.map((order) => <div className="order-card active" key={order?.id}><div className="order-flex"><div className="order-image"><img src={resolveProductImage(order?.products?.[0])} className="order-main-img" /></div><div className="order-details"><div className="order-id"><strong>Order ID:</strong> {order?.id}</div><div className="order-date">{new Date(order?.date).toLocaleString()}</div><div className="order-meta"><span><strong>{order?.products?.map((item) => item?.name || 'Unnamed Product').join(', ')}</strong></span><span>{formatPrice(order?.total || 0)}</span><span>{order?.status}</span></div><div className="order-meta"><span>{order?.address?.address1}{order?.address?.address2 ? `, ${order.address.address2}` : ''}</span><span>{order?.address?.city}, {order?.address?.state} - {order?.address?.pincode}</span><span>{order?.address?.phone}</span></div><div className="order-status-badge">{order?.status}</div></div></div></div>)}</div></div>
            <div className={`account-panel${tab === 'Wishlist' ? ' active' : ''}`}><h2 className="section-title">Wishlist</h2><div id="wishlistGrid">{wishlist.length === 0 ? <p>Your wishlist is empty</p> : wishlist.map((item) => <div className="order-card active" key={item?.id}><div className="order-flex"><div className="order-image"><img src={resolveProductImage(item)} className="order-main-img" /></div><div className="order-details"><div className="order-meta"><span><strong>{item?.name || 'Unnamed Product'}</strong></span><span>{formatPrice(item?.price || 0)}</span><button className="delete-btn" onClick={() => removeItem(item?.id)}>Remove</button></div></div></div></div>)}</div></div>
            <div className={`account-panel${tab === 'Security' ? ' active' : ''}`}><h2 className="section-title">Security Settings</h2><button className="hero-btn" id="openChangePassword" onClick={() => setPasswordModalOpen(true)}>Change Password</button><button className="hero-btn" id="logoutBtn" style={{ marginTop: 20, background: 'linear-gradient(135deg,#8b0000,#b30000)', color: '#fff' }} onClick={() => { logout(); navigate('/login') }}>Logout</button><div className={`password-modal${passwordModalOpen ? ' active' : ''}`} id="passwordModal"><div className="password-box"><h3>Change Password</h3><input type="password" id="oldPassword" placeholder="Old Password" value={passwordForm.oldPassword} onChange={(event) => setPasswordForm({ ...passwordForm, oldPassword: event.target.value })} /><input type="password" id="newPassword" placeholder="New Password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} /><input type="password" id="confirmNewPassword" placeholder="Re-enter New Password" value={passwordForm.confirmNewPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmNewPassword: event.target.value })} /><p className="pass-error" id="passwordError">{passwordError}</p><button className="hero-btn" id="confirmPasswordBtn" onClick={updatePassword}>Confirm Password</button><button className="close-pass-btn" id="closePasswordModal" onClick={() => setPasswordModalOpen(false)}>Cancel</button></div></div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
