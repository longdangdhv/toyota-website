# 🚀 Hướng dẫn nhanh: Migration sang PostgreSQL

## Tại sao PostgreSQL?
✅ **Không mất dữ liệu** khi deploy (không như file JSON)  
✅ **Performance cao** - Query nhanh, có index  
✅ **Dễ scale** - Vercel Postgres, Railway, Render  
✅ **Miễn phí** - Open source hoàn toàn  

---

## 🎯 Các bước thực hiện

### 1️⃣ Cài PostgreSQL Local

**Cách 1: Download trực tiếp**
```
https://www.postgresql.org/download/
```

**Cách 2: Docker (Khuyên dùng)**
```bash
docker run --name toyota-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

**Cách 3: Dùng Cloud Free Tier**
- Vercel Postgres (Free)
- Supabase (Free)
- Railway (Free $5/month)

### 2️⃣ Tạo Database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE toyota;
\q
```

**Hoặc dùng GUI:** pgAdmin, DBeaver, TablePlus

### 3️⃣ Cài dependencies

```bash
npm install
```

### 4️⃣ Chạy Migration

```bash
npm run migrate
```

Kết quả sẽ hiển thị:
```
🚀 Starting migration to PostgreSQL...
✅ Tables created
✅ Migrated X cars
✅ Migrated X news
✅ Migrated X promotions
✅ Migration completed successfully!
```

### 5️⃣ Test ứng dụng

```bash
npm start
```

Mở: `http://localhost:3000`

Kiểm tra:
- ✅ Trang chủ hiển thị xe
- ✅ Admin có thể thêm/sửa xe
- ✅ Form liên hệ hoạt động
- ✅ Dữ liệu được lưu vào PostgreSQL

---

## 📦 Deploy lên Production

### Option 1: Vercel + Vercel Postgres (Miễn phí)

```bash
# 1. Tạo Postgres DB trên Vercel Dashboard
vercel.com/dashboard > Storage > Create Database

# 2. Link project
vercel link

# 3. Pull env variables
vercel env pull

# 4. Deploy
vercel --prod
```

### Option 2: Railway

```bash
# 1. railway.app > New Project > Add PostgreSQL
# 2. Copy DATABASE_URL
# 3. Deploy
```

### Option 3: Render

```bash
# 1. render.com > New PostgreSQL
# 2. Copy Internal Database URL
# 3. Add to Web Service environment
```

---

## 🔧 Configuration

### Development (.env.local)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/toyota
```

### Production
```env
DATABASE_URL=postgres://username:password@host:5432/database?sslmode=require
```

**⚠️ Lưu ý:** Vercel tự động inject `DATABASE_URL` khi bạn link Postgres.

---

## 🧹 Cleanup (Sau khi test kỹ)

Xóa các file cũ không cần thiết:

```bash
cleanup-old-db.bat
```

Hoặc thủ công:
```bash
del toyota.db
del *.json
del database-file.js database-mongodb.js
```

---

## 🐛 Troubleshooting

### Lỗi: "connection refused"
```bash
# Kiểm tra PostgreSQL đang chạy
docker ps
# Hoặc
pg_isready
```

### Lỗi: "password authentication failed"
```bash
# Reset password
psql -U postgres
ALTER USER postgres PASSWORD 'postgres';
```

### Lỗi: "database does not exist"
```bash
createdb toyota
```

### Xem dữ liệu trong DB
```sql
psql -U postgres -d toyota

\dt                    -- List tables
SELECT * FROM cars;    -- View data
\q                     -- Quit
```

---

## ✅ Checklist hoàn tất

- [ ] PostgreSQL đã cài đặt và chạy
- [ ] Database `toyota` đã tạo
- [ ] `npm install` thành công
- [ ] `npm run migrate` chạy không lỗi
- [ ] `npm start` và test website OK
- [ ] Deploy production thành công
- [ ] Cleanup các file cũ

---

## 📚 Tài liệu chi tiết

Xem thêm: [MIGRATION-POSTGRESQL.md](MIGRATION-POSTGRESQL.md)

## 🆘 Cần trợ giúp?

1. Kiểm tra logs: `npm start` (xem console errors)
2. Kiểm tra database: `psql -U postgres -d toyota`
3. Xem file migration: `migrate-to-postgresql.js`
