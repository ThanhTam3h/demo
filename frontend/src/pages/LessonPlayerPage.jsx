import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './LessonPlayerPage.css'
import { api } from '../services/api'

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    let isMounted = true
    api.getCourseDetail(Number(courseId)).then((data) => {
      if (isMounted) setCourse(data)
    })
    return () => {
      isMounted = false
    }
  }, [courseId])

  if (!course) {
    return <div className="muted">Đang tải nội dung bài học...</div>
  }

  const currentIndex = course.lessons.findIndex((l) => String(l.id) === String(lessonId))
  const lesson = course.lessons[currentIndex]
  const prevLesson = course.lessons[currentIndex - 1]
  const nextLesson = course.lessons[currentIndex + 1]

  return (
    <div className="lesson-page">
      <div className="player-layout">
        <div className="player-main card-surface">
          <div className="video-placeholder">
            <span>Video bài giảng: {lesson.title}</span>
          </div>
          <h1 className="page-title">{lesson.title}</h1>
          <p className="muted">Thuộc khoá: {course.title}</p>
          <div className="player-actions">
            {prevLesson && (
              <Link
                className="btn ghost"
                to={`/courses/${course.id}/lessons/${prevLesson.id}`}
              >
                Bài trước
              </Link>
            )}
            {nextLesson && (
              <Link
                className="btn primary"
                to={`/courses/${course.id}/lessons/${nextLesson.id}`}
              >
                Bài tiếp theo
              </Link>
            )}
          </div>
        </div>

        <aside className="player-sidebar card-surface">
          <h2>Danh sách bài học</h2>
          <ul className="sidebar-lessons">
            {course.lessons.map((l, index) => (
              <li key={l.id}>
                <Link
                  to={`/courses/${course.id}/lessons/${l.id}`}
                  className={
                    String(l.id) === String(lessonId)
                      ? 'sidebar-lesson active'
                      : 'sidebar-lesson'
                  }
                >
                  <span className="lesson-order">#{index + 1}</span>
                  <span>{l.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
