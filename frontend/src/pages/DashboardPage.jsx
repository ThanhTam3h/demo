import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DashboardPage.css";
import { api } from "../services/api";

export function DashboardPage() {
	const [stats, setStats] = useState(null);

	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			api
				.getDashboard()
				.then((data) => {
					setStats(data); // Thành công thì lưu data
				})
				.catch((error) => {
					// Thất bại thì in ra lỗi
					console.error("Lỗi khi tải Dashboard:", error);

					setStats({
						totalCourses: 0,
						inProgress: 0,
						completed: 0,
						weeklyHours: 0,
						enrolledCourses: [],
					});
				});
		}
	}, [user]);

	if (!stats) {
		return <div className="muted">Đang tải dashboard...</div>;
	}

	const hasCourses = stats.totalCourses > 0;

	return (
		<div className="dashboard-page">
			<h1 className="page-title">
				Chào mừng {user?.fullName || "bạn"} trở lại!
			</h1>
			<p className="section-subtitle">
				Tổng quan tiến độ ôn tập các môn lớp 12 và thời gian bạn dành cho việc
				học mỗi tuần.
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
				{hasCourses ? (
					<>
						<p className="muted">
							Tiếp tục các khoá Toán, Lý, Hoá đang học dở để không bị gián đoạn
							lộ trình ôn thi.
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
					</>
				) : (
					<div
						className="empty-state"
						style={{ textAlign: "center", padding: "40px 20px" }}>
						<p className="muted" style={{ marginBottom: "20px" }}>
							Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa ôn luyện khối
							A00 ngay nhé!
						</p>
						<Link to="/courses" className="btn primary">
							Khám phá khóa học
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
