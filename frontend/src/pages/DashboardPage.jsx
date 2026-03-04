import { useEffect, useState } from 'react'
import './DashboardPage.css'
import { api } from '../services/api'

export function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getDashboard().then(setStats)
  }, [])

  if (!stats) {
    return <div className="muted">Đang tải dashboard...</div>
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard học tập</h1>
      <p className="section-subtitle">
        Tổng quan tiến độ ôn tập các môn lớp 12 và thời gian bạn dành cho việc học mỗi tuần.
      </p>

      <div className="stats-grid">
        <div className="card-surface stat-card">
          <span className="stat-label">Tổng số khoá học</span>
          <span className="stat-value">{stats.totalCourses}</span>
        </div>
        <div className="card-surface stat-card">
          <span className="stat-label">Đang học</span>
          <span className="stat-value">{stats.inProgress}</span>
        </div>
        <div className="card-surface stat-card">
          <span className="stat-label">Đã hoàn thành</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="card-surface stat-card">
          <span className="stat-label">Giờ học / tuần</span>
          <span className="stat-value">{stats.weeklyHours}</span>
        </div>
      </div>

      <div className="card-surface enrolled-section">
        <h2>Khoá học của bạn</h2>
        <p className="muted">
          Tiếp tục các khoá Toán, Lý, Hoá đang học dở để không bị gián đoạn lộ trình ôn thi.
        </p>
        <div className="enrolled-list">
          {stats.enrolledCourses.map((course) => (
            <div key={course.id} className="enrolled-item">
              <div>
                <div className="enrolled-title">{course.title}</div>
                <div className="muted">{course.shortDescription}</div>
              </div>
              <div className="enrolled-progress">
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="progress-label">{course.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
