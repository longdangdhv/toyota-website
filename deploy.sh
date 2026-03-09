#!/bin/bash
# ==============================================
# DEPLOY SCRIPT - Toyota Oto Website
# Chạy script này trên Ubuntu Server
# ==============================================

set -e  # Dừng nếu có lỗi

echo "================================================"
echo "  DEPLOY TOYOTA OTO WEBSITE"
echo "  Server: Ubuntu 24"
echo "================================================"

APP_DIR="/var/www/toyota-oto"
APP_USER="www-data"
DOMAIN="toy.com"   # <<< THAY ĐỔI DOMAIN CỦA BẠN

# ---- 1. CÀI ĐẶT NODE.JS ----
echo ""
echo ">>> [1/8] Cài đặt Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js $(node -v) đã được cài"
else
    echo "✅ Node.js $(node -v) đã có sẵn"
fi

# ---- 2. CÀI ĐẶT PM2 ----
echo ""
echo ">>> [2/8] Cài đặt PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo "✅ PM2 đã được cài"
else
    echo "✅ PM2 đã có sẵn"
fi

# ---- 3. CÀI ĐẶT NGINX ----
echo ""
echo ">>> [3/8] Cài đặt Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y nginx
    echo "✅ Nginx đã được cài"
else
    echo "✅ Nginx đã có sẵn"
fi

# ---- 4. CÀI ĐẶT POSTGRESQL ----
echo ""
echo ">>> [4/8] Cài đặt PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt-get install -y postgresql postgresql-contrib
    echo "✅ PostgreSQL đã được cài"
else
    echo "✅ PostgreSQL đã có sẵn"
fi

# Khởi động PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# ---- 5. TẠO DATABASE ----
echo ""
echo ">>> [5/8] Tạo database PostgreSQL..."
DB_PASS="admin"
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "User admin đã tồn tại"
sudo -u postgres psql -c "CREATE DATABASE toyota OWNER admin;" 2>/dev/null || echo "Database toyota đã tồn tại"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE toyota TO admin;" 2>/dev/null
echo "✅ Database đã sẵn sàng"
echo "   DB Password: $DB_PASS  <<< LƯU LẠI MẬT KHẨU NÀY!"

# ---- 6. COPY/CLONE ỨNG DỤNG ----
echo ""
echo ">>> [6/8] Chuẩn bị thư mục ứng dụng..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Nếu đang chạy từ thư mục source, copy sang
if [ -f "server.js" ]; then
    echo "  Đang copy files từ thư mục hiện tại..."
    rsync -av --exclude='node_modules' --exclude='.git' --exclude='*.db' . $APP_DIR/
else
    echo "  ⚠️  Không tìm thấy server.js - Hãy copy source code vào $APP_DIR trước!"
fi

cd $APP_DIR

# Tạo file .env
SESSION_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | head -c 48)
cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://admin:${DB_PASS}@localhost:5432/toyota
SESSION_SECRET=${SESSION_SECRET}
EOF
echo "✅ File .env đã được tạo"

# Tạo thư mục images nếu chưa có
mkdir -p images

# Cài đặt dependencies
echo "  Cài đặt Node.js packages..."
npm install --production
echo "✅ Packages đã được cài"

# Khởi tạo database tables
echo "  Khởi tạo database tables..."
node init-db.js || echo "⚠️  Lỗi init-db, có thể tables đã tồn tại"
echo "✅ Database tables đã sẵn sàng"

# ---- 7. CẤU HÌNH NGINX ----
echo ""
echo ">>> [7/8] Cấu hình Nginx..."
sudo tee /etc/nginx/sites-available/toyota-oto << NGINX_CONF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Giới hạn upload size (10MB)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

# Kích hoạt site
sudo ln -sf /etc/nginx/sites-available/toyota-oto /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test và reload nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx đã được cấu hình"

# ---- 8. KHỞI ĐỘNG ỨNG DỤNG VỚI PM2 ----
echo ""
echo ">>> [8/8] Khởi động ứng dụng..."
cd $APP_DIR

# Load .env vào PM2
pm2 delete toyota-oto 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# Cấu hình PM2 tự khởi động khi server restart
pm2 startup systemd -u $USER --hp $HOME | tail -1 | sudo bash
pm2 save

echo ""
echo "================================================"
echo "  ✅ DEPLOY HOÀN THÀNH!"
echo "================================================"
echo ""
echo "  🌐 Website: http://${DOMAIN}"
echo "  📁 App dir: ${APP_DIR}"
echo "  📊 PM2 status: pm2 status"
echo "  📋 PM2 logs: pm2 logs toyota-oto"
echo ""
echo "  🔐 Admin login:"
echo "     URL: http://${DOMAIN}/admin"
echo "     Kiểm tra mật khẩu trong server.js (route /admin/login)"
echo ""
echo "  ⚠️  TIẾP THEO:"
echo "  1. Cài SSL: sudo apt install certbot python3-certbot-nginx"
echo "              sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "  2. Backup DB: pg_dump toyota > backup.sql"
echo ""

