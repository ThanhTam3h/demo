import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./LessonPlayerPage.css";
import { api } from "../services/api";

export function LessonPlayerPage() {
	const { courseId, lessonId } = useParams();
	const [course, setCourse] = useState(null);

	useEffect(() => {
		let isMounted = true;
		api.getCourseDetail(Number(courseId)).then((data) => {
			if (isMounted) setCourse(data);
		});
		return () => {
			isMounted = false;
		};
	}, [courseId]);

	if (!course) {
		return <div className="muted">Đang tải nội dung bài học...</div>;
	}

	const currentIndex = course.lessons.findIndex(
		(l) => String(l.id) === String(lessonId),
	);
	const lesson = course.lessons[currentIndex];
	const prevLesson = course.lessons[currentIndex - 1];
	const nextLesson = course.lessons[currentIndex + 1];

	function convertYoutubeUrl(url) {
		const id = url.split("v=")[1]?.split("&")[0];
		return `https://www.youtube.com/embed/${id}`;
	}

	return (
		<div className="lesson-page">
			<div className="player-layout">
				<div className="player-main card-surface">
					<div className="video-placeholder">
						{lesson.video_url ? (
							<iframe
								width="100%"
								height="220"
								src={convertYoutubeUrl(lesson.video_url)}
								title={lesson.title}
								frameBorder="0"
								allowFullScreen
							/>
						) : (
							<span>Chưa có video cho bài này</span>
						)}
					</div>
					<h1 className="page-title">{lesson.title}</h1>
					<p className="muted">Thuộc khoá: {course.title}</p>
					<div className="player-actions">
						{prevLesson && (
							<Link
								className="btn ghost"
								to={`/courses/${course.id}/lessons/${prevLesson.id}`}>
								Bài trước
							</Link>
						)}
						{nextLesson && (
							<Link
								className="btn primary"
								to={`/courses/${course.id}/lessons/${nextLesson.id}`}>
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
											? "sidebar-lesson active"
											: "sidebar-lesson"
									}>
									<span className="lesson-order">#{index + 1}</span>
									<span>{l.title}</span>
								</Link>
							</li>
						))}
					</ul>
				</aside>
			</div>
		</div>
	);
}
