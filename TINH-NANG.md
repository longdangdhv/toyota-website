# TỔNG HỢP TÍNH NĂNG WEBSITE TOYOTA

**Ngày cập nhật:** 04/03/2026  
**Phiên bản:** 1.0.0

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Tính năng Frontend](#tính-năng-frontend)
4. [Tính năng Backend](#tính-năng-backend)
5. [Tính năng Admin Panel](#tính-năng-admin-panel)
6. [Database Schema](#database-schema)
7. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
8. [API Endpoints](#api-endpoints)
9. [Tài khoản mặc định](#tài-khoản-mặc-định)

---

## 🎯 TỔNG QUAN HỆ THỐNG

Website Toyota là hệ thống quản lý và giới thiệu sản phẩm ô tô Toyota với đầy đủ tính năng:
- Website giới thiệu sản phẩm cho khách hàng
- Hệ thống đăng ký lái thử và báo giá
- Admin panel quản lý toàn bộ hệ thống
- Database SQLite lưu trữ dữ liệu
- Auto-reload khi phát triển

---

## 💻 CÔNG NGHỆ SỬ DỤNG

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** v4.18.2 - Web framework
- **EJS** v3.1.9 - Template engine
- **Better-SQLite3** v9.2.2 - Database
- **Express-Session** v1.17.3 - Session management

### Frontend
- **Tailwind CSS** - Styling framework
- **Vanilla JavaScript** - Interactivity
- **HTML5** - Markup

### Development Tools
- **Nodemon** v3.0.1 - Auto-reload server

---

## 🎨 TÍNH NĂNG FRONTEND

### 1. TRANG CHỦ (`/`)
- Hero banner slider với nhiều ảnh
- Danh sách xe nổi bật
- Tin tức mới nhất
- Khuyến mãi đang diễn ra
- Call-to-action buttons
- Responsive design

### 2. TRANG SẢN PHẨM (`/san-pham`)
- Danh sách tất cả các dòng xe
- Lọc theo danh mục (Sedan, SUV, MPV, Bán tải)
- Hiển thị thông tin cơ bản: tên, giá, hình ảnh
- Link đến trang chi tiết sản phẩm

### 3. TRANG CHI TIẾT SẢN PHẨM (`/san-pham/:slug`)
- Thông tin chi tiết xe
- Thông số kỹ thuật (engine, power, transmission, etc.)
- Danh sách tính năng
- Màu sắc có sẵn
- Các phiên bản và giá
- Nút đăng ký lái thử
- Nút yêu cầu báo giá

### 4. TRANG TIN TỨC (`/tin-tuc`)
- Danh sách tất cả tin tức
- Phân loại theo category
- Hiển thị thumbnail, tiêu đề, tóm tắt, ngày đăng
- Link đến bài viết chi tiết

### 5. TRANG CHI TIẾT TIN TỨC (`/tin-tuc/:id`)
- Nội dung đầy đủ bài viết
- Hình ảnh minh họa
- Thông tin meta (ngày đăng, category)

### 6. TRANG KHUYẾN MÃI (`/khuyen-mai`)
- Danh sách các chương trình khuyến mãi
- Chi tiết ưu đãi
- Thời hạn áp dụng
- Xe được áp dụng

### 7. TRANG ĐĂNG KÝ LÁI THỬ (`/dang-ky-lai-thu`)
**Form đăng ký bao gồm:**
- Họ tên *
- Số điện thoại *
- Email
- Chọn xe muốn lái thử
- Ngày muốn lái thử
- Giờ lái thử
- Ghi chú

**Tính năng đặc biệt:**
- ✅ Notification góc dưới phải khi thành công
- ✅ Màu xanh lá đẹp, font chữ lớn
- ✅ Tự động chuyển về trang chủ sau 5 giây
- ✅ Animation mượt mà

### 8. TRANG TRẢ GÓP (`/tra-gop`)
**Bao gồm 2 phần:**

**A. Công cụ tính trả góp:**
- Chọn xe
- % trả trước (20-80%)
- Thời hạn vay (1-8 năm)
- Lãi suất
- Tính toán tự động: số tiền vay, trả hàng tháng

**B. Form tư vấn trả góp:**
- Thông tin cá nhân
- Xe quan tâm
- Ghi chú
- Notification đẹp khi gửi thành công

### 9. TRANG LIÊN HỆ (`/lien-he`)
**Form liên hệ:**
- Họ tên *
- Số điện thoại *
- Email
- Chủ đề (Yêu cầu báo giá, Lái thử, Dịch vụ, Khác)
- Tin nhắn *

**Thông tin công ty:**
- Địa chỉ showroom
- Số điện thoại hotline
- Email
- Giờ làm việc
- Bản đồ Google Maps (có thể thêm)

---

## ⚙️ TÍNH NĂNG BACKEND

### 1. DATABASE SQLITE
**Bảng dữ liệu:**

#### `cars` - Thông tin xe
- id, name, slug, tagline
- price, priceRange, image
- featured (0/1)
- category, description
- specs (JSON), features (JSON)
- colors (JSON), versions (JSON)

#### `news` - Tin tức
- id, title, slug, summary
- image, date, category, content

#### `promotions` - Khuyến mãi
- id, title, description, image
- validUntil, highlight (0/1)
- details (JSON)
- applicableCars (JSON)

#### `test_drives` - Đăng ký lái thử
- id, name, phone, email
- car, date, time, note
- created_at (timestamp)

#### `quotes` - Yêu cầu báo giá
- id, name, phone, email
- car, version, color, note
- created_at (timestamp)

#### `contacts` - Liên hệ
- id, name, phone, email
- subject, message
- created_at (timestamp)

### 2. SESSION MANAGEMENT
- Express-session cho admin authentication
- Session timeout: 24 giờ
- Bảo mật với secret key

### 3. API ENDPOINTS

#### Public APIs (Không cần login)
```
POST /api/test-drive        - Đăng ký lái thử
POST /api/quote             - Yêu cầu báo giá
POST /api/contact           - Gửi tin nhắn liên hệ
```

**Response format:**
```json
{
  "success": true,
  "message": "Đăng ký thành công!"
}
```

### 4. AUTO-RELOAD
- Sử dụng Nodemon
- Tự động reload khi thay đổi code
- Theo dõi tất cả file: .js, .json, .ejs

---

## 🔐 TÍNH NĂNG ADMIN PANEL

### 1. ĐĂNG NHẬP ADMIN (`/admin/login`)
**Giao diện:**
- ✨ Design hiện đại với gradient tối
- ✨ Logo icon chữ "T" đẹp mắt
- ✨ Animation fade in khi load
- ✨ Hiệu ứng pulse background
- ✨ Input fields có icon emoji
- ✨ Glass morphism effect

**Chức năng:**
- Form đăng nhập username/password
- Session-based authentication
- Redirect sau khi login thành công
- Hiển thị lỗi khi sai thông tin

### 2. DASHBOARD (`/admin`)
**Thống kê tổng quan:**
- 📊 Tổng số xe
- 📊 Xe nổi bật
- 📊 Tin tức
- 📊 Khuyến mãi
- 📊 Đăng ký lái thử
- 📊 Yêu cầu báo giá
- 📊 Tin nhắn liên hệ

**Menu navigation:**
- Dashboard
- Quản lý xe
- Quản lý tin tức
- Quản lý khuyến mãi
- Đăng ký lái thử
- Yêu cầu báo giá
- Tin nhắn liên hệ
- Đăng xuất

### 3. QUẢN LÝ XE (`/admin/cars`)
**Danh sách xe:**
- Hiển thị table với: ID, Ảnh, Tên, Danh mục, Giá, Trạng thái nổi bật
- Badge "Nổi bật" hoặc "Thường"
- Nút "Sửa" cho từng xe

**Sửa xe (`/admin/cars/edit/:id`):**
- Form chỉnh sửa thông tin:
  - Tên xe *
  - Slug (URL) *
  - Tagline
  - Giá
  - Khoảng giá
  - Danh mục (Sedan/SUV/MPV/Bán tải)
  - Đường dẫn ảnh (preview realtime)
  - Mô tả
  - ☑️ Checkbox: Đánh dấu nổi bật
- Nút "Lưu" và "Hủy"
- Preview ảnh khi thay đổi URL

### 4. QUẢN LÝ TIN TỨC (`/admin/news`)
- Danh sách tất cả tin tức
- Hiển thị: ID, Tiêu đề, Danh mục, Ngày
- Badge màu theo category

### 5. QUẢN LÝ KHUYẾN MÃI (`/admin/promotions`)
- Danh sách khuyến mãi
- Hiển thị: ID, Tiêu đề, Hạn sử dụng, Trạng thái nổi bật
- Badge "Nổi bật"/"Thường"

### 6. ĐĂNG KÝ LÁI THỬ (`/admin/test-drives`)
**Danh sách đăng ký:**
- Bảng hiển thị đầy đủ thông tin
- Cột: ID, Tên, SĐT, Email, Xe, Ngày, Giờ, Ghi chú, Thời gian
- Sắp xếp theo thời gian mới nhất

### 7. YÊU CẦU BÁO GIÁ (`/admin/quotes`)
**Danh sách yêu cầu:**
- Bảng hiển thị: ID, Tên, SĐT, Email, Xe, Phiên bản, Màu, Ghi chú, Thời gian
- Sắp xếp theo thời gian mới nhất

### 8. QUẢN LÝ LIÊN HỆ (`/admin/contacts`)
**Tính năng nâng cao:**

**A. Danh sách tin nhắn:**
- 📊 Hiển thị tổng số liên hệ
- 🔍 Tìm kiếm theo: tên, SĐT, email, nội dung
- 📋 Bảng hiển thị: ID, Tên, SĐT, Email, Chủ đề, Preview tin nhắn, Thời gian
- 🏷️ Badge "Mới" cho tin chưa xem (có thể thêm)
- 🔗 Link click-to-call trên số điện thoại
- 📧 Link click-to-email
- 👁 Nút "Xem chi tiết"
- 🗑 Nút "Xóa" (có confirm)

**B. Tìm kiếm (`/admin/contacts/search`):**
- Form search với input lớn
- Search trong: name, phone, email, message
- Hiển thị số kết quả
- Nút "Xóa bộ lọc" để reset

**C. Chi tiết tin nhắn (`/admin/contacts/view/:id`):**
- Hiển thị đầy đủ thông tin khách hàng
- ID, Tên, SĐT, Email, Chủ đề
- Thời gian gửi (format đẹp tiếng Việt)
- Nội dung tin nhắn đầy đủ
- Actions buttons:
  - ⬅️ Quay lại danh sách
  - 📞 Gọi điện (tel: link)
  - ✉️ Gửi email (mailto: link)
  - 🗑️ Xóa tin nhắn
- Badge "Khách hàng mới"

**D. Xóa tin nhắn (`POST /admin/contacts/delete/:id`):**
- Confirm dialog trước khi xóa
- Redirect về danh sách sau khi xóa

### 9. MIDDLEWARE BẢO MẬT
```javascript
requireAuth(req, res, next)
```
- Kiểm tra session admin
- Redirect về /admin/login nếu chưa login
- Bảo vệ tất cả routes admin

---

## 🗄️ DATABASE SCHEMA

### Cấu trúc SQLite Database (`toyota.db`)

```sql
-- Bảng cars
CREATE TABLE cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  price TEXT,
  priceRange TEXT,
  image TEXT,
  featured INTEGER DEFAULT 0,
  category TEXT,
  description TEXT,
  specs TEXT,      -- JSON string
  features TEXT,   -- JSON string
  colors TEXT,     -- JSON string
  versions TEXT    -- JSON string
);

-- Bảng news
CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  image TEXT,
  date TEXT,
  category TEXT,
  content TEXT
);

-- Bảng promotions
CREATE TABLE promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  validUntil TEXT,
  highlight INTEGER DEFAULT 0,
  details TEXT,        -- JSON string
  applicableCars TEXT  -- JSON string
);

-- Bảng test_drives
CREATE TABLE test_drives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  car TEXT,
  date TEXT,
  time TEXT,
  note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quotes
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  car TEXT,
  version TEXT,
  color TEXT,
  note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Bảng contacts
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Database Functions

**Module: `database.js`**

```javascript
// Cars
getAllCars()                    // Lấy tất cả xe
getCarById(id)                  // Lấy xe theo ID
getCarBySlug(slug)              // Lấy xe theo slug
getFeaturedCars()               // Lấy xe nổi bật
updateCar(carData)              // Cập nhật thông tin xe

// News
getAllNews()                    // Lấy tất cả tin tức
getNewsById(id)                 // Lấy tin theo ID
getLatestNews(limit)            // Lấy tin mới nhất

// Promotions
getAllPromotions()              // Lấy tất cả khuyến mãi
getActivePromotions(limit)      // Lấy khuyến mãi đang chạy

// Test Drives
createTestDrive(data)           // Tạo đăng ký lái thử
getAllTestDrives()              // Lấy tất cả đăng ký

// Quotes
createQuote(data)               // Tạo yêu cầu báo giá
getAllQuotes()                  // Lấy tất cả yêu cầu

// Contacts
createContact(data)             // Tạo tin nhắn liên hệ
getAllContacts()                // Lấy tất cả tin nhắn
getContactById(id)              // Lấy tin nhắn theo ID
deleteContact(id)               // Xóa tin nhắn
searchContacts(keyword)         // Tìm kiếm tin nhắn
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

**Packages được cài:**
- express
- ejs
- better-sqlite3
- express-session
- nodemon (devDependencies)

### Bước 2: Khởi tạo Database
```bash
npm run init-db
```

**Script sẽ:**
- Tạo file `toyota.db`
- Tạo các bảng
- Import dữ liệu từ JSON files:
  - cars.json → cars table
  - news.json → news table
  - promotions.json → promotions table

### Bước 3: Chạy Development Server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

**Nodemon sẽ tự động reload khi:**
- Thay đổi file .js
- Thay đổi file .ejs
- Thay đổi file .json

### Bước 4: Chạy Production Server
```bash
npm start
```

---

## 🔌 API ENDPOINTS

### PUBLIC ROUTES (Không cần authentication)

#### Website Routes
```
GET  /                          - Trang chủ
GET  /san-pham                  - Danh sách sản phẩm
GET  /san-pham/:slug            - Chi tiết sản phẩm
GET  /tin-tuc                   - Danh sách tin tức
GET  /tin-tuc/:id               - Chi tiết tin tức
GET  /khuyen-mai                - Danh sách khuyến mãi
GET  /dang-ky-lai-thu           - Form đăng ký lái thử
GET  /tra-gop                   - Trang trả góp
GET  /lien-he                   - Trang liên hệ
```

#### Form Submission APIs
```
POST /api/test-drive            - Submit đăng ký lái thử
POST /api/quote                 - Submit yêu cầu báo giá
POST /api/contact               - Submit form liên hệ
```

**Request Body Example (test-drive):**
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0987654321",
  "email": "email@example.com",
  "car": "Toyota Camry",
  "date": "2024-03-15",
  "time": "10:00",
  "note": "Muốn lái thử phiên bản 2.5Q"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Đăng ký lái thử thành công! Chúng tôi sẽ liên hệ với bạn sớm."
}
```

### ADMIN ROUTES (Cần authentication)

#### Authentication
```
GET  /admin/login               - Trang đăng nhập
POST /admin/login               - Xử lý đăng nhập
GET  /admin/logout              - Đăng xuất
```

#### Dashboard & Management
```
GET  /admin                     - Dashboard chính
GET  /admin/cars                - Quản lý xe
GET  /admin/cars/edit/:id       - Sửa xe
POST /admin/cars/update/:id     - Cập nhật xe
GET  /admin/news                - Quản lý tin tức
GET  /admin/promotions          - Quản lý khuyến mãi
GET  /admin/test-drives         - Xem đăng ký lái thử
GET  /admin/quotes              - Xem yêu cầu báo giá
GET  /admin/contacts            - Quản lý liên hệ
GET  /admin/contacts/search     - Tìm kiếm liên hệ
GET  /admin/contacts/view/:id   - Chi tiết liên hệ
POST /admin/contacts/delete/:id - Xóa tin nhắn
```

---

## 👤 TÀI KHOẢN MẶC ĐỊNH

### Admin Account
```
Username: admin
Password: admin
```

**⚠️ LƯU Ý BẢO MẬT:**
- Đổi mật khẩu mặc định ngay sau khi deploy
- Sử dụng biến môi trường để lưu credentials
- Không commit credentials vào Git

---

## 📁 CẤU TRÚC THƯ MỤC

```
D:\oto\
├── node_modules/           # Dependencies
├── views/                  # EJS templates
│   ├── index.ejs          # Trang chủ
│   ├── products.ejs       # Danh sách sản phẩm
│   ├── product-detail.ejs # Chi tiết sản phẩm
│   ├── news.ejs           # Danh sách tin tức
│   ├── news-detail.ejs    # Chi tiết tin tức
│   ├── promotions.ejs     # Khuyến mãi
│   ├── test-drive.ejs     # Đăng ký lái thử
│   ├── installment.ejs    # Trả góp
│   ├── contact.ejs        # Liên hệ
│   ├── admin-login.ejs    # Login admin
│   ├── admin-dashboard.ejs # Dashboard admin
│   ├── admin-cars.ejs     # Quản lý xe
│   ├── admin-car-edit.ejs # Sửa xe
│   ├── admin-news.ejs     # Quản lý tin tức
│   ├── admin-promotions.ejs # Quản lý KM
│   ├── admin-test-drives.ejs # Quản lý lái thử
│   ├── admin-quotes.ejs   # Quản lý báo giá
│   ├── admin-contacts.ejs # Quản lý liên hệ
│   └── admin-contact-detail.ejs # Chi tiết liên hệ
├── images/                 # Hình ảnh
│   ├── banner-1.jpg
│   ├── vios.jpg
│   ├── camry.jpg
│   └── ...
├── public/                 # Static files (nếu có)
├── cars.json              # Dữ liệu xe
├── news.json              # Dữ liệu tin tức
├── promotions.json        # Dữ liệu khuyến mãi
├── database.js            # Database module
├── init-db.js             # Script khởi tạo DB
├── server.js              # Main server file
├── package.json           # NPM config
├── package-lock.json      # NPM lock
├── toyota.db              # SQLite database
├── .gitignore             # Git ignore
└── README.md              # Documentation
```

---

## 🎨 GIAO DIỆN & UX

### Design System

**Màu sắc chính:**
- Primary Red: `#eb0a1e` (Toyota Red)
- Dark Red: `#c41230`
- Dark Gray: `#1a1a1a`, `#2d2d2d`
- Success Green: `#10b981` (bg-green-500)
- Text Dark: `#333`
- Text Light: `#666`, `#999`

**Typography:**
- Font family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Font sizes: 13px - 36px
- Font weights: 400, 500, 600, 700, 900

**Components:**
- Border radius: 5px, 8px, 12px, 20px
- Shadows: `0 2px 5px`, `0 10px 30px`, `0 20px 60px`
- Transitions: `0.3s ease`, `0.5s ease-out`

### Animations

**Notification:**
- Fade in/out animation
- Slide up from bottom
- Duration: 500ms
- Auto-dismiss: 5 seconds

**Admin Login:**
- Fade in up: 0.6s
- Pulse background: 8s infinite
- Shake on error: 0.5s

**Buttons:**
- Hover lift: translateY(-2px)
- Active press: translateY(0)
- Shadow expansion on hover

---

## 🔧 CONFIGURATION

### Server Configuration (`server.js`)
```javascript
const PORT = process.env.PORT || 3000;

// Session config
{
  secret: 'toyota-admin-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}
```

### NPM Scripts (`package.json`)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node init-db.js"
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp

**1. Database not found**
```
Error: SQLITE_CANTOPEN: unable to open database file
```
**Giải pháp:** Chạy `npm run init-db`

**2. Module not found**
```
Error: Cannot find module 'express'
```
**Giải pháp:** Chạy `npm install`

**3. Port already in use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Giải pháp:** 
- Đổi PORT trong server.js
- Hoặc kill process đang dùng port 3000

**4. Session not persisting**
- Kiểm tra cookie settings
- Clear browser cookies
- Restart server

---

## 📝 NOTES

### Tính năng có thể mở rộng

**Frontend:**
- [ ] Thêm chức năng so sánh xe
- [ ] Wishlist/Yêu thích
- [ ] Chatbot hỗ trợ
- [ ] Calculator chi phí tổng (xe + phí đăng ký + bảo hiểm)
- [ ] 360° view xe
- [ ] Video reviews

**Admin:**
- [ ] CRUD đầy đủ cho News
- [ ] CRUD đầy đủ cho Promotions  
- [ ] Upload ảnh trực tiếp
- [ ] Rich text editor cho nội dung
- [ ] Export data ra Excel/CSV
- [ ] Dashboard charts/graphs
- [ ] Email notifications
- [ ] Multiple admin roles (Admin, Manager, Staff)

**Backend:**
- [ ] API documentation (Swagger)
- [ ] Rate limiting
- [ ] Input validation & sanitization
- [ ] Logging system
- [ ] Backup automation
- [ ] Image optimization
- [ ] Caching layer (Redis)

**Security:**
- [ ] Password hashing (bcrypt)
- [ ] CSRF protection
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] Environment variables (.env)
- [ ] HTTPS/SSL
- [ ] IP rate limiting

---

## 📞 SUPPORT

**Developer:** Toyota Development Team  
**Version:** 1.0.0  
**Last Updated:** 04/03/2026

---

## 📄 LICENSE

Copyright © 2024 Toyota. All rights reserved.

---

**🎉 HOÀN THÀNH TÀI LIỆU TỔNG HỢP!**

Tài liệu này bao gồm toàn bộ tính năng hiện có của hệ thống Website Toyota. 
Cập nhật thường xuyên khi có thay đổi hoặc bổ sung tính năng mới.
