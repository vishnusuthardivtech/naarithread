import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { logoPath } from '../data/site'

export default function AuthModal() {
  const { authOpen, setAuthOpen, login, register, user } = useApp()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  useEffect(() => {
    if (user || sessionStorage.getItem('authShown')) {
      return
    }

    const timer = window.setTimeout(() => {
      setAuthOpen(true)
      sessionStorage.setItem('authShown', 'true')
    }, 15000)

    return () => window.clearTimeout(timer)
  }, [setAuthOpen, user])

  const closeModal = () => {
    setAuthOpen(false)
    setError('')
  }

  const handleLogin = () => {
    try {
      login(loginForm.email.trim(), loginForm.password)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      register(registerForm.name.trim(), registerForm.email.trim(), registerForm.password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={`auth-modal${authOpen ? ' active' : ''}`} id="authModal">
      <div className="auth-modal-box">
        <button className="auth-close" id="closeAuth" onClick={closeModal}>X</button>
        <div className="auth-left">
          <div className="auth-left-inner">
            <div className="auth-brand">
              <img src={logoPath} alt="Naarithread Logo" />
              <h2>Naari Thread</h2>
              <p>Royal elegance for modern celebrations.</p>
            </div>
            <ul>
              <li>Access wishlist</li>
              <li>Faster checkout</li>
              <li>Order history</li>
            </ul>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-tabs">
            <button className={`tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`tab-btn${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Register</button>
          </div>
          <form className={`auth-form${tab === 'login' ? ' active' : ''}`} onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Email address" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} required />
            <input type="password" placeholder="Password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} required />
            <button type="button" className="auth-btn" id="modalLoginBtn" onClick={handleLogin}>Login</button>
            <span className="auth-link">Forgot password?</span>
          </form>
          <form className={`auth-form${tab === 'register' ? ' active' : ''}`} onSubmit={(event) => event.preventDefault()}>
            <input type="text" placeholder="Full name" value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} required />
            <input type="email" placeholder="Email address" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} required />
            <input type="password" placeholder="Password" value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} required />
            <input type="password" placeholder="Confirm Password" value={registerForm.confirmPassword} onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })} required />
            <button type="button" className="auth-btn" id="modalRegisterBtn" onClick={handleRegister}>Create Account</button>
          </form>
          {error ? <p className="pass-error" style={{ display: 'block' }}>{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
