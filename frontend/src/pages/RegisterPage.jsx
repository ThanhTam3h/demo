import { useState } from 'react'
import './AuthPages.css'
import { api } from '../services/api'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Đang tạo tài khoản...')
    const res = await api.register({ fullName, email, password })
    if (res && res.email) {
      setMessage(`Đăng ký thành công cho ${res.email}`)
    } else {
      setMessage('Đăng ký thất bại, vui lòng thử lại.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card-surface">
        <h1 className="page-title">Đăng ký</h1>
        <p className="section-subtitle">Tạo tài khoản để bắt đầu lộ trình học tập.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Họ và tên
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label>
            Email sinh viên
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
            Đăng ký
          </button>
        </form>
        {message && <div className="auth-message muted">{message}</div>}
      </div>
    </div>
  )
}
