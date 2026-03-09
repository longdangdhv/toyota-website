# 🚀 HƯỚNG DẪN DEPLOY LÊN UBUNTU SERVER 24

## Yêu cầu
- Ubuntu 24 LTS
- Domain đã trỏ về IP server (A record)
- Có quyền sudo

---

## BƯỚC 1: CHUẨN BỊ SOURCE CODE

### Option A: Upload qua SCP/SFTP (khuyến nghị)
Trên máy Windows, chạy lệnh (thay `user@your-server-ip`):

```bash
# Dùng WinSCP hoặc dùng PowerShell/Git Bash:
scp -r D:\oto user@your-server-ip:/tmp/toyota-source
```

Hoặc dùng **FileZilla** / **WinSCP** để upload folder D:\oto lên `/tmp/toyota-source`

### Option B: Git (nếu có repo)
```bash
git init
git add .
git commit -m "initial commit"
# Push lên GitHub/GitLab rồi clone trên server
```

---

## BƯỚC 2: KẾT NỐI VÀO SERVER

```bash
ssh user@your-server-ip
```

---

## BƯỚC 3: CÀI ĐẶT CÁC PHẦN MỀM CẦN THIẾT

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra
node -v   # v20.x.x
npm -v    # 10.x.x

# Cài PM2 (process manager)
sudo npm install -g pm2

# Cài Nginx
sudo apt install -y nginx

# Cài PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Cài Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

---

## BƯỚC 4: TẠO DATABASE POSTGRESQL

```bash
# Đổi sang user postgres
sudo -u postgres psql

# Trong psql, chạy các lệnh sau:
CREATE USER admin WITH PASSWORD 'MatKhauManhCuaBan123!';
CREATE DATABASE toyota OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE toyota TO admin;
\q
```

---

## BƯỚC 5: DEPLOY ỨNG DỤNG

```bash
# Tạo thư mục app
sudo mkdir -p /var/www/toyota-oto
sudo chown -R $USER:$USER /var/www/toyota-oto

# Copy source code (nếu upload qua SCP)
cp -r /tmp/toyota-source/* /var/www/toyota-oto/
cd /var/www/toyota-oto

# Tạo thư mục images
mkdir -p images

# Tạo file .env
nano .env
```

**Nội dung file .env:**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://admin:MatKhauManhCuaBan123!@localhost:5432/toyota
SESSION_SECRET=TaoMotChuoiNgauNhienDaiO_Day_Nhe_2024_XYZ
```

```bash
# Lưu file: Ctrl+O, Enter, Ctrl+X

# Cài packages
npm install --production

# Khởi tạo database tables
node init-db.js

# Test chạy thử
node server.js
# Nếu thấy "Server running on port 3000" => OK
# Ctrl+C để tắt
```

---

## BƯỚC 6: CẤU HÌNH PM2

```bash
cd /var/www/toyota-oto

# Chỉnh sửa ecosystem.config.js, cập nhật DATABASE_URL và SESSION_SECRET
nano ecosystem.config.js
# (Hoặc để nguyên vì đã có .env)

# Khởi động với PM2
pm2 start ecosystem.config.js

# Xem logs
pm2 logs toyota-oto

# Lưu cấu hình PM2
pm2 save

# Cấu hình tự khởi động khi reboot
pm2 startup
# Copy và chạy lệnh mà PM2 in ra
```

---

## BƯỚC 7: CẤU HÌNH NGINX

```bash
# Tạo config file (thay yourdomain.com bằng domain thật)
sudo nano /etc/nginx/sites-available/toyota-oto
```

**Dán nội dung sau** (thay `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Kích hoạt site
sudo ln -s /etc/nginx/sites-available/toyota-oto /etc/nginx/sites-enabled/

# Xóa default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
```

---

## BƯỚC 8: CÀI SSL MIỄN PHÍ (Let's Encrypt)

```bash
# Cài SSL (thay yourdomain.com)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Nhập email, đồng ý terms, chọn redirect HTTP sang HTTPS
# Done! Website sẽ chạy HTTPS

# Tự động renew SSL
sudo systemctl enable certbot.timer
```

---

## BƯỚC 9: KIỂM TRA

```bash
# Xem status app
pm2 status

# Xem logs realtime
pm2 logs toyota-oto --lines 50

# Xem status nginx
sudo systemctl status nginx

# Xem status postgresql
sudo systemctl status postgresql
```

Mở browser: `https://yourdomain.com` ✅

---

## LỆNH QUẢN LÝ HÀNG NGÀY

```bash
# Restart app
pm2 restart toyota-oto

# Xem logs
pm2 logs toyota-oto

# Update code mới
cd /var/www/toyota-oto
# Copy/pull code mới vào
npm install --production
pm2 restart toyota-oto

# Backup database
pg_dump -U admin toyota > backup_$(date +%Y%m%d).sql

# Restore database
psql -U admin toyota < backup_20240101.sql
```

---

## XỬ LÝ SỰ CỐ THƯỜNG GẶP

### App không chạy:
```bash
pm2 logs toyota-oto   # Xem lỗi
pm2 restart toyota-oto
```

### Nginx 502 Bad Gateway:
```bash
pm2 status            # Kiểm tra app có chạy không
pm2 start ecosystem.config.js  # Khởi động lại nếu stopped
```

### Không kết nối được database:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
# Kiểm tra DATABASE_URL trong .env
```

### Lỗi SSL:
```bash
sudo certbot renew --dry-run   # Test renew
sudo certbot renew             # Renew thật
```

---

## FIREWALL (Bảo mật)

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

## CẤU TRÚC TRÊN SERVER

```
/var/www/toyota-oto/
├── server.js
├── package.json
├── ecosystem.config.js
├── .env              ← File bí mật, không commit git
├── database-postgresql.js
├── views/
├── images/           ← Ảnh upload sẽ lưu ở đây
└── node_modules/
```

