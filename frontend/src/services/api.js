// Service đơn giản để sau này nối với Django API
// Tạm thời trả về dữ liệu giả nhưng với interface giống gọi API thật

const API_BASE_URL = 'http://localhost:8000/api'

const mockCourses = [
  {
    id: 1,
    title: 'Toán 12 - Ôn thi THPT Quốc gia',
    shortDescription:
      'Hệ thống hoá lý thuyết và bài tập trọng tâm Toán 12: hàm số, tích phân, xác suất, hình không gian.',
    level: 'Cơ bản',
    levelColor: 'green',
    duration: '25 giờ học',
    tags: ['Toán 12', 'Ôn thi THPT', 'Trắc nghiệm', 'Khối A00'],
    examBlocks: ['A00'],
    progress: 45,
  },
  {
    id: 2,
    title: 'Vật lý 12 - Luyện đề nâng cao',
    shortDescription:
      'Chọn lọc bài tập và đề luyện về dao động, sóng cơ, điện xoay chiều, quang học, hạt nhân.',
    level: 'Trung cấp',
    levelColor: 'blue',
    duration: '18 giờ học',
    tags: ['Vật lý 12', 'Luyện đề', 'THPT Quốc gia', 'Khối A00', 'Khối A01'],
    examBlocks: ['A00', 'A01'],
    progress: 10,
  },
  {
    id: 3,
    title: 'Hoá học 12 - Tổng ôn cấp tốc',
    shortDescription: 'Tập trung vào các chuyên đề hoá vô cơ, hữu cơ, bài tập tính toán hay gặp trong đề thi.',
    level: 'Nâng cao',
    levelColor: 'orange',
    duration: '20 giờ học',
    tags: ['Hoá học 12', 'Tổng ôn', 'Bài tập', 'Khối A00'],
    examBlocks: ['A00'],
    progress: 0,
  },
]

const mockCourseDetail = {
  1: {
    id: 1,
    title: 'Toán 12 - Ôn thi THPT Quốc gia',
    description:
      'Khoá học giúp bạn nắm vững kiến thức trọng tâm Toán 12 và luyện các dạng bài thường gặp trong đề thi tốt nghiệp THPT.',
    level: 'Cơ bản',
    duration: '25 giờ học',
    lessons: [
      { id: 1, title: 'Hàm số bậc nhất, bậc hai & đồ thị', duration: '30 phút' },
      { id: 2, title: 'Nguyên hàm - Tích phân - Ứng dụng', duration: '35 phút' },
      { id: 3, title: 'Số phức & phương trình, bất phương trình', duration: '32 phút' },
    ],
  },
  2: {
    id: 2,
    title: 'Vật lý 12 - Luyện đề nâng cao',
    description:
      'Tập trung hệ thống hoá kiến thức và luyện đề nâng cao các chương trọng tâm trong chương trình Vật lý 12.',
    level: 'Trung cấp',
    duration: '18 giờ học',
    lessons: [
      { id: 1, title: 'Dao động điều hoà & con lắc lò xo', duration: '28 phút' },
      { id: 2, title: 'Dòng điện xoay chiều & công suất', duration: '30 phút' },
      { id: 3, title: 'Sóng ánh sáng & lượng tử ánh sáng', duration: '26 phút' },
    ],
  },
}

const mockDashboard = {
  totalCourses: 6,
  inProgress: 3,
  completed: 1,
  weeklyHours: 5.5,
  enrolledCourses: mockCourses,
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function safeFetchJson(url, options) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error('Network error')
    return await response.json()
  } catch (error) {
    // Fallback sang dữ liệu giả nếu backend chưa chạy
    console.warn('API request failed, using mock data instead:', error.message)
    return null
  }
}

export const api = {
  API_BASE_URL,

  async getCourses() {
    const data = await safeFetchJson(`${API_BASE_URL}/courses/`)
    if (data) return data
    await delay(300)
    return mockCourses
  },

  async getCourseDetail(courseId) {
    const data = await safeFetchJson(`${API_BASE_URL}/courses/${courseId}/`)
    if (data) return data
    await delay(200)
    return mockCourseDetail[courseId]
  },

  async getDashboard() {
    const data = await safeFetchJson(`${API_BASE_URL}/dashboard/`)
    if (data) return data
    await delay(200)
    return mockDashboard
  },

  async login(email, password) {
    const body = JSON.stringify({ email, password })
    const data = await safeFetchJson(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (data) return data
    await delay(300)
    return { token: 'mock-token', user: { email } }
  },

  async register(payload) {
    const body = JSON.stringify(payload)
    const data = await safeFetchJson(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (data) return data
    await delay(300)
    return { id: 1, ...payload }
  },
}
