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

### 2.0. Cài đặt PostgreSQL & tạo database

Trên máy của bạn (hoặc server), cần có PostgreSQL đang chạy.

Tạo database và user (ví dụ):

```sql
CREATE DATABASE elearning_db;
CREATE USER elearning_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE elearning_db TO elearning_user;
```

Tạo file `backend/.env` (nếu chưa có) với nội dung tối thiểu:

```env
DB_NAME=elearning_db
DB_USER=elearning_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

> Nếu thiếu hoặc sai các biến này, Django sẽ báo lỗi kiểu `could not connect to server` khi khởi động.

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
python manage.py makemigrations
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

### 4.1. Các API Django đã có sẵn

Trong code hiện tại, backend đã cấu hình sẵn các endpoint sau (Django REST Framework):

- `GET /api/courses/` – trả danh sách khoá học.
- `GET /api/courses/<id>/` – trả chi tiết 1 khoá học và danh sách bài học.
- `GET /api/dashboard/` – trả thống kê dashboard và danh sách khoá đang học.
- `POST /api/auth/login/` – đăng nhập bằng email + mật khẩu.
- `POST /api/auth/register/` – đăng ký tài khoản mới.

Khi PostgreSQL + `.env` cấu hình đúng và server Django chạy, frontend sẽ tự động sử dụng dữ liệu thật thay vì mock.

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
