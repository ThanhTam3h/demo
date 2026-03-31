import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AuthPages.css";
import { api } from "../services/api";

export function LoginPage() {
	const { setUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("Đang đăng nhập...");
		try {
			const res = await api.login(email, password);
			if (res && res.user) {
				// 1. Cập nhật Global State (để Header đổi thành tên User)
				setUser(res.user);

				// 2. Lưu token/user vào Local Storage để giữ đăng nhập khi F5
				if (res.user.role === "teacher") {
					navigate("/teacher"); // Nếu là Giáo viên -> Đẩy thẳng vào trang quản lý
				} else {
					navigate("/dashboard"); // Nếu là Học sinh/Mặc định -> Đẩy vào trang tiến độ học
				}
			}
		} catch (error) {
			// 3. Hiển thị đúng câu lỗi mà Backend gửi về (VD: "Sai mật khẩu", "Email không tồn tại")
			setMessage(error.message || "Đăng nhập thất bại, vui lòng kiểm tra lại.");
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card card-surface">
				<h1 className="page-title">Đăng nhập</h1>
				<p className="section-subtitle">
					Truy cập khoá học và dashboard học tập.
				</p>
				<form onSubmit={handleSubmit} className="auth-form">
					<label>
						Email
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					<label>
						Mật khẩu
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					<button type="submit" className="btn primary full-width">
						Đăng nhập
					</button>
				</form>
				{message && <div className="auth-message muted">{message}</div>}
			</div>
		</div>
	);
}
