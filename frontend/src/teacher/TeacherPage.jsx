import { useState, useEffect } from "react";
import { teacherApi } from "../services/teacherapi";
import { useNavigate } from "react-router-dom";
import "./teacherLayout.css";
import "./teacherUI.css";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { useToast, ToastContainer } from "./components/Toast";
import { OverviewPage } from "./pages/OverviewPage";
import { CoursesPage } from "./pages/CoursesPage";
import { LessonsPage } from "./pages/LessonsPage";
import { QuizPage } from "./pages/QuizPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { StudentsPage } from "./pages/StudentsPage";

const NAV = [
	{ id: "overview", label: "Tổng quan", icon: "◈" },
	{ id: "courses", label: "Khoá học", icon: "📚" },
	{ id: "lessons", label: "Bài học", icon: "🎬" },
	{ id: "quiz", label: "Quiz", icon: "📝" },
	{ id: "students", label: "Học sinh", icon: "👥" },
	{ id: "reviews", label: "Đánh giá", icon: "⭐" },
];

export function TeacherPage({ user, onLogout }) {
	const u = JSON.parse(localStorage.getItem("user"));
	const displayUser = user || u;
	const [page, setPage] = useState("overview");
	const [courses, setCourses] = useState([]);
	const { toasts, push: toast } = useToast();
	const navigate = useNavigate();

	const handleLogout = () => {
		// xoá dữ liệu auth (tuỳ project bạn)
		localStorage.removeItem("access_token");
		localStorage.removeItem("user");

		// nếu có truyền onLogout từ props thì gọi thêm
		onLogout && onLogout();

		// redirect về homepage chưa login
		navigate("/");
	};

	useEffect(() => {
		teacherApi.getCourses().then(setCourses);
	}, []);

	const initials = (name) =>
		(name || "GV")
			.split(" ")
			.map((w) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	return (
		<div className="teacher-root">
			<aside className="t-sidebar">
				<div className="t-sidebar-brand">
					<div className="t-brand-icon">GV</div>
					<div className="t-brand-text">
						<span className="t-brand-name">Lớp 12 E-Learning</span>
						<span className="t-brand-role">
							{displayUser?.fullName || "Giáo viên"}
						</span>
					</div>
				</div>
				<nav className="t-nav">
					<span className="t-nav-section">Quản lý</span>
					{NAV.map((item) => (
						<button
							key={item.id}
							className={`t-nav-link ${page === item.id ? "active" : ""}`}
							onClick={() => setPage(item.id)}>
							<span className="t-nav-icon">{item.icon}</span>
							{item.label}
							{item.id === "courses" && courses.length > 0 && (
								<span className="t-nav-badge">{courses.length}</span>
							)}
						</button>
					))}
					<span className="t-nav-section" style={{ marginTop: "0.5rem" }}>
						Liên kết
					</span>
					<a className="t-nav-link" href="/" target="_blank" rel="noreferrer">
						<span className="t-nav-icon">🌐</span>Xem trang học sinh
					</a>
				</nav>
				<div className="t-sidebar-user">
					<div className="t-user-avatar">{initials(user?.fullName)}</div>
					<div className="t-user-info">
						<div className="t-user-name">{user?.fullName || "Giáo viên"}</div>
						<div className="t-user-email">{user?.email || ""}</div>
					</div>
					<button
						className="t-logout-btn"
						onClick={handleLogout}
						title="Đăng xuất">
						⎋
					</button>
				</div>
			</aside>
			<main className="t-main">
				<div className="t-topbar">
					<span className="t-topbar-title">
						{
							{
								overview: "Tổng quan",
								courses: "Khoá học",
								lessons: "Bài học",
								quiz: "Quiz",
								students: "Học sinh",
								reviews: "Đánh giá",
							}[page]
						}
					</span>
					<div className="t-topbar-right">
						<button className="t-btn t-btn-ghost" onClick={handleLogout}>
							Đăng xuất
						</button>
					</div>
				</div>
				<div className="t-content">
					{page === "overview" && <OverviewPage courses={courses} />}
					{page === "courses" && (
						<CoursesPage
							courses={courses}
							setCourses={setCourses}
							toast={toast}
						/>
					)}
					{page === "lessons" && (
						<LessonsPage courses={courses} toast={toast} />
					)}
					{page === "quiz" && <QuizPage courses={courses} toast={toast} />}
					{page === "students" && <StudentsPage />}
					{page === "reviews" && (
						<ReviewsPage courses={courses} toast={toast} />
					)}
				</div>
			</main>
			<ToastContainer toasts={toasts} />
		</div>
	);
}
