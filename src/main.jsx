import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './style.css'
import './admin/admin.css'

const routerBase = import.meta.env.BASE_URL.endsWith('/') && import.meta.env.BASE_URL !== '/'
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

