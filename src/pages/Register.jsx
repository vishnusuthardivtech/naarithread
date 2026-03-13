import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { logoPath } from '../data/site'

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  return (
    <>
      <style>{`
        .auth-clean{background:radial-gradient(circle at top,#2b0000 0%,#000 60%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Poppins',sans-serif;}
        .auth-card{background:#000;padding:50px 40px;border-radius:20px;border:1px solid rgba(212,175,55,0.4);width:100%;max-width:420px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,0.8);}
        .auth-card h2{font-family:'Playfair Display',serif;color:#d4af37;margin-bottom:10px;}
        .auth-sub{color:#ccc;margin-bottom:30px;font-size:14px;}
        .auth-input{width:100%;padding:14px 18px;margin-bottom:20px;background:#111;border:1px solid rgba(212,175,55,0.4);border-radius:30px;color:#fff;outline:none;transition:.3s;}
        .auth-submit{width:100%;padding:14px;border-radius:30px;border:none;background:linear-gradient(135deg,#d4af37,#b8962e);color:#000;font-weight:600;cursor:pointer;transition:.3s;}
        .nt-auth-logo{margin-bottom:25px;text-align:center;}
        .nt-auth-logo img{width:100px;max-width:100%;height:auto;filter:drop-shadow(0 10px 30px rgba(212,175,55,0.4));}
      `}</style>
      <div className="auth-clean">
        <div className="auth-card">
          <div className="nt-auth-logo"><img src={logoPath} alt="Naarithread Logo" /></div>
          <h2>Create Account</h2>
          <p className="auth-sub">Join the elegance of Naarithread</p>
          <form onSubmit={(event) => {
            event.preventDefault()
            if (form.password !== form.confirmPassword) {
              setError('Passwords do not match')
              return
            }
            try {
              register(form.name.trim(), form.email.trim(), form.password)
              navigate('/')
            } catch (err) {
              setError(err.message)
            }
          }}>
            <input type="text" placeholder="Full Name" className="auth-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input type="email" placeholder="Email Address" className="auth-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input type="password" placeholder="Password" className="auth-input" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <input type="password" placeholder="Confirm Password" className="auth-input" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
            {error ? <div className="error-text" style={{ display: 'block' }}>{error}</div> : null}
            <button type="submit" className="auth-submit">Create Account</button>
          </form>
          <p style={{ marginTop: 20, color: '#aaa', fontSize: 14 }}>Already have an account? <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none' }}>Sign In</Link></p>
        </div>
      </div>
    </>
  )
}

