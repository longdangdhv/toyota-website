# Hướng dẫn Deploy lên Vercel

## Vấn đề

`better-sqlite3` không hoạt động trên Vercel vì:
- Vercel là serverless environment
- `better-sqlite3` cần compile native code
- SQLite không persistent trên serverless

## Giải pháp

Đã tạo 2 database modules:
1. **database.js** - SQLite cho local development
2. **database-vercel.js** - In-memory cho Vercel

Server tự động chọn module phù hợp:
```javascript
const isVercel = process.env.VERCEL === '1';
const db = isVercel ? require('./database-vercel') : require('./database');
```

## Lưu ý khi deploy Vercel

### ⚠️ Hạn chế
- Dữ liệu form (test-drive, quotes, contacts) chỉ lưu trong memory
- Khi restart server, dữ liệu sẽ mất
- Phù hợp cho demo/testing

### ✅ Tính năng vẫn hoạt động
- Hiển thị sản phẩm (từ cars.json)
- Hiển thị tin tức (từ news.json)
- Hiển thị khuyến mãi (từ promotions.json)
- Admin login
- Submit form (lưu tạm trong memory)
- Xem dữ liệu trong session

## Cách Deploy

### 1. Cài đặt Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Environment Variables (Nếu cần)
Thêm trong Vercel Dashboard:
```
VERCEL=1
```

## Giải pháp Production đầy đủ

Nếu cần lưu trữ dữ liệu persistent trên Vercel:

### Option 1: Vercel Postgres
```bash
npm install @vercel/postgres
```

### Option 2: MongoDB Atlas
```bash
npm install mongodb
```

### Option 3: Supabase (PostgreSQL)
```bash
npm install @supabase/supabase-js
```

### Option 4: PlanetScale (MySQL)
```bash
npm install @planetscale/database
```

## Khuyến nghị

**Cho Production:**
- Sử dụng Vercel Postgres hoặc MongoDB Atlas
- Setup proper environment variables
- Add data validation & error handling

**Cho Development:**
- Giữ nguyên SQLite (database.js)
- Chạy local với `npm run dev`

## File cần thiết trên Vercel

✅ Đã có sẵn:
- `vercel.json` - Config routing
- `database-vercel.js` - Database module cho Vercel
- `server.js` - Đã update để tự động chọn DB

## Test local trước khi deploy

```bash
# Set environment variable
set VERCEL=1

# Hoặc trên Linux/Mac
export VERCEL=1

# Chạy server
npm start
```

## Troubleshooting

**Lỗi: Module not found**
→ Chạy `npm install`

**Lỗi: Routes không hoạt động**
→ Kiểm tra `vercel.json`

**Dữ liệu bị mất**
→ Normal với in-memory storage, cần database thật

## Contact

Nếu cần setup database production, liên hệ team dev.
