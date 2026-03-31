import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './CoursesPage.css'
import { api } from '../services/api'

export function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [selectedBlock, setSelectedBlock] = useState('ALL')

  useEffect(() => {
    let isMounted = true
    api
      .getCourses()
      .then((data) => {
        if (isMounted) setCourses(data)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  const filteredCourses =
    selectedBlock === 'ALL'
      ? courses
      : courses.filter((course) =>
          Array.isArray(course.examBlocks) ? course.examBlocks.includes(selectedBlock) : false,
        )

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1 className="page-title">Khoá học trực tuyến</h1>
        <p className="section-subtitle">
          Chọn các khoá học phù hợp với khối thi (A00, A01) để ôn tập hiệu quả.
        </p>
        <div className="exam-filter">
          <button
            type="button"
            className={selectedBlock === 'ALL' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setSelectedBlock('ALL')}
          >
            Tất cả khối
          </button>
          <button
            type="button"
            className={selectedBlock === 'A00' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setSelectedBlock('A00')}
          >
            Khối A00 (Toán - Lý - Hoá)
          </button>
          <button
            type="button"
            className={selectedBlock === 'A01' ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setSelectedBlock('A01')}
          >
            Khối A01 (Toán - Lý - Anh)
          </button>
        </div>
      </div>

      <div className="grid-cards">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="course-card card-surface">
            <div className="course-card-top">
              <span className={`pill ${course.levelColor}`}>{course.level}</span>
              <span className="course-duration">{course.duration}</span>
            </div>
            <h3>{course.title}</h3>
            <p className="muted">{course.shortDescription}</p>
            <div className="tag-row">
              {course.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="course-progress">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
              </div>
              <span className="progress-label">{course.progress}% đã hoàn thành</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
