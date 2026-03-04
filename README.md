# Hệ thống học trực tuyến – Django + React

Project của bạn gồm 2 phần:
- Backend: Django (API, models courses/users, v.v.)
- Frontend: React (Vite) hiển thị giao diện e-learning

Dưới đây là hướng dẫn từng bước để **cài đặt, chạy và kết nối** Django và React.

---

## 1. Chuẩn bị môi trường

Yêu cầu:
- Python 3.x (khuyến nghị 3.10+)
- Node.js + npm (khuyến nghị Node 18+)
- Git (tuỳ chọn)

Cấu trúc thư mục chính:
- Backend (Django): trong thư mục `backend/` (manage.py, core/, courses/, users/ ...)
- Frontend (React): thư mục `frontend/`

---

## 2. Cài đặt & chạy Django backend

### 2.1. Tạo & kích hoạt virtualenv (nếu chưa có)
Trong thư mục project (chứa thư mục backend và frontend):

```bash
cd "D:\Last year\CNLTHD\Project"
python -m venv .venv
```

Kích hoạt virtualenv (Windows PowerShell):

```bash
.venv\Scripts\Activate.ps1
```

### 2.2. Cài đặt thư viện Python

```bash
cd backend
pip install -r requirements.txt
```

### 2.3. Chạy migrations

```bash
python manage.py migrate
```

### 2.4. (Tuỳ chọn) Tạo tài khoản admin

```bash
python manage.py createsuperuser
```

### 2.5. Chạy server Django

```bash
python manage.py runserver
```

Server Django sẽ chạy ở: `http://localhost:8000/`

> Lưu ý: Frontend đang mặc định gọi API ở `http://localhost:8000/api/...` (xem file `frontend/src/services/api.js`).

---

## 3. Cài đặt & chạy React frontend

### 3.1. Cài đặt dependencies frontend

Mở 1 cửa sổ terminal mới, sau đó:

```bash
cd "D:\Last year\CNLTHD\Project\frontend"
npm install
```

### 3.2. Chạy dev server React (Vite)

```bash
npm run dev
```

Vite sẽ hiển thị địa chỉ, thường là:

- `http://localhost:5173/`

Mở trình duyệt và truy cập địa chỉ đó để xem giao diện hệ thống học trực tuyến.

> Bạn nên để **2 terminal** chạy song song:
> - Terminal 1: `python manage.py runserver` (backend)
> - Terminal 2: `npm run dev` (frontend)

---

## 4. Kết nối Django API với React

Frontend dùng file: `frontend/src/services/api.js` với cấu hình:

```js
const API_BASE_URL = 'http://localhost:8000/api'
```

Các hàm chính trong service:
- `getCourses()`  → gọi `GET /api/courses/`
- `getCourseDetail(courseId)` → gọi `GET /api/courses/<id>/`
- `getDashboard()` → gọi `GET /api/dashboard/`
- `login(email, password)` → gọi `POST /api/auth/login/`
- `register(payload)` → gọi `POST /api/auth/register/`

Hiện tại, nếu **backend chưa có API hoặc bị lỗi**, service sẽ **tự động fallback sang dữ liệu giả (mock)** để giao diện vẫn chạy bình thường.

### 4.1. Việc bạn cần làm ở Django

1. Tạo các API endpoint tương ứng với URL trên, ví dụ bằng Django REST Framework:
   - `GET /api/courses/` trả danh sách khoá học (list các object JSON giống `mockCourses`).
   - `GET /api/courses/<id>/` trả chi tiết 1 khoá học (giống `mockCourseDetail[id]`).
   - `GET /api/dashboard/` trả thống kê dashboard (giống `mockDashboard`).
   - `POST /api/auth/login/` trả data user + token.
   - `POST /api/auth/register/` tạo user mới.

2. Cấu hình URL Django (ví dụ trong `core/urls.py`) để các path này bắt đầu bằng `/api/`.

3. (Khuyến nghị) Cài `django-cors-headers` để cho phép React (cổng 5173) gọi sang Django (cổng 8000):

   - Cài đặt:
     ```bash
     pip install django-cors-headers
     ```

   - Thêm vào `INSTALLED_APPS` trong `core/settings.py`:
     ```python
     INSTALLED_APPS = [
         ...,
         'corsheaders',
     ]
     ```

   - Thêm middleware (trên CommonMiddleware):
     ```python
     MIDDLEWARE = [
         'corsheaders.middleware.CorsMiddleware',
         ...,
     ]
     ```

   - Cho phép origin frontend:
     ```python
     CORS_ALLOWED_ORIGINS = [
         'http://localhost:5173',
     ]
     ```

Khi bạn đã làm xong các bước trên, frontend sẽ tự động sử dụng dữ liệu thật từ Django thay vì mock.

---

## 5. Tóm tắt nhanh các lệnh chính

### Backend (Django)
```bash
cd "D:\Last year\CNLTHD\Project"
.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd "D:\Last year\CNLTHD\Project\frontend"
npm install
npm run dev
```

---

## 6. Khi gặp lỗi

- Nếu React báo lỗi gọi API, nhưng bạn chưa bật Django → không sao, UI sẽ dùng dữ liệu mock.
- Nếu muốn kiểm tra kết nối thật, hãy đảm bảo:
  - Django chạy ở `http://localhost:8000/`.
  - API `/api/courses/`, `/api/dashboard/`, v.v. trả JSON đúng cấu trúc.
  - CORS đã cho phép origin `http://localhost:5173`.

Bạn có thể chỉnh `API_BASE_URL` trong `frontend/src/services/api.js` nếu sau này deploy lên domain khác (ví dụ server thật).
