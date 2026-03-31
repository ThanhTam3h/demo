import { useState, useEffect } from "react";
import { teacherApi } from "../../services/teacherapi";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function ReviewsPage({ courses, toast }) {
	const [selectedId, setSelectedId] = useState(courses[0]?.id || null);
	const [reviews, setReviews] = useState([]);
	const [confirm, setConfirm] = useState(null);

	useEffect(() => {
		if (!selectedId) return;
		teacherApi.getReviews(selectedId).then(setReviews);
	}, [selectedId]);

	const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
	const avg = reviews.length
		? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
		: "—";

	const handleDelete = async (id) => {
		await teacherApi.deleteReview(id);
		setReviews((r) => r.filter((x) => x.id !== id));
		toast("Đã xoá đánh giá");
		setConfirm(null);
	};

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Đánh giá</h1>
					<p>Xem nhận xét của học sinh</p>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					marginBottom: "1.2rem",
					flexWrap: "wrap",
				}}>
				{courses.map((c) => (
					<button
						key={c.id}
						className={`t-btn ${selectedId === c.id ? "t-btn-primary" : "t-btn-ghost"}`}
						onClick={() => setSelectedId(c.id)}>
						{c.title.length > 30 ? c.title.slice(0, 28) + "…" : c.title}
					</button>
				))}
			</div>
			<div
				style={{
					display: "flex",
					gap: "1rem",
					marginBottom: "1.2rem",
					width: "100%",
				}}>
				<div className="t-stat-card" style={{ flex: 1 }}>
					<div className="t-stat-icon">⭐</div>
					<div className="t-stat-value">{avg}</div>
					<div className="t-stat-label">Điểm TB</div>
				</div>
				<div
					className="t-stat-card"
					style={{
						flex: 1,
						"--accent": "linear-gradient(90deg,#0ea5e9,#6366f1)",
					}}>
					<div className="t-stat-icon">💬</div>
					<div className="t-stat-value">{reviews.length}</div>
					<div className="t-stat-label">Lượt đánh giá</div>
				</div>
			</div>
			<div className="t-table-wrap">
				<table className="t-table">
					<thead>
						<tr>
							<th>Học sinh</th>
							<th>Sao</th>
							<th>Nhận xét</th>
							<th>Ngày</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{reviews.map((r) => (
							<tr key={r.id}>
								<td style={{ fontWeight: 600, color: "#e2e8f0" }}>
									{r.username}
								</td>
								<td style={{ color: "#facc15", letterSpacing: "-1px" }}>
									{stars(r.rating)}
								</td>
								<td style={{ maxWidth: 300 }}>
									<span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
										{r.comment || "—"}
									</span>
								</td>
								<td className="t-td-muted">{r.createdAt}</td>
								<td>
									<button
										className="t-btn t-btn-danger t-btn-sm"
										onClick={() => setConfirm(r.id)}>
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!reviews.length && (
					<div className="t-empty">
						<div className="t-empty-icon">💬</div>
						<p>Chưa có đánh giá nào.</p>
					</div>
				)}
			</div>
			{confirm && (
				<ConfirmDialog
					message="Xoá đánh giá này?"
					onConfirm={() => handleDelete(confirm)}
					onCancel={() => setConfirm(null)}
				/>
			)}
		</div>
	);
}
