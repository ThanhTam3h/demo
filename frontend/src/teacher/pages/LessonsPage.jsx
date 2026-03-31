import { useState, useEffect } from "react";
import { teacherApi } from "../../services/teacherapi";
import { ConfirmDialog } from "../components/ConfirmDialog";

function LessonFormModal({ lesson, onClose, onSave }) {
	const [form, setForm] = useState({
		title: lesson?.title || "",
		video_url: lesson?.video_url || "",
		content: lesson?.content || "",
		order: lesson?.order ?? 1,
		lesson_type: lesson?.lesson_type || "video",
		is_preview: lesson?.is_preview || false,
		duration: lesson?.duration ? Math.round(lesson.duration / 60) : "",
	});
	const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
	return (
		<div className="t-modal-overlay" onClick={onClose}>
			<div className="t-modal" onClick={(e) => e.stopPropagation()}>
				<div className="t-modal-header">
					<h2>{lesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}</h2>
					<button className="t-modal-close" onClick={onClose}>
						✕
					</button>
				</div>
				<div className="t-modal-body">
					<div className="t-form-group">
						<label className="t-label">Tiêu đề *</label>
						<input
							className="t-input"
							value={form.title}
							onChange={(e) => set("title", e.target.value)}
						/>
					</div>
					<div className="t-form-row">
						<div className="t-form-group">
							<label className="t-label">Loại</label>
							<select
								className="t-select"
								value={form.lesson_type}
								onChange={(e) => set("lesson_type", e.target.value)}>
								<option value="video">🎬 Video</option>
								<option value="text">📄 Bài đọc</option>
								<option value="quiz">📝 Quiz</option>
							</select>
						</div>
						<div className="t-form-group">
							<label className="t-label">Thứ tự</label>
							<input
								className="t-input"
								type="number"
								min="1"
								value={form.order}
								onChange={(e) => set("order", Number(e.target.value))}
							/>
						</div>
					</div>
					{form.lesson_type === "video" && (
						<div className="t-form-group">
							<label className="t-label">URL Video</label>
							<input
								className="t-input"
								value={form.video_url}
								onChange={(e) => set("video_url", e.target.value)}
								placeholder="https://youtube.com/watch?v=..."
							/>
						</div>
					)}
					<div className="t-form-row">
						<div className="t-form-group">
							<label className="t-label">Thời lượng (phút)</label>
							<input
								className="t-input"
								type="number"
								min="0"
								value={form.duration}
								onChange={(e) => set("duration", e.target.value)}
							/>
						</div>
						<div
							className="t-form-group"
							style={{ justifyContent: "flex-end" }}>
							<label className="t-toggle">
								<input
									type="checkbox"
									checked={form.is_preview}
									onChange={(e) => set("is_preview", e.target.checked)}
								/>
								<span className="t-toggle-label">Xem miễn phí</span>
							</label>
						</div>
					</div>
					<div className="t-form-group">
						<label className="t-label">Ghi chú</label>
						<textarea
							className="t-textarea"
							value={form.content}
							onChange={(e) => set("content", e.target.value)}
						/>
					</div>
				</div>
				<div className="t-modal-footer">
					<button className="t-btn t-btn-ghost" onClick={onClose}>
						Huỷ
					</button>
					<button
						className="t-btn t-btn-primary"
						onClick={() =>
							onSave({
								...form,
								duration: form.duration ? Number(form.duration) * 60 : null,
							})
						}>
						{lesson ? "Lưu" : "Thêm bài học"}
					</button>
				</div>
			</div>
		</div>
	);
}

