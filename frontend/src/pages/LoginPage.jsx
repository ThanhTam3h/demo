import { useState } from 'react'
import './AuthPages.css'
import { api } from '../services/api'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Đang đăng nhập...')
    const res = await api.login(email, password)
    if (res && res.user) {
      setMessage(`Đăng nhập thành công cho ${res.user.email}`)
    } else {
      setMessage('Đăng nhập thất bại, vui lòng thử lại.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card-surface">
        <h1 className="page-title">Đăng nhập</h1>
        <p className="section-subtitle">Truy cập khoá học và dashboard học tập.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn primary full-width">
            Đăng nhập
          </button>
        </form>
        {message && <div className="auth-message muted">{message}</div>}
      </div>
    </div>
  )
}
