# 🚀 Deploy lên Vercel với PostgreSQL

## Tại sao Vercel + Vercel Postgres?

✅ **Miễn phí** - Free tier rộng rãi  
✅ **Tự động** - Auto-inject DATABASE_URL  
✅ **Nhanh** - Edge network global  
✅ **Dễ dàng** - 3 commands là xong  

---

## 📋 Prerequisites

- [x] Code đã migrate sang PostgreSQL
- [x] Test kỹ trên local (`npm start`)
- [x] Có tài khoản Vercel (free)
- [x] Đã cài Vercel CLI: `npm i -g vercel`

---

## 🎯 Deployment Steps

### Bước 1: Tạo Vercel Postgres Database

1. Vào [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Storage** (menu bên trái)
3. Click **Create Database**
4. Chọn **Postgres**
5. Chọn region gần nhất (Singapore cho VN)
6. Nhập tên: `toyota-db`
7. Click **Create**

**📸 Screenshot:**
```
┌─────────────────────────────────────┐
│  Create Postgres Database           │
├─────────────────────────────────────┤
│  Name: toyota-db                    │
│  Region: Singapore (sin1)           │
│  Plan: Hobby (Free)                 │
│                                     │
│  [Create Database]                  │
└─────────────────────────────────────┘
```

### Bước 2: Link Project với Database

#### Option A: Web UI (Dễ nhất)

1. Vào project settings
2. Storage tab
3. Click **Connect** bên cạnh `toyota-db`
4. Chọn environment: **Production**, **Preview**, **Development**
5. Click **Connect**

#### Option B: CLI

```bash
# Link project
vercel link

# Pull environment variables
vercel env pull .env.local
```

### Bước 3: Chạy Migration trên Vercel

#### Option A: Local với Production Database

```bash
# Pull production DATABASE_URL
vercel env pull .env.local

# Run migration với production DB
npm run migrate
```

#### Option B: Vercel CLI

```bash
# Deploy migration script
vercel deploy migrate-to-postgresql.js --prod

# Hoặc tạo một-off function
```

#### Option C: Manual (pgAdmin/DBeaver)

1. Copy connection string từ Vercel Dashboard
2. Kết nối bằng SQL client
3. Chạy script migration thủ công

### Bước 4: Cấu hình vercel.json

Tạo/cập nhật `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/images/$1"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Bước 5: Deploy!

```bash
# Development preview
vercel

# Production
vercel --prod
```

---

## 🔧 Environment Variables

Vercel tự động inject khi link database:

```env
# Vercel tự động thêm:
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# App sử dụng:
DATABASE_URL=${POSTGRES_URL}
```

**Trong code (database-postgresql.js):**
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});
```

---

## 📊 Vercel Postgres Free Tier Limits

```
┌─────────────────────────┬──────────────┐
│        Resource         │    Limit     │
├─────────────────────────┼──────────────┤
│ Storage                 │   256 MB     │
│ Compute Time            │  60 hours/mo │
│ Written Data            │   256 MB/mo  │
│ Data Transfer           │    1 GB/mo   │
│ Total Rows              │   ~10,000    │
└─────────────────────────┴──────────────┘

Đủ cho:
✅ ~100 cars
✅ ~1000 form submissions/month
✅ ~5000 page views/month
✅ Small-medium traffic website
```

**Upgrade ($20/month):**
- Storage: 512 MB
- Compute: 100 hours
- Unlimited reads

---

## 🧪 Testing Deployment

### 1. Kiểm tra Database Connection

```bash
# Trong Vercel dashboard
vercel logs --prod

# Tìm dòng:
# ✅ Connected to PostgreSQL
```

### 2. Test Routes

```bash
# Homepage
curl https://your-app.vercel.app/

# API
curl -X POST https://your-app.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'
```

### 3. Test Admin

1. Mở `https://your-app.vercel.app/admin`
2. Login: `admin` / `admin`
3. Thêm một xe test
4. Kiểm tra hiển thị trên homepage

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module 'pg'"

**Solution:**
```bash
# Đảm bảo pg trong dependencies (không phải devDependencies)
npm install pg --save

# Commit và deploy lại
git add package.json package-lock.json
git commit -m "Add pg to dependencies"
vercel --prod
```

### Issue 2: "Connection refused"

**Solution:**
```bash
# Kiểm tra env variables
vercel env ls

# Pull lại
vercel env pull .env.local

# Kiểm tra trong Vercel dashboard:
# Project > Settings > Environment Variables
```

### Issue 3: "SSL required"

**Solution:**
```javascript
// Trong database-postgresql.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});
```

### Issue 4: "Migration not run"

**Solution:**
```bash
# Run migration manually với production DB
vercel env pull .env.local
npm run migrate

# Hoặc connect trực tiếp và run SQL
# Lấy connection string từ Vercel dashboard
psql "postgres://..."
\i migration.sql
```

### Issue 5: Images not showing

**Solution:**
```json
// vercel.json
{
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/images/$1"
    }
  ]
}
```

---

## 📈 Monitoring

### Vercel Dashboard

1. **Deployments** - Xem lịch sử deploy
2. **Analytics** - Traffic, performance
3. **Logs** - Real-time logs
4. **Storage** - Database usage

### Database Monitoring

```sql
-- Trong Vercel Postgres dashboard
-- Xem storage usage
SELECT pg_size_pretty(pg_database_size('verceldb'));

-- Xem row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup as rows
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

---

## 🔄 CI/CD Setup

### Option 1: Vercel Git Integration (Auto)

1. Kết nối repo với Vercel
2. Mỗi push → Auto deploy preview
3. Merge to main → Auto deploy production

```bash
# .github/workflows không cần
# Vercel tự động handle
```

### Option 2: Manual CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 💾 Backup Strategy

### Option 1: Vercel Built-in

Vercel Postgres có auto-backup:
- Daily snapshots (7 days retention)
- Point-in-time recovery (24h)

### Option 2: Manual Backup

```bash
# Lấy connection string
vercel env pull .env.local

# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Schedule với cron:
0 2 * * * pg_dump $DATABASE_URL > /backups/toyota-$(date +\%Y\%m\%d).sql
```

### Option 3: Automated Script

```javascript
// scripts/backup.js
const { exec } = require('child_process');
const db_url = process.env.DATABASE_URL;
const date = new Date().toISOString().split('T')[0];

exec(`pg_dump ${db_url} > backup-${date}.sql`, (err, stdout, stderr) => {
  if (err) {
    console.error('Backup failed:', err);
    return;
  }
  console.log('Backup successful:', `backup-${date}.sql`);
});
```

---

## 🎯 Best Practices

### 1. Environment Variables
```bash
# Không commit .env
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Dùng Vercel env
vercel env add DATABASE_URL production
```

### 2. Connection Pooling
```javascript
// Dùng connection pool
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,               // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 3. Error Handling
```javascript
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // Alert monitoring service
});
```

### 4. Query Optimization
```sql
-- Add indexes
CREATE INDEX idx_cars_slug ON cars(slug);
CREATE INDEX idx_cars_featured ON cars(featured);
CREATE INDEX idx_contacts_created ON contacts(created_at);
```

---

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Code tested locally
- [ ] Migration successful locally
- [ ] All routes working
- [ ] Admin panel tested
- [ ] Forms submitting correctly
- [ ] Images uploading OK
- [ ] Environment variables set

### Deployment
- [ ] Vercel Postgres created
- [ ] Database linked to project
- [ ] Migration run on production DB
- [ ] vercel.json configured
- [ ] Deploy successful
- [ ] No errors in logs

### Post-deployment
- [ ] Website accessible
- [ ] Homepage loads
- [ ] Products display
- [ ] Admin login works
- [ ] Can add/edit cars
- [ ] Forms save to database
- [ ] Images display correctly

### Monitoring
- [ ] Analytics set up
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Performance acceptable

---

## 🎉 Done!

Your Toyota website is now live on Vercel with PostgreSQL!

**Check:**
- Website: `https://your-app.vercel.app`
- Admin: `https://your-app.vercel.app/admin`
- Database: Vercel Dashboard > Storage

**Next steps:**
- Add custom domain
- Enable analytics
- Set up monitoring
- Schedule backups

---

**Need help?**
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Support](https://vercel.com/support)
