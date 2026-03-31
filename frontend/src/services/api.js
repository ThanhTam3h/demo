// Service đơn giản để sau này nối với Django API
// Tạm thời trả về dữ liệu giả nhưng với interface giống gọi API thật

// const mockCourses = [
// 	{
// 		id: 1,
// 		title: "Toán 12 - Ôn thi THPT Quốc gia",
// 		shortDescription:
// 			"Hệ thống hoá lý thuyết và bài tập trọng tâm Toán 12: hàm số, tích phân, xác suất, hình không gian.",
// 		level: "Cơ bản",
// 		levelColor: "green",
// 		duration: "25 giờ học",
// 		tags: ["Toán 12", "Ôn thi THPT", "Trắc nghiệm", "Khối A00"],
// 		examBlocks: ["A00"],
// 		progress: 45,
// 	},
// 	{
// 		id: 2,
// 		title: "Vật lý 12 - Luyện đề nâng cao",
// 		shortDescription:
// 			"Chọn lọc bài tập và đề luyện về dao động, sóng cơ, điện xoay chiều, quang học, hạt nhân.",
// 		level: "Trung cấp",
// 		levelColor: "blue",
// 		duration: "18 giờ học",
// 		tags: ["Vật lý 12", "Luyện đề", "THPT Quốc gia", "Khối A00", "Khối A01"],
// 		examBlocks: ["A00", "A01"],
// 		progress: 10,
// 	},
// 	{
// 		id: 3,
// 		title: "Hoá học 12 - Tổng ôn cấp tốc",
// 		shortDescription:
// 			"Tập trung vào các chuyên đề hoá vô cơ, hữu cơ, bài tập tính toán hay gặp trong đề thi.",
// 		level: "Nâng cao",
// 		levelColor: "orange",
// 		duration: "20 giờ học",
// 		tags: ["Hoá học 12", "Tổng ôn", "Bài tập", "Khối A00"],
// 		examBlocks: ["A00"],
// 		progress: 0,
// 	},
// ];

// const mockCourseDetail = {
// 	1: {
// 		id: 1,
// 		title: "Toán 12 - Ôn thi THPT Quốc gia",
// 		description:
// 			"Khoá học giúp bạn nắm vững kiến thức trọng tâm Toán 12 và luyện các dạng bài thường gặp trong đề thi tốt nghiệp THPT.",
// 		level: "Cơ bản",
// 		duration: "25 giờ học",
// 		lessons: [
// 			{
// 				id: 1,
// 				title: "Hàm số bậc nhất, bậc hai & đồ thị",
// 				duration: "30 phút",
// 			},
// 			{
// 				id: 2,
// 				title: "Nguyên hàm - Tích phân - Ứng dụng",
// 				duration: "35 phút",
// 			},
// 			{
// 				id: 3,
// 				title: "Số phức & phương trình, bất phương trình",
// 				duration: "32 phút",
// 			},
// 		],
// 	},
// 	2: {
// 		id: 2,
// 		title: "Vật lý 12 - Luyện đề nâng cao",
// 		description:
// 			"Tập trung hệ thống hoá kiến thức và luyện đề nâng cao các chương trọng tâm trong chương trình Vật lý 12.",
// 		level: "Trung cấp",
// 		duration: "18 giờ học",
// 		lessons: [
// 			{
// 				id: 1,
// 				title: "Dao động điều hoà & con lắc lò xo",
// 				duration: "28 phút",
// 			},
// 			{ id: 2, title: "Dòng điện xoay chiều & công suất", duration: "30 phút" },
// 			{
// 				id: 3,
// 				title: "Sóng ánh sáng & lượng tử ánh sáng",
// 				duration: "26 phút",
// 			},
// 		],
// 	},
// };

// const mockDashboard = {
// 	totalCourses: 6,
// 	inProgress: 3,
// 	completed: 1,
// 	weeklyHours: 5.5,
// 	enrolledCourses: mockCourses,
// };

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function safeFetchJson(url, options) {
// 	try {
// 		const response = await fetch(url, options);
// 		if (!response.ok) throw new Error("Network error");
// 		return await response.json();
// 	} catch (error) {
// 		// Fallback sang dữ liệu giả nếu backend chưa chạy
// 		console.warn("API request failed, using mock data instead:", error.message);
// 		return null;
// 	}
// }

export const API_BASE_URL = "http://localhost:8000/api";

export const authStorage = {
	getToken: () => localStorage.getItem("token"),
	setToken: (token) => localStorage.setItem("token", token),
	getUser: () => {
		const raw = localStorage.getItem("user");
		return raw ? JSON.parse(raw) : null;
	},
	setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
	clear: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},
};

export async function fetchJson(url, options = {}) {
	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	const token = localStorage.getItem("token");
	if (token) {
		// Lưu ý: Sửa chữ 'Bearer' thành 'Token' nếu Django của bạn dùng Token Authentication mặc định
		headers["Authorization"] = `Token ${token}`;
	}

	const response = await fetch(url, { ...options, headers });

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.detail || errorData.message || "Lỗi từ máy chủ");
	}

	return response.json();
}

export const api = {
	API_BASE_URL,

	async getCourses() {
		return fetchJson(`${API_BASE_URL}/courses/`);
	},

	async getCourseDetail(courseId) {
		return fetchJson(`${API_BASE_URL}/courses/${courseId}/`);
	},

	async getDashboard() {
		return fetchJson(`${API_BASE_URL}/dashboard/`);
	},

	async login(email, password) {
		const data = await fetchJson(`${API_BASE_URL}/auth/login/`, {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});

		// Tự động lưu Token và User vào ổ cứng khi đăng nhập thành công
		if (data && data.token) {
			authStorage.setToken(data.token);
			authStorage.setUser(data.user);
		}
		return data;
	},

	async register(payload) {
		const data = await fetchJson(`${API_BASE_URL}/auth/register/`, {
			method: "POST",
			body: JSON.stringify(payload),
		});

		// Tự động lưu Token và User khi đăng ký thành công
		if (data && data.token) {
			authStorage.setToken(data.token);
			authStorage.setUser({
				id: data.id,
				email: data.email,
				name: data.name,
				role: data.role,
			});
		}
		return data;
	},

	async enroll(courseId) {
		return fetchJson(`${API_BASE_URL}/courses/${courseId}/enroll/`, {
			method: "POST",
		});
	},

	async getReviews(courseId) {
		try {
			return await fetchJson(`${API_BASE_URL}/courses/${courseId}/reviews/`);
		} catch {
			return [];
		}
	},

	async saveLessonProgress(lessonId, lastPosition) {
		return fetchJson(`${API_BASE_URL}/lesson-progress/`, {
			method: "POST",
			body: JSON.stringify({ lesson: lessonId, last_position: lastPosition }),
		});
	},
};
