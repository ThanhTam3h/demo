import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './CourseDetailPage.css'
import { api } from '../services/api'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    let isMounted = true
    api
      .getCourseDetail(Number(courseId))
      .then((data) => {
        if (isMounted) setCourse(data)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [courseId])

  if (!course) {
    return <div className="muted">Đang tải thông tin khoá học...</div>
  }

  return (
    <div className="course-detail-page">
      <div className="detail-hero card-surface">
        <div>
          <span className="pill blue">{course.level}</span>
          <h1 className="page-title">{course.title}</h1>
          <p className="muted">{course.description}</p>
          <div className="detail-meta">
            <span>{course.duration}</span>
            <span>{course.lessons.length} bài học</span>
          </div>
        </div>
        <div className="detail-cta">
          <button className="btn primary">Bắt đầu học ngay</button>
          <span className="muted">Tiến độ của bạn sẽ được lưu tự động.</span>
        </div>
      </div>

      <div className="lessons-section card-surface">
        <div className="lessons-header">
          <h2>Nội dung khoá học</h2>
          <span className="muted">Chọn bài học để xem chi tiết và video bài giảng.</span>
        </div>
        <ul className="lessons-list">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <Link
                to={`/courses/${course.id}/lessons/${lesson.id}`}
                className="lesson-item"
              >
                <div className="lesson-left">
                  <span className="lesson-index">#{index + 1}</span>
                  <div>
                    <div className="lesson-title">{lesson.title}</div>
                    <div className="lesson-meta">{lesson.duration}</div>
                  </div>
                </div>
                <span className="lesson-status">Chưa học</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
