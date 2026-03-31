import { fetchJson, API_BASE_URL } from "./api";

export const teacherApi = {
	// --- KHOÁ HỌC ---
	async getCourses() {
		return fetchJson(`${API_BASE_URL}/courses/`);
	},
	async createCourse(payload) {
		return fetchJson(`${API_BASE_URL}/courses/`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	async updateCourse(id, payload) {
		return fetchJson(`${API_BASE_URL}/courses/${id}/`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	async deleteCourse(id) {
		return fetchJson(`${API_BASE_URL}/courses/${id}/`, {
			method: "DELETE",
		});
	},

	// --- BÀI HỌC ---
	async getLessons(courseId) {
		return fetchJson(`${API_BASE_URL}/courses/${courseId}/lessons/`);
	},
	async createLesson(courseId, payload) {
		return fetchJson(`${API_BASE_URL}/courses/${courseId}/lessons/`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	async updateLesson(id, payload) {
		return fetchJson(`${API_BASE_URL}/lessons/${id}/`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	async deleteLesson(id) {
		return fetchJson(`${API_BASE_URL}/lessons/${id}/`, {
			method: "DELETE",
		});
	},

	// --- QUIZ (BÀI KIỂM TRA) ---
	async getQuizzes() {
		return fetchJson(`${API_BASE_URL}/quizzes/`);
	},
	async createQuiz(payload) {
		return fetchJson(`${API_BASE_URL}/quizzes/`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	async updateQuiz(id, payload) {
		return fetchJson(`${API_BASE_URL}/quizzes/${id}/`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	async deleteQuiz(id) {
		return fetchJson(`${API_BASE_URL}/quizzes/${id}/`, {
			method: "DELETE",
		});
	},

	// --- ĐÁNH GIÁ & HỌC SINH ---
	async getReviews(courseId) {
		try {
			return await fetchJson(`${API_BASE_URL}/courses/${courseId}/reviews/`);
		} catch {
			return [];
		}
	},
	async deleteReview(id) {
		return fetchJson(`${API_BASE_URL}/reviews/${id}/`, {
			method: "DELETE",
		});
	},
	async getStudents() {
		return fetchJson(`${API_BASE_URL}/students/`);
	},
};
