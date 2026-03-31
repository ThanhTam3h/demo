import { useState, useEffect } from "react";
import { teacherApi } from "../../services/teacherapi";
import { ConfirmDialog } from "../components/ConfirmDialog";

function QuizFormModal({ onClose, onSave, courses }) {
	const [form, setForm] = useState({
		title: "",
		description: "",
		course_id: courses[0]?.id || "",
		time_limit_minutes: 45,
		pass_score: 70,
	});
	const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
	return (
		<div className="t-modal-overlay" onClick={onClose}>
			<div className="t-modal" onClick={(e) => e.stopPropagation()}>
				<div className="t-modal-header">
					<h2>Tạo Quiz mới</h2>
					<button className="t-modal-close" onClick={onClose}>
						✕
					</button>
				</div>
				<div className="t-modal-body">
					<div className="t-form-group">
						<label className="t-label">Tên Quiz *</label>
						<input
							className="t-input"
							value={form.title}
							onChange={(e) => set("title", e.target.value)}
							placeholder="VD: Kiểm tra chương 1"
						/>
					</div>
					<div className="t-form-group">
						<label className="t-label">Khoá học</label>
						<select
							className="t-select"
							value={form.course_id}
							onChange={(e) => set("course_id", Number(e.target.value))}>
							{courses.map((c) => (
								<option key={c.id} value={c.id}>
									{c.title}
								</option>
							))}
						</select>
					</div>
					<div className="t-form-row">
						<div className="t-form-group">
							<label className="t-label">Giới hạn (phút)</label>
							<input
								className="t-input"
								type="number"
								min="1"
								value={form.time_limit_minutes}
								onChange={(e) =>
									set("time_limit_minutes", Number(e.target.value))
								}
							/>
						</div>
						<div className="t-form-group">
							<label className="t-label">Điểm đạt (%)</label>
							<input
								className="t-input"
								type="number"
								min="0"
								max="100"
								value={form.pass_score}
								onChange={(e) => set("pass_score", Number(e.target.value))}
							/>
						</div>
					</div>
					<div className="t-form-group">
						<label className="t-label">Mô tả</label>
						<textarea
							className="t-textarea"
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
						/>
					</div>
				</div>
				<div className="t-modal-footer">
					<button className="t-btn t-btn-ghost" onClick={onClose}>
						Huỷ
					</button>
					<button className="t-btn t-btn-primary" onClick={() => onSave(form)}>
						Tạo Quiz
					</button>
				</div>
			</div>
		</div>
	);
}

export function QuizPage({ courses, toast }) {
	const [quizzes, setQuizzes] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [confirm, setConfirm] = useState(null);

	useEffect(() => {
		teacherApi.getQuizzes().then(setQuizzes);
	}, []);

	const handleSave = async (form) => {
		const created = await teacherApi.createQuiz(form);
		setQuizzes((q) => [...q, created]);
		toast("Đã tạo quiz");
		setShowForm(false);
	};

	const toggleActive = async (id) => {
		const q = quizzes.find((x) => x.id === id);
		await teacherApi.updateQuiz(id, { is_active: !q.is_active });
		setQuizzes((qs) =>
			qs.map((x) => (x.id === id ? { ...x, is_active: !x.is_active } : x)),
		);
		toast("Đã cập nhật");
	};

	const handleDelete = async (id) => {
		await teacherApi.deleteQuiz(id);
		setQuizzes((q) => q.filter((x) => x.id !== id));
		toast("Đã xoá quiz");
		setConfirm(null);
	};

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Quiz</h1>
					<p>Quản lý bài kiểm tra trắc nghiệm</p>
				</div>
				<button
					className="t-btn t-btn-primary"
					onClick={() => setShowForm(true)}>
					+ Tạo Quiz
				</button>
			</div>
			<div className="t-table-wrap">
				<table className="t-table">
					<thead>
						<tr>
							<th>Tên Quiz</th>
							<th>Khoá học</th>
							<th>Câu hỏi</th>
							<th>Lượt làm</th>
							<th>Giới hạn</th>
							<th>Điểm đạt</th>
							<th>Trạng thái</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{quizzes.map((q) => (
							<tr key={q.id}>
								<td className="t-td-title">
									<span>{q.title}</span>
								</td>
								<td className="t-td-muted">{q.course_title}</td>
								<td>{q.question_count}</td>
								<td>{q.attempt_count}</td>
								<td className="t-td-muted">{q.time_limit_minutes} phút</td>
								<td className="t-td-muted">{q.pass_score}%</td>
								<td>
									<span
										className={`t-badge ${q.is_active ? "t-badge-green" : "t-badge-gray"}`}>
										{q.is_active ? "Đang mở" : "Đã đóng"}
									</span>
								</td>
								<td>
									<div className="t-action-row">
										<button
											className="t-btn t-btn-ghost t-btn-sm"
											onClick={() => toggleActive(q.id)}>
											{q.is_active ? "Đóng" : "Mở"}
										</button>
										<button
											className="t-btn t-btn-danger t-btn-sm"
											onClick={() => setConfirm(q.id)}>
											🗑️
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!quizzes.length && (
					<div className="t-empty">
						<div className="t-empty-icon">📝</div>
						<p>Chưa có quiz nào.</p>
						<button
							className="t-btn t-btn-primary"
							onClick={() => setShowForm(true)}>
							+ Thêm quiz đầu tiên
						</button>
					</div>
				)}
			</div>
			{showForm && (
				<QuizFormModal
					courses={courses}
					onClose={() => setShowForm(false)}
					onSave={handleSave}
				/>
			)}
			{confirm && (
				<ConfirmDialog
					message="Xoá quiz này?"
					onConfirm={() => handleDelete(confirm)}
					onCancel={() => setConfirm(null)}
				/>
			)}
		</div>
	);
}
