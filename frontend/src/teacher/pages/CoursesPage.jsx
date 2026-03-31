import { useState } from "react";
import { teacherApi } from "../../services/teacherapi";
import { ConfirmDialog } from "../components/ConfirmDialog";

function CourseFormModal({ course, onClose, onSave }) {
	const [form, setForm] = useState({
		title: course?.title || "",
		description: course?.description || "",
		subject: course?.subject || "",
		exam_blocks: course?.exam_blocks || "",
		price: course?.price || "0",
		is_published: course?.is_published || false,
		is_premium_only: course?.is_premium_only ?? true,
	});
	const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
	return (
		<div className="t-modal-overlay" onClick={onClose}>
			<div className="t-modal" onClick={(e) => e.stopPropagation()}>
				<div className="t-modal-header">
					<h2>{course ? "Chỉnh sửa khoá học" : "Tạo khoá học mới"}</h2>
					<button className="t-modal-close" onClick={onClose}>
						✕
					</button>
				</div>
				<div className="t-modal-body">
					<div className="t-form-group">
						<label className="t-label">Tên khoá học *</label>
						<input
							className="t-input"
							value={form.title}
							onChange={(e) => set("title", e.target.value)}
							placeholder="VD: Toán 12 – Ôn thi THPT"
						/>
					</div>
					<div className="t-form-group">
						<label className="t-label">Mô tả</label>
						<textarea
							className="t-textarea"
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
						/>
					</div>
					<div className="t-form-row">
						<div className="t-form-group">
							<label className="t-label">Môn học</label>
							<input
								className="t-input"
								value={form.subject}
								onChange={(e) => set("subject", e.target.value)}
								placeholder="VD: Toán 12"
							/>
						</div>
						<div className="t-form-group">
							<label className="t-label">Khối thi</label>
							<input
								className="t-input"
								value={form.exam_blocks}
								onChange={(e) => set("exam_blocks", e.target.value)}
								placeholder="VD: A00;A01"
							/>
						</div>
					</div>
					<div className="t-form-row">
						<div className="t-form-group">
							<label className="t-label">Giá (VNĐ)</label>
							<input
								className="t-input"
								type="number"
								min="0"
								value={form.price}
								onChange={(e) => set("price", e.target.value)}
							/>
						</div>
						<div
							className="t-form-group"
							style={{ justifyContent: "flex-end", gap: "0.7rem" }}>
							<label className="t-toggle">
								<input
									type="checkbox"
									checked={form.is_published}
									onChange={(e) => set("is_published", e.target.checked)}
								/>
								<span className="t-toggle-label">Published</span>
							</label>
							<label className="t-toggle">
								<input
									type="checkbox"
									checked={form.is_premium_only}
									onChange={(e) => set("is_premium_only", e.target.checked)}
								/>
								<span className="t-toggle-label">Premium only</span>
							</label>
						</div>
					</div>
				</div>
				<div className="t-modal-footer">
					<button className="t-btn t-btn-ghost" onClick={onClose}>
						Huỷ
					</button>
					<button className="t-btn t-btn-primary" onClick={() => onSave(form)}>
						{course ? "Lưu thay đổi" : "Tạo khoá học"}
					</button>
				</div>
			</div>
		</div>
	);
}

