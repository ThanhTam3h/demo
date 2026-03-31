export function OverviewPage({ courses }) {
	const totalStudents = courses.reduce((s, c) => s + (c.student_count || 0), 0);
	const publishedCount = courses.filter((c) => c.is_published).length;
	const totalLessons = courses.reduce((s, c) => s + (c.lesson_count || 0), 0);
	const avgRating = (() => {
		const rated = courses.filter((c) => c.avg_rating);
		if (!rated.length) return "—";
		return (rated.reduce((s, c) => s + c.avg_rating, 0) / rated.length).toFixed(
			1,
		);
	})();

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Tổng quan</h1>
					<p>Theo dõi hoạt động giảng dạy của bạn</p>
				</div>
			</div>
			<div className="t-stat-grid">
				<div className="t-stat-card">
					<div className="t-stat-icon">📚</div>
					<div className="t-stat-value">{courses.length}</div>
					<div className="t-stat-label">Khoá học</div>
					<div className="t-stat-delta">↑ {publishedCount} đang published</div>
				</div>
				<div
					className="t-stat-card"
					style={{ "--accent": "linear-gradient(90deg,#0ea5e9,#6366f1)" }}>
					<div className="t-stat-icon">👥</div>
					<div className="t-stat-value">{totalStudents}</div>
					<div className="t-stat-label">Tổng học sinh</div>
				</div>
				<div
					className="t-stat-card"
					style={{ "--accent": "linear-gradient(90deg,#f59e0b,#ef4444)" }}>
					<div className="t-stat-icon">🎬</div>
					<div className="t-stat-value">{totalLessons}</div>
					<div className="t-stat-label">Tổng bài học</div>
				</div>
				<div
					className="t-stat-card"
					style={{ "--accent": "linear-gradient(90deg,#a855f7,#ec4899)" }}>
					<div className="t-stat-icon">⭐</div>
					<div className="t-stat-value">{avgRating}</div>
					<div className="t-stat-label">Đánh giá TB</div>
				</div>
			</div>
			<div className="t-table-wrap">
				<div className="t-table-toolbar">
					<span
						style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
						Khoá học của bạn
					</span>
				</div>
				<table className="t-table">
					<thead>
						<tr>
							<th>Tên khoá học</th>
							<th>Môn học</th>
							<th>Bài học</th>
							<th>Học sinh</th>
							<th>Đánh giá</th>
							<th>Trạng thái</th>
						</tr>
					</thead>
					<tbody>
						{courses.map((c) => (
							<tr key={c.id}>
								<td className="t-td-title">
									<span>{c.title}</span>
								</td>
								<td className="t-td-muted">{c.subject}</td>
								<td>{c.lesson_count}</td>
								<td>{c.student_count}</td>
								<td>{c.avg_rating ? `⭐ ${c.avg_rating}` : "—"}</td>
								<td>
									<span
										className={`t-badge ${c.is_published ? "t-badge-green" : "t-badge-gray"}`}>
										{c.is_published ? "Published" : "Draft"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!courses.length && (
					<div className="t-empty">
						<div className="t-empty-icon">📭</div>
						<p>Chưa có khoá học nào.</p>
					</div>
				)}
			</div>
		</div>
	);
}
