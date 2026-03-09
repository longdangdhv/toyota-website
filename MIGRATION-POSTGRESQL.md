# Hướng dẫn Migration sang PostgreSQL

## 🐘 Tại sao chọn PostgreSQL?

1. **Hiệu năng tốt** - Phù hợp với website đọc nhiều (read-heavy)
2. **Hỗ trợ JSON native** - Lưu trữ specs, features, colors một cách linh hoạt
3. **Miễn phí & mạnh mẽ** - Open source hoàn toàn
4. **Dễ deploy** - Vercel Postgres, Railway, Supabase đều hỗ trợ tốt
5. **ACID compliance** - Đảm bảo dữ liệu nhất quán

## 📦 Cài đặt

### 1. Cài PostgreSQL (Local Development)

**Windows:**
```bash
# Download từ: https://www.postgresql.org/download/windows/
# Hoặc dùng Chocolatey:
choco install postgresql

# Hoặc dùng Docker:
docker run --name toyota-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. Tạo Database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE toyota;

# Thoát
\q
```

### 3. Cài đặt dependencies

```bash
npm install
```

Package `pg` đã được thêm vào `package.json`.

## 🚀 Chạy Migration

### Bước 1: Cấu hình kết nối

**Local Development:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/toyota
```

**Production (Vercel Postgres):**
```env
DATABASE_URL=postgres://username:password@host:5432/database?sslmode=require
```

### Bước 2: Chạy migration script

```bash
npm run migrate
```

Script sẽ:
- ✅ Tạo tất cả các bảng (cars, news, promotions, test_drives, quotes, contacts)
- ✅ Import dữ liệu từ JSON files
- ✅ Import dữ liệu từ SQLite (nếu có)
- ✅ Cập nhật sequences

### Bước 3: Khởi động server

```bash
npm start
```

Server sẽ tự động sử dụng PostgreSQL database.

## 📊 Cấu trúc Database

### Bảng `cars`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- slug (VARCHAR UNIQUE)
- tagline (TEXT)
- price (VARCHAR)
- price_range (VARCHAR)
- image (TEXT)
- images (JSONB) -- Mảng ảnh
- featured (INTEGER)
- category (VARCHAR)
- description (TEXT)
- specs (JSONB) -- Thông số kỹ thuật
- features (JSONB) -- Tính năng
- colors (JSONB) -- Màu sắc
- versions (JSONB) -- Phiên bản
- created_at (TIMESTAMP)
```

### Bảng `news`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- excerpt (TEXT)
- content (TEXT)
- image (TEXT)
- date (VARCHAR)
- created_at (TIMESTAMP)
```

### Bảng `promotions`
```sql
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- discount (VARCHAR)
- valid_until (VARCHAR)
- image (TEXT)
- created_at (TIMESTAMP)
```

### Bảng `test_drives`, `quotes`, `contacts`
- Lưu trữ form submissions
- Tự động timestamp
- Có index để search nhanh

## 🌐 Deploy lên Production

### Vercel + Vercel Postgres

1. **Tạo Postgres Database trên Vercel:**
   ```bash
   # Vào dashboard.vercel.com
   # Storage > Create Database > Postgres
   ```

2. **Link database với project:**
   ```bash
   vercel link
   vercel env pull .env.local
   ```

3. **Chạy migration trên Vercel:**
   ```bash
   # Thêm vào vercel.json
   {
     "builds": [
       {
         "src": "migrate-to-postgresql.js",
         "use": "@vercel/node"
       }
     ]
   }
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Railway / Render

```bash
# Thêm PostgreSQL addon
# Copy DATABASE_URL vào env variables
# Deploy như bình thường
```

## 🔄 Rollback (Nếu cần)

Các file cũ vẫn được giữ lại để rollback:
- `database-file.js` - File-based database
- `database-mongodb.js` - MongoDB database
- `*.json` files - Dữ liệu gốc

Để rollback, sửa trong `server.js`:
```javascript
// const db = require('./database-postgresql');
const db = require('./database-file'); // hoặc database-mongodb
```

## 🧹 Dọn dẹp sau khi hoàn tất

Sau khi test kỹ và chắc chắn PostgreSQL hoạt động tốt:

```bash
# Xóa các file không cần
del toyota.db
del cars.json news.json promotions.json
del data-*.json
del database-file.js database-mongodb.js
```

## 🔍 Debug & Troubleshooting

### Lỗi kết nối
```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Kiểm tra user và password
psql -U postgres -d toyota
```

### Xem dữ liệu
```sql
-- Kết nối database
psql -U postgres -d toyota

-- Xem tables
\dt

-- Xem data
SELECT * FROM cars LIMIT 5;
SELECT COUNT(*) FROM cars;
```

### Reset database
```sql
DROP DATABASE toyota;
CREATE DATABASE toyota;
-- Chạy lại migration
```

## ✅ Lợi ích sau khi migrate

1. ✅ **Không mất dữ liệu khi deploy** - PostgreSQL persistent
2. ✅ **Query nhanh hơn** - Indexed, optimized
3. ✅ **Scalable** - Dễ scale khi traffic tăng
4. ✅ **Backup dễ dàng** - `pg_dump` / `pg_restore`
5. ✅ **Full-text search** - Tìm kiếm mạnh mẽ
6. ✅ **Transaction support** - Đảm bảo data integrity

## 📞 Hỗ trợ

Nếu gặp vấn đề, check:
- Connection string có đúng không
- PostgreSQL có đang chạy không
- Port 5432 có bị block không
- User/password có đúng không