export function CoursesPage({ courses, setCourses, toast }) {
	const [search, setSearch] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editCourse, setEditCourse] = useState(null);
	const [confirm, setConfirm] = useState(null);
	const filtered = courses.filter((c) =>
		c.title.toLowerCase().includes(search.toLowerCase()),
	);

	const handleSave = async (form) => {
		if (editCourse) {
			await teacherApi.updateCourse(editCourse.id, form);
			setCourses((cs) =>
				cs.map((c) => (c.id === editCourse.id ? { ...c, ...form } : c)),
			);
			toast("Đã cập nhật khoá học");
		} else {
			const created = await teacherApi.createCourse(form);
			setCourses((cs) => [created, ...cs]);
			toast("Đã tạo khoá học mới");
		}
		setShowForm(false);
		setEditCourse(null);
	};

	const handleDelete = async (id) => {
		await teacherApi.deleteCourse(id);
		setCourses((cs) => cs.filter((c) => c.id !== id));
		toast("Đã xoá khoá học");
		setConfirm(null);
	};

	const togglePublish = async (id) => {
		const c = courses.find((x) => x.id === id);
		await teacherApi.updateCourse(id, { is_published: !c.is_published });
		setCourses((cs) =>
			cs.map((x) =>
				x.id === id ? { ...x, is_published: !x.is_published } : x,
			),
		);
		toast("Đã cập nhật trạng thái");
	};

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Khoá học</h1>
					<p>{courses.length} khoá học của bạn</p>
				</div>
				<button
					className="t-btn t-btn-primary"
					onClick={() => {
						setEditCourse(null);
						setShowForm(true);
					}}>
					+ Tạo khoá học
				</button>
			</div>
			<div className="t-table-wrap">
				<div className="t-table-toolbar">
					<div className="t-search">
						<span>🔍</span>
						<input
							placeholder="Tìm tên khoá học..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<span className="t-td-muted">{filtered.length} kết quả</span>
				</div>
				<table className="t-table">
					<thead>
						<tr>
							<th>Tên khoá học</th>
							<th>Môn / Khối thi</th>
							<th>Bài học</th>
							<th>Học sinh</th>
							<th>Giá</th>
							<th>Trạng thái</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((c) => (
							<tr key={c.id}>
								<td className="t-td-title">
									<span title={c.title}>{c.title}</span>
								</td>
								<td>
									<div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
										{c.subject}
									</div>
									{c.exam_blocks && (
										<div style={{ display: "flex", gap: 3, marginTop: 2 }}>
											{c.exam_blocks.split(";").map((b) => (
												<span key={b} className="t-badge t-badge-blue">
													{b.trim()}
												</span>
											))}
										</div>
									)}
								</td>
								<td>{c.lesson_count ?? 0}</td>
								<td>{c.student_count ?? 0}</td>
								<td>
									{parseFloat(c.price) === 0 ? (
										<span className="t-badge t-badge-green">Miễn phí</span>
									) : (
										<span style={{ fontSize: "0.82rem" }}>
											{Number(c.price).toLocaleString("vi-VN")}đ
										</span>
									)}
								</td>
								<td>
									<button
										className={`t-badge ${c.is_published ? "t-badge-green" : "t-badge-gray"}`}
										style={{
											cursor: "pointer",
											border: "none",
											background: "inherit",
										}}
										onClick={() => togglePublish(c.id)}
										title="Click để đổi trạng thái">
										{c.is_published ? "● Published" : "○ Draft"}
									</button>
								</td>
								<td>
									<div className="t-action-row">
										<button
											className="t-btn t-btn-ghost t-btn-sm"
											onClick={() => {
												setEditCourse(c);
												setShowForm(true);
											}}>
											✏️ Sửa
										</button>
										<button
											className="t-btn t-btn-danger t-btn-sm"
											onClick={() => setConfirm(c.id)}>
											🗑️
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!filtered.length && (
					<div className="t-empty">
						<div className="t-empty-icon">📭</div>
						<p>{search ? "Không tìm thấy." : "Chưa có khoá học nào."}</p>
						{!search && (
							<button
								className="t-btn t-btn-primary"
								onClick={() => setShowForm(true)}>
								+ Tạo khoá đầu tiên
							</button>
						)}
					</div>
				)}
			</div>
			{showForm && (
				<CourseFormModal
					course={editCourse}
					onClose={() => {
						setShowForm(false);
						setEditCourse(null);
					}}
					onSave={handleSave}
				/>
			)}
			{confirm && (
				<ConfirmDialog
					message="Xoá khoá học này? Tất cả bài học bên trong cũng sẽ bị xoá."
					onConfirm={() => handleDelete(confirm)}
					onCancel={() => setConfirm(null)}
				/>
			)}
		</div>
	);
}
