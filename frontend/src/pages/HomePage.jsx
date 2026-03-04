import { Link } from 'react-router-dom'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Nền tảng học trực tuyến cho học sinh lớp 12</span>
          <h1>
            Luyện thi hiệu quả
            <span className="accent"> chinh phục kỳ thi THPT Quốc gia</span>
          </h1>
          <p className="hero-subtitle">
            Tổng hợp bài giảng, bài tập và đề luyện bám sát chương trình lớp 12 các môn Toán, Lý,
            Hoá, Văn, Anh giúp bạn ôn tập có hệ thống và theo dõi tiến độ học tập mỗi ngày.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/courses">
              Khám phá khoá học
            </Link>
            <Link className="btn ghost" to="/dashboard">
              Xem tiến độ học tập
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-number">20+</div>
              <div className="stat-label">Khoá học & chuyên đề</div>
            </div>
            <div>
              <div className="stat-number">1200+</div>
              <div className="stat-label">Học sinh đang luyện thi</div>
            </div>
            <div>
              <div className="stat-number">95%</div>
              <div className="stat-label">Hoàn thành khoá học</div>
            </div>
          </div>
        </div>
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="preview-body">
              <div className="preview-video" />
              <div className="preview-sidebar">
                <div className="preview-title">Ôn tập Toán 12 - Ôn thi tốt nghiệp</div>
                <ul className="preview-lessons">
                  <li className="active">Hàm số & đồ thị</li>
                  <li>Nguyên hàm - Tích phân</li>
                  <li>Số phức & phương trình</li>
                  <li>Đề minh hoạ & đề thi thử</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-highlights">
        <h2>Tại sao nên học trên Lớp 12 E-Learning?</h2>
        <div className="highlight-grid">
          <div className="highlight-card">
            <h3>Bài giảng cập nhật</h3>
            <p>Nội dung bám sát chương trình SGK và đề thi THPT Quốc gia mới nhất.</p>
          </div>
          <div className="highlight-card">
            <h3>Bài tập & đề luyện</h3>
            <p>
              Hệ thống bài tập từ cơ bản đến nâng cao, đề minh hoạ và đề thi thử giúp bạn làm quen cấu
              trúc đề thi.
            </p>
          </div>
          <div className="highlight-card">
            <h3>Theo dõi tiến độ</h3>
            <p>Hệ thống tự động lưu lại tiến trình học, điểm số và gợi ý nội dung cần ôn lại.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
