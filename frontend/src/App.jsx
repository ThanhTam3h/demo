import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { LessonPlayerPage } from "./pages/LessonPlayerPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TeacherPage } from "./teacher/TeacherPage";

function App() {
	const { user } = useContext(AuthContext);

	return (
		<div className="app-root">
			<Routes>
				{/* KHU VỰC CỦA GIÁO VIÊN */}
				<Route
					path="/teacher/*"
					element={
						user?.role === "teacher" ? (
							<TeacherPage />
						) : (
							<Navigate to="/" replace />
						)
					}
				/>

				{/* KHU VỰC CỦA HỌC SINH VÀ KHÁCH*/}
				<Route
					path="/*"
					element={
						<MainLayout>
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/courses" element={<CoursesPage />} />
								<Route
									path="/courses/:courseId"
									element={<CourseDetailPage />}
								/>
								<Route
									path="/courses/:courseId/lessons/:lessonId"
									element={<LessonPlayerPage />}
								/>

								{/* Tính năng bảo vệ: Chưa đăng nhập mà vào Dashboard chuyển sang trang Login */}
								<Route
									path="/dashboard"
									element={
										user ? <DashboardPage /> : <Navigate to="/login" replace />
									}
								/>

								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />
							</Routes>
						</MainLayout>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
