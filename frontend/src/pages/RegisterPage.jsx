import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";
import { api } from "../services/api";

export function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("free");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("Đang tạo tài khoản...");

		try {
			// 3. Truyền dữ liệu mới vào API (Tên key khớp với Backend Django)
			const res = await api.register({
				first_name: firstName,
				last_name: lastName,
				email,
				password,
				role,
			});

			if (res && res.email) {
				setMessage(
					`Đăng ký thành công cho ${res.first_name}. Đang chuyển hướng...`,
				);
				// Đợi 1.5 giây để người dùng kịp đọc thông báo rồi chuyển về trang Đăng nhập
				setTimeout(() => navigate("/login"), 1500);
			}
		} catch (error) {
			console.error("Lỗi đăng ký:", error);
			setMessage(
				error.message || "Đăng ký thất bại, email này có thể đã được sử dụng.",
			);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card card-surface">
				<h1 className="page-title">Đăng ký</h1>
				<p className="section-subtitle">
					Tạo tài khoản để bắt đầu lộ trình học tập.
				</p>
				<form onSubmit={handleSubmit} className="auth-form">
					<label>
						Họ
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							required
						/>
					</label>
					<label>
						Tên
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							required
						/>
					</label>
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
					<label>
						Bạn là:
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							required
							style={{
								width: "100%",
								padding: "10px",
								marginTop: "5px",
								borderRadius: "4px",
								backgroundColor: "#1a1f36",
								color: "white",
								border: "1px solid #2d3748",
							}}>
							<option value="free">Học viên</option>
							<option value="teacher">Giảng viên</option>
						</select>
					</label>
					<button type="submit" className="btn primary full-width">
						Đăng ký
					</button>
				</form>
				{message && <div className="auth-message muted">{message}</div>}
			</div>
		</div>
	);
}
