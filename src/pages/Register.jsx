import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoPath } from '../data/site'

export default function Register() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    mobile: '',
    dob: '',
    adsress: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError('')

    // Password match validation
    if (form.password !== form.confirmPassword) {

      setError('Passwords do not match')

      return
    }

    try {

      setLoading(true)

      const response = await fetch(
        'http://localhost:5000/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: form.email.trim(),
            mobile: form.mobile.trim(),
            dob: form.dob,
            adsress: form.adsress.trim(),
            password: form.password,
            role: 'user'
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.message || 'Registration failed'
        )
      }

      // Save user locally
      localStorage.setItem(
        'user',
        JSON.stringify(data.data)
      )

      // Redirect to login
      navigate('/login')

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)
    }
  }

  return (
    <>
      <style>{`

        .auth-clean{
          background:
          radial-gradient(circle at top,#2b0000 0%,#000 60%);
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          font-family:'Poppins',sans-serif;
        }

        .auth-card{
          background:#000;
          padding:45px 35px;
          border-radius:24px;
          border:1px solid rgba(212,175,55,0.35);
          width:100%;
          max-width:450px;
          box-shadow:0 30px 80px rgba(0,0,0,0.8);
          backdrop-filter:blur(12px);
        }

        .auth-title{
          color:#d4af37;
          font-size:34px;
          text-align:center;
          margin-bottom:10px;
          font-family:'Playfair Display',serif;
        }

        .auth-sub{
          color:#aaa;
          text-align:center;
          margin-bottom:30px;
          font-size:14px;
        }

        .auth-input{
          width:100%;
          padding:15px 18px;
          margin-bottom:18px;
          background:#111;
          border:1px solid rgba(212,175,55,0.25);
          border-radius:14px;
          color:#fff;
          outline:none;
          transition:0.3s;
          font-size:15px;
        }

        .auth-input:focus{
          border-color:#d4af37;
          box-shadow:0 0 0 4px rgba(212,175,55,0.08);
        }

        .auth-submit{
          width:100%;
          padding:15px;
          border-radius:14px;
          border:none;
          background:
          linear-gradient(135deg,#d4af37,#b8962e);
          color:#000;
          font-weight:700;
          cursor:pointer;
          transition:.3s;
          font-size:15px;
          margin-top:5px;
        }

        .auth-submit:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 30px rgba(212,175,55,0.25);
        }

        .auth-submit:disabled{
          opacity:0.7;
          cursor:not-allowed;
        }

        .nt-auth-logo{
          margin-bottom:25px;
          text-align:center;
        }

        .nt-auth-logo img{
          width:110px;
          max-width:100%;
          height:auto;
          filter:
          drop-shadow(0 10px 30px rgba(212,175,55,0.4));
        }

        .error-text{
          color:#ff6b6b;
          font-size:14px;
          margin-bottom:15px;
          text-align:left;
        }

        .bottom-link{
          margin-top:22px;
          color:#999;
          font-size:14px;
          text-align:center;
        }

        .bottom-link a{
          color:#d4af37;
          text-decoration:none;
          font-weight:600;
        }

      `}</style>

      <div className="auth-clean">

        <div className="auth-card">

          <div className="nt-auth-logo">
            <img
              src={logoPath}
              alt="Naarithread Logo"
            />
          </div>

          <h2 className="auth-title">
            Create Account
          </h2>

          <p className="auth-sub">
            Join the elegance of Naarithread
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email Address"
              className="auth-input"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="auth-input"
              value={form.mobile}
              onChange={(event) =>
                setForm({
                  ...form,
                  mobile: event.target.value
                })
              }
              required
            />

            <input
              type="date"
              className="auth-input"
              value={form.dob}
              onChange={(event) =>
                setForm({
                  ...form,
                  dob: event.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Address"
              className="auth-input"
              value={form.adsress}
              onChange={(event) =>
                setForm({
                  ...form,
                  adsress: event.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="auth-input"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm({
                  ...form,
                  confirmPassword: event.target.value
                })
              }
              required
            />

            {error ? (
              <div className="error-text">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {
                loading
                  ? 'Creating Account...'
                  : 'Create Account'
              }
            </button>

          </form>

          <p className="bottom-link">
            Already have an account?{' '}
            <Link to="/login">
              Sign In
            </Link>
          </p>

        </div>

      </div>
    </>
  )
}