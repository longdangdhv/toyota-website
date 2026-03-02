# ⚠️ FIX LỖI VERCEL: "Failed to lookup view"

## LỖI: 
```
Failed to lookup view "index" in views directory "/var/task"
```

## NGUYÊN NHÂN:
Vercel deploy theo cấu trúc khác với localhost. File EJS phải ở đúng vị trí.

## ✅ GIẢI PHÁP:

### Bước 1: Tạo thư mục views
```bash
mkdir views
```

### Bước 2: Di chuyển tất cả file .ejs vào thư mục views
```bash
move *.ejs views\
```

Sau khi di chuyển, cấu trúc sẽ là:
```
D:\oto\
├── views\
│   ├── index.ejs
│   ├── products.ejs
│   ├── product-detail.ejs
│   ├── test-drive.ejs
│   ├── installment.ejs
│   ├── news.ejs
│   ├── news-detail.ejs
│   ├── promotions.ejs
│   └── contact.ejs
├── images\
├── public\
├── server.js
├── package.json
└── vercel.json
```

### Bước 3: Sửa server.js
Dòng này đã đúng rồi:
```javascript
app.set('views', path.join(__dirname));
```

Đổi thành:
```javascript
app.set('views', path.join(__dirname, 'views'));
```

### Bước 4: Push lại lên GitHub
```bash
git add .
git commit -m "Fix: Move EJS files to views folder"
git push
```

### Bước 5: Vercel tự động deploy lại
Đợi 1-2 phút, website sẽ hoạt động!

---

## 🔧 HOẶC FIX NHANH HƠN:

Chạy lệnh này trong terminal:

```bash
# Tạo thư mục views
mkdir views

# Di chuyển tất cả file .ejs
move index.ejs views\
move products.ejs views\
move product-detail.ejs views\
move test-drive.ejs views\
move installment.ejs views\
move news.ejs views\
move news-detail.ejs views\
move promotions.ejs views\
move contact.ejs views\
```

Sau đó push lại:
```bash
git add .
git commit -m "Fix views folder structure"
git push
```

---

## ✅ KIỂM TRA:

Sau khi deploy xong, test:
- https://toyota-website-ivory.vercel.app/
- https://toyota-website-ivory.vercel.app/san-pham
- https://toyota-website-ivory.vercel.app/tin-tuc

Tất cả trang phải load được!
