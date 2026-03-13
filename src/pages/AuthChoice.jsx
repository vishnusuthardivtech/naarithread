import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoPath } from '../data/site'

const googleIcon = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'

export default function AuthChoice() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    document.body.classList.add('auth-lock')

    return () => {
      document.body.classList.remove('auth-lock')
    }
  }, [])

  return (
    <div className="auth-clean auth-lock">
      <div className="auth-wrapper">
        <div className="auth-card auth-choice-container">
          <div className="auth-brand-top">
            <img src={logoPath} alt="Naarithread logo" />
            <h1>Naarithread</h1>
          </div>

          <h2>Sign in</h2>
          <p className="auth-sub">Sign in or create an account</p>

          <button type="button" className="auth-primary-btn btn-primary" onClick={() => navigate('/login')}>
            Continue with Naarithread
          </button>

          <button type="button" className="auth-google-btn btn-google">
            <img src={googleIcon} alt="" aria-hidden="true" />
            Continue with Google
          </button>

          <div className="auth-divider divider">
            <span>or</span>
          </div>

          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="button" className="auth-submit btn-continue">
            Continue
          </button>
        </div>

        <div className="auth-footer auth-links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
        </div>
      </div>
    </div>
  )
}
