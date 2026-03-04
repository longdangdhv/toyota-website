# Setup MongoDB Atlas (FREE) - ĐẢM BẢO DỮ LIỆU PERSISTENT

## Tại sao cần MongoDB?

❌ **In-memory (Vercel):** Data mất khi restart  
✅ **MongoDB Atlas:** Data lưu vĩnh viễn trên cloud

## Bước 1: Tạo MongoDB Atlas FREE

### 1.1 Đăng ký tài khoản
1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký bằng Google/Email
3. Chọn **FREE Tier** (M0 Sandbox)

### 1.2 Tạo Cluster
1. Chọn **Cloud Provider**: AWS
2. Chọn **Region**: Singapore (gần Việt Nam)
3. Cluster Name: `toyota-cluster`
4. Click **Create Cluster** (đợi 3-5 phút)

### 1.3 Tạo Database User
1. Vào **Database Access**
2. Click **Add New Database User**
3. Username: `toyota-admin`
4. Password: `toyota2024` (hoặc tự đặt)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

### 1.4 Whitelist IP Address
1. Vào **Network Access**
2. Click **Add IP Address**
3. Chọn **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 1.5 Lấy Connection String
1. Vào **Database** → Click **Connect**
2. Chọn **Connect your application**
3. Driver: **Node.js** version **5.5 or later**
4. Copy connection string:
```
mongodb+srv://toyota-admin:<password>@toyota-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Thay `<password>` bằng password thực tế

## Bước 2: Setup Local

### 2.1 Cài đặt dependencies
```bash
npm install
```

### 2.2 Tạo file .env
```bash
# Tạo file .env ở root folder
MONGODB_URI=mongodb+srv://toyota-admin:toyota2024@toyota-cluster.xxxxx.mongodb.net/toyota?retryWrites=true&w=majority
```

**⚠️ Lưu ý:** Thay connection string bằng string thực tế của bạn!

### 2.3 Update .gitignore
File `.gitignore` đã có:
```
node_modules/
toyota.db
.env
*.log
```

### 2.4 Test local
```bash
npm run dev
```

Nếu thấy: `✅ Connected to MongoDB` → Thành công!

## Bước 3: Deploy lên Vercel

### 3.1 Cài Vercel CLI
```bash
npm i -g vercel
```

### 3.2 Login Vercel
```bash
vercel login
```

### 3.3 Add Environment Variable
**Option A: Qua CLI**
```bash
vercel env add MONGODB_URI
# Paste connection string khi được hỏi
```

**Option B: Qua Dashboard**
1. Vào https://vercel.com/dashboard
2. Chọn project
3. Settings → Environment Variables
4. Add new:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://toyota-admin:...`
   - Environments: Production, Preview, Development

### 3.4 Deploy
```bash
vercel --prod
```

## Bước 4: Kiểm tra

### Test trên Vercel:
1. Truy cập website Vercel
2. Đăng ký lái thử / Gửi liên hệ
3. Vào admin panel → Xem dữ liệu
4. Restart/Redeploy → Dữ liệu vẫn còn! ✅

## Cấu trúc Database MongoDB

```
toyota (database)
├── test_drives (collection)
│   ├── { name, phone, email, car, date, time, note, created_at }
│   └── ...
├── quotes (collection)
│   ├── { name, phone, email, car, version, color, note, created_at }
│   └── ...
└── contacts (collection)
    ├── { name, phone, email, subject, message, created_at }
    └── ...
```

## So sánh các phương án

| Feature | SQLite Local | In-memory Vercel | MongoDB Atlas |
|---------|--------------|------------------|---------------|
| Persistent | ✅ | ❌ | ✅ |
| Deploy Vercel | ❌ | ✅ | ✅ |
| Free | ✅ | ✅ | ✅ (512MB) |
| Mất data khi restart | ❌ | ✅ | ❌ |
| Production ready | ❌ | ❌ | ✅ |

## Troubleshooting

**Lỗi: MongoServerError: bad auth**
→ Kiểm tra lại username/password

**Lỗi: Connection timeout**
→ Kiểm tra Network Access, cho phép IP 0.0.0.0/0

**Lỗi: MONGODB_URI not defined**
→ Thêm environment variable trên Vercel

**Local không connect được**
→ Kiểm tra file .env có đúng format không

## Giới hạn FREE Tier

MongoDB Atlas FREE:
- Storage: 512 MB
- RAM: Shared
- Network Transfer: Unlimited (trong giới hạn hợp lý)
- Backup: Không có tự động
- Uptime: 99.9%

**Đủ cho:**
- ~50,000 contacts
- ~100,000 test drives
- Website vừa và nhỏ

## Nâng cấp sau này

Khi cần scale lớn:
- Upgrade lên **M2** ($9/month): 2GB storage
- Upgrade lên **M5** ($25/month): 5GB storage, auto backup
- Hoặc chuyển sang Vercel Postgres, Supabase

---

**✅ HOÀN TẤT SETUP MONGODB - DỮ LIỆU AN TOÀN VÀ PERSISTENT!**
