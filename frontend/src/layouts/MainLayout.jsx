import { Link, useLocation } from 'react-router-dom'
import './MainLayout.css'

export function MainLayout({ children }) {
  const location = useLocation()

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link')

  return (
    <div className="layout-root">
      <header className="layout-header">
        <div className="logo">Lớp 12 E-Learning</div>
        <nav className="layout-nav">
          <Link className={isActive('/')} to="/">
            Trang chủ
          </Link>
          <Link className={isActive('/courses')} to="/courses">
            Khoá học
          </Link>
          <Link className={isActive('/dashboard')} to="/dashboard">
            Dashboard
          </Link>
        </nav>
        <div className="layout-auth">
          <Link className="btn ghost" to="/login">
            Đăng nhập
          </Link>
          <Link className="btn primary" to="/register">
            Đăng ký
          </Link>
        </div>
      </header>

      <main className="layout-main">{children}</main>

      <footer className="layout-footer">
        <div>
          © {new Date().getFullYear()} Lớp 12 E-Learning. Tất cả quyền được bảo lưu.
        </div>
        <div className="footer-links">
          <a href="#">Điều khoản</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Hỗ trợ</a>
        </div>
      </footer>
    </div>
  )
}
