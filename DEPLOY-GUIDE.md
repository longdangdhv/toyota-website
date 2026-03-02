# 🚀 HƯỚNG DẪN DEPLOY WEBSITE LÊN INTERNET

## 📋 CÁC LỰA CHỌN DEPLOY (Miễn Phí & Trả Phí)

---

## ✅ OPTION 1: VERCEL (Miễn Phí - Khuyến Nghị)

**Ưu điểm**: 
- ✅ Miễn phí 100%
- ✅ Deploy tự động từ GitHub
- ✅ HTTPS miễn phí
- ✅ Tên miền tùy chỉnh
- ✅ Hỗ trợ Node.js/Express

### Bước 1: Chuẩn bị
```bash
# Cài Git (nếu chưa có)
# Tạo file vercel.json
```

Tạo file `vercel.json`:
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
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Bước 2: Push lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/longdangdhv/toyota-website.git
git push -u origin master
```

### Bước 3: Deploy Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Chọn repository `toyota-website`
5. Click **"Deploy"**
6. Đợi 2-3 phút → Website live!

**URL**: `https://toyota-website.vercel.app`

---

## ✅ OPTION 2: RENDER (Miễn Phí)

**Ưu điểm**:
- ✅ Miễn phí
- ✅ Hỗ trợ Node.js tốt
- ✅ HTTPS tự động
- ✅ Deploy từ GitHub

### Bước 1: Push code lên GitHub (giống Vercel)

### Bước 2: Deploy Render
1. Truy cập: https://render.com
2. Đăng nhập GitHub
3. Click **"New +"** → **"Web Service"**
4. Chọn repository
5. Cấu hình:
   - **Name**: toyota-website
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **"Create Web Service"**

**URL**: `https://toyota-website.onrender.com`

⚠️ **Lưu ý**: Free tier ngủ sau 15 phút không dùng, lần đầu truy cập sẽ chậm ~30s.

---

## ✅ OPTION 3: RAILWAY (Miễn Phí $5 Credit)

**Ưu điểm**:
- ✅ $5 credit miễn phí/tháng
- ✅ Không bị ngủ như Render
- ✅ Deploy cực nhanh

### Bước 1: Push lên GitHub

### Bước 2: Deploy Railway
1. Truy cập: https://railway.app
2. Đăng nhập GitHub
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Chọn repository → Deploy tự động

**URL**: `https://toyota-website.up.railway.app`

---

## ✅ OPTION 4: VPS/HOSTING TRUYỀN THỐNG (Trả Phí)

### Nhà cung cấp Việt Nam:
- **AZDIGI**: ~50k/tháng - https://azdigi.com
- **MONA HOST**: ~40k/tháng - https://monamedia.net
- **INET**: ~100k/tháng - https://inet.vn

### Bước Deploy trên VPS:

#### 1. Kết nối VPS qua SSH
```bash
ssh root@your-server-ip
```

#### 2. Cài đặt Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. Upload code
```bash
# Dùng FTP/SFTP upload folder project
# Hoặc dùng Git:
cd /var/www
git clone https://github.com/YOUR_USERNAME/toyota-website.git
cd toyota-website
npm install
```

#### 4. Chạy với PM2
```bash
npm install -g pm2
pm2 start server.js --name toyota-website
pm2 save
pm2 startup
```

#### 5. Setup Nginx
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/toyota
```

Nội dung file:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/toyota /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🌐 MUA TÊN MIỀN

### Nhà cung cấp Việt Nam:
- **PA Vietnam**: .vn ~300k/năm - https://www.pa.vn
- **iNET**: .com.vn ~600k/năm - https://inet.vn
- **MẮTBÃO**: .com ~200k/năm - https://matbao.net

### Cấu hình DNS:
Trỏ domain về server:
- **A Record**: `@` → IP server
- **CNAME**: `www` → `@`

Hoặc với Vercel/Render:
- Thêm custom domain trong dashboard
- Cập nhật DNS theo hướng dẫn

---

## 📊 SO SÁNH CÁC PHƯƠNG ÁN

| Tiêu chí | Vercel | Render | Railway | VPS |
|----------|--------|--------|---------|-----|
| **Giá** | Miễn phí | Miễn phí | $5/tháng | 50k-200k/tháng |
| **Tốc độ** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ | ⚡⚡ (tùy gói) |
| **Dễ dùng** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ (cần kiến thức) |
| **Ngủ** | Không | Có (15 phút) | Không | Không |
| **HTTPS** | Tự động | Tự động | Tự động | Phải setup |
| **Backup** | Tự động | Thủ công | Tự động | Phải setup |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 KHUYẾN NGHỊ

### Cho Người Mới Bắt Đầu:
👉 **VERCEL** - Miễn phí, dễ dùng, nhanh nhất

### Cho Website Chuyên Nghiệp:
👉 **VPS** (AZDIGI/MONA) - Kiểm soát 100%, tốc độ ổn định

### Cho Startup/Testing:
👉 **RAILWAY** - Không bị ngủ, $5 credit đủ dùng

---

## 📝 CHECKLIST TRƯỚC KHI DEPLOY

- [ ] Code chạy ổn trên localhost
- [ ] Đã test tất cả trang
- [ ] Đổi PORT trong `server.js`:
  ```javascript
  const PORT = process.env.PORT || 3000;
  ```
- [ ] Thêm file `.gitignore`:
  ```
  node_modules/
  .env
  *.log
  ```
- [ ] Đã có ảnh banner trong `images/`
- [ ] Update thông tin liên hệ (hotline, email, địa chỉ)
- [ ] Tạo GitHub repository

---

## 🚨 LƯU Ý QUAN TRỌNG

### 1. Thay đổi thông tin:
Sửa trong các file `.ejs`:
- Hotline: `098 888 8888` → số thật
- Email: `info@toyota.vn` → email thật
- Địa chỉ: cập nhật địa chỉ showroom thật

### 2. Bản quyền:
- Không dùng logo Toyota nếu không được phép
- Không copy nội dung từ website khác
- Chỉ dùng ảnh có bản quyền hợp pháp

### 3. Performance:
- Nén ảnh trước khi deploy (TinyPNG.com)
- Ảnh banner nên < 500KB
- Ảnh sản phẩm < 200KB

### 4. SEO:
Thêm meta tags vào `<head>`:
```html
<meta name="description" content="Mô tả website">
<meta name="keywords" content="toyota, xe ô tô, mua xe">
<meta property="og:image" content="/images/banner-1.jpg">
```

---

## 🎉 SAU KHI DEPLOY

### Kiểm tra:
- [ ] Tất cả trang load được
- [ ] Banner slider hoạt động
- [ ] Form submit được
- [ ] Ảnh hiển thị đúng
- [ ] Mobile responsive
- [ ] HTTPS hoạt động

### Share website:
- Gửi link cho khách hàng
- Đăng lên Facebook/Zalo
- Tạo QR code
- Thêm Google Analytics để tracking

---

## 🆘 HỖ TRỢ

Nếu gặp lỗi khi deploy, check:
1. Node.js version: >= 14
2. PORT config: `process.env.PORT || 3000`
3. Đường dẫn file: dùng `__dirname`
4. Dependencies: đầy đủ trong `package.json`

**Log lỗi**: Check console trên Vercel/Render/Railway dashboard
