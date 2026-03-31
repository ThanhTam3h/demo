import { useState, useEffect } from "react";
import { teacherApi } from "../../services/teacherapi";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function StudentsPage() {
	const [students, setStudents] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		teacherApi.getStudents().then(setStudents);
	}, []);

	const filtered = students.filter(
		(s) =>
			s.username.includes(search) ||
			s.email.includes(search) ||
			s.course_title.includes(search),
	);

	return (
		<div>
			<div className="t-page-header">
				<div>
					<h1>Học sinh</h1>
					<p>Danh sách học sinh đã đăng ký khoá học của bạn</p>
				</div>
			</div>
			<div className="t-table-wrap">
				<div className="t-table-toolbar">
					<div className="t-search">
						<span>🔍</span>
						<input
							placeholder="Tìm tên, email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<span className="t-td-muted">{filtered.length} học sinh</span>
				</div>
				<table className="t-table">
					<thead>
						<tr>
							<th>Học sinh</th>
							<th>Email</th>
							<th>Khoá học</th>
							<th>Ngày đăng ký</th>
							<th>Tiến độ</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((s) => (
							<tr key={s.id}>
								<td style={{ fontWeight: 600, color: "#e2e8f0" }}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.5rem",
										}}>
										<div
											style={{
												width: 28,
												height: 28,
												borderRadius: "50%",
												background: "linear-gradient(135deg,#22c55e,#0ea5e9)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "0.7rem",
												fontWeight: 700,
												color: "#020617",
											}}>
											{s.username[0].toUpperCase()}
										</div>
										{s.username}
									</div>
								</td>
								<td className="t-td-muted">{s.email}</td>
								<td className="t-td-muted">{s.course_title}</td>
								<td className="t-td-muted">{s.enrolled_at}</td>
								<td>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.6rem",
											minWidth: 120,
										}}>
										<div className="t-progress-wrap" style={{ flex: 1 }}>
											<div
												className="t-progress-fill"
												style={{ width: `${s.progress}%` }}
											/>
										</div>
										<span
											style={{
												fontSize: "0.75rem",
												color: s.progress === 100 ? "#4ade80" : "#64748b",
												minWidth: 30,
											}}>
											{s.progress}%
										</span>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
