# Hướng dẫn sử dụng File-based Storage

## Tổng quan

Hệ thống hỗ trợ 3 loại database:

1. **SQLite** - Local development (mặc định)
2. **File JSON** - Testing & Vercel deployment  
3. **MongoDB** - Production với persistent storage

## File Storage - Cách hoạt động

### Dữ liệu được lưu trong:

```
data-test-drives.json  → Đăng ký lái thử
data-quotes.json       → Yêu cầu báo giá
data-contacts.json     → Tin nhắn liên hệ
```

### Ưu điểm:
✅ Persistent - Không mất data khi restart  
✅ Đơn giản - Không cần setup database  
✅ Dễ debug - Xem trực tiếp file JSON  
✅ Deploy Vercel - Hoạt động tốt (read-only trên production)  
✅ Backup dễ - Copy file là xong  

### Nhược điểm:
⚠️ Không scale cho traffic cao  
⚠️ Trên Vercel: Read-only sau deploy (dùng MongoDB thay thế)  
⚠️ Không có transaction support  

## Cách sử dụng

### Option 1: Chạy với File Storage
```bash
# Set environment variable
set USE_FILE_STORAGE=true

# Hoặc Linux/Mac
export USE_FILE_STORAGE=true

# Chạy server
npm run dev
```

### Option 2: Chạy với SQLite (mặc định)
```bash
npm run dev
```

### Option 3: Chạy với MongoDB
```bash
# Tạo file .env
MONGODB_URI=mongodb+srv://...

npm run dev
```

## Cấu trúc Data Files

### data-test-drives.json
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "phone": "0987654321",
    "email": "email@example.com",
    "car": "Toyota Camry",
    "date": "2024-03-15",
    "time": "10:00",
    "note": "Muốn lái thử",
    "created_at": "2024-03-04T15:57:42.439Z"
  }
]
```

### data-quotes.json
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn B",
    "phone": "0987654321",
    "email": "email@example.com",
    "car": "Toyota Vios",
    "version": "1.5G CVT",
    "color": "Trắng",
    "note": "Cần báo giá",
    "created_at": "2024-03-04T15:57:42.439Z"
  }
]
```

### data-contacts.json
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn C",
    "phone": "0987654321",
    "email": "email@example.com",
    "subject": "quote",
    "message": "Tôi muốn hỏi về giá xe",
    "created_at": "2024-03-04T15:57:42.439Z"
  }
]
```

## Deploy lên Vercel

### ⚠️ Lưu ý quan trọng:

Vercel filesystem là **READ-ONLY** sau khi deploy:
- ✅ Đọc file: OK
- ❌ Ghi file: Không hoạt động

**Giải pháp:**
1. Dùng MongoDB Atlas (khuyến nghị)
2. Dùng Vercel Postgres
3. Hoặc dùng in-memory (mất data khi restart)

### Deploy với File Storage (Demo only):
```bash
vercel
```

Data sẽ reset sau mỗi lần deploy.

### Deploy với MongoDB (Production):
```bash
# Thêm env variable
vercel env add MONGODB_URI

# Deploy
vercel --prod
```

## Testing

### Test 1: Tạo dữ liệu mới
1. Chạy server với file storage
2. Đăng ký lái thử qua website
3. Kiểm tra file `data-test-drives.json`
4. Restart server
5. Vào admin panel → Dữ liệu vẫn còn ✅

### Test 2: Xóa dữ liệu
1. Vào admin contacts
2. Xóa 1 contact
3. Kiểm tra file `data-contacts.json`
4. Contact đã bị xóa ✅

### Test 3: Tìm kiếm
1. Tạo nhiều contacts
2. Dùng search box
3. Kết quả lọc đúng ✅

## Backup & Restore

### Backup:
```bash
# Copy files ra folder khác
copy data-*.json backup\
```

### Restore:
```bash
# Copy files backup vào
copy backup\data-*.json .
```

## Khuyến nghị

**Cho Development/Testing:**
✅ Dùng File Storage - Đơn giản, dễ debug

**Cho Production trên Vercel:**
✅ Dùng MongoDB Atlas - Persistent, scalable

**Cho Local Production:**
✅ Dùng SQLite - Nhanh, không cần internet

## Troubleshooting

**Lỗi: Cannot write file**
→ Check quyền write của thư mục
→ Trên Vercel: Chuyển sang MongoDB

**Dữ liệu bị reset**
→ Kiểm tra file có trong .gitignore không
→ Nếu có: Dữ liệu không được commit

**File JSON bị lỗi format**
→ Xóa file và để hệ thống tạo lại
→ Hoặc fix JSON syntax

## So sánh 3 giải pháp

| Feature | SQLite | File JSON | MongoDB |
|---------|--------|-----------|---------|
| Persistent | ✅ | ✅ | ✅ |
| Deploy Vercel | ❌ | ⚠️ Read-only | ✅ |
| Setup | ✅ Easy | ✅ Easy | ⚠️ Medium |
| Performance | ✅ Fast | ⚠️ OK | ✅ Fast |
| Scale | ⚠️ Medium | ❌ Low | ✅ High |
| Cost | ✅ Free | ✅ Free | ✅ Free (512MB) |
| Backup | ⚠️ Medium | ✅ Easy | ✅ Easy |
| Production Ready | ⚠️ | ❌ | ✅ |

---

**✅ FILE STORAGE HOÀN THÀNH - DỄ TEST VÀ PERSISTENT!**