export function LessonsPage({ courses, toast }) {
	const [selectedId, setSelectedId] = useState(courses[0]?.id || null);
	const [lessons, setLessons] = useState({});
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [editLesson, setEditLesson] = useState(null);
	const [confirm, setConfirm] = useState(null);

	useEffect(() => {
		if (!selectedId || lessons[selectedId]) return;
		const fetchLessonsData = async () => {
			setLoading(true);
			try {
				const data = await teacherApi.getLessons(selectedId);
				setLessons((l) => ({ ...l, [selectedId]: data }));
			} catch (error) {
				console.error("Lỗi khi tải bài học:", error);
			} finally {
				// Dù thành công hay thất bại thì cũng phải tắt loading
				setLoading(false);
			}
		};

		// 2. Thực thi hàm vừa tạo
		fetchLessonsData();
	}, [selectedId]);

	const current = lessons[selectedId] || [];

	const handleSave = async (form) => {
		if (editLesson) {
			await teacherApi.updateLesson(editLesson.id, form);
			setLessons((l) => ({
				...l,
				[selectedId]: l[selectedId].map((x) =>
					x.id === editLesson.id ? { ...x, ...form } : x,
				),
			}));
			toast("Đã cập nhật bài học");
		} else {
			const created = await teacherApi.createLesson(selectedId, form);
			setLessons((l) => ({
				...l,
				[selectedId]: [...(l[selectedId] || []), created],
			}));
			toast("Đã thêm bài học");
		}
		setShowForm(false);
		setEditLesson(null);
	};

	const handleDelete = async (id) => {
		await teacherApi.deleteLesson(id);
		setLessons((l) => ({
			...l,
			[selectedId]: l[selectedId].filter((x) => x.id !== id),
		}));
		toast("Đã xoá bài học");
		setConfirm(null);
	};

	const typeLabel = (t) =>
		({ video: "🎬 Video", text: "📄 Bài đọc", quiz: "📝 Quiz" })[t] || t;

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Bài học</h1>
					<p>Quản lý nội dung từng bài</p>
				</div>
				<button
					className="t-btn t-btn-primary"
					disabled={!selectedId}
					onClick={() => {
						setEditLesson(null);
						setShowForm(true);
					}}>
					+ Thêm bài học
				</button>
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
			<div className="t-table-wrap">
				<div className="t-table-toolbar">
					<span
						style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
						{loading ? "Đang tải..." : `${current.length} bài học`}
					</span>
				</div>
				<table className="t-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Tiêu đề</th>
							<th>Loại</th>
							<th>Thời lượng</th>
							<th>Preview</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{[...current]
							.sort((a, b) => a.order - b.order)
							.map((l) => (
								<tr key={l.id}>
									<td className="t-td-muted">{l.order}</td>
									<td className="t-td-title">
										<span>{l.title}</span>
									</td>
									<td>{typeLabel(l.lesson_type)}</td>
									<td className="t-td-muted">
										{l.duration ? `${Math.round(l.duration / 60)} phút` : "—"}
									</td>
									<td>
										{l.is_preview ? (
											<span className="t-badge t-badge-green">Miễn phí</span>
										) : (
											<span className="t-badge t-badge-gray">Khoá</span>
										)}
									</td>
									<td>
										<div className="t-action-row">
											<button
												className="t-btn t-btn-ghost t-btn-sm"
												onClick={() => {
													setEditLesson(l);
													setShowForm(true);
												}}>
												✏️ Sửa
											</button>
											<button
												className="t-btn t-btn-danger t-btn-sm"
												onClick={() => setConfirm(l.id)}>
												🗑️
											</button>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
				{!loading && !current.length && (
					<div className="t-empty">
						<div className="t-empty-icon">🎬</div>
						<p>Chưa có bài học nào.</p>
						<button
							className="t-btn t-btn-primary"
							onClick={() => setShowForm(true)}>
							+ Thêm bài học đầu tiên
						</button>
					</div>
				)}
			</div>
			{showForm && (
				<LessonFormModal
					lesson={editLesson}
					onClose={() => {
						setShowForm(false);
						setEditLesson(null);
					}}
					onSave={handleSave}
				/>
			)}
			{confirm && (
				<ConfirmDialog
					message="Xoá bài học này?"
					onConfirm={() => handleDelete(confirm)}
					onCancel={() => setConfirm(null)}
				/>
			)}
		</div>
	);
}
