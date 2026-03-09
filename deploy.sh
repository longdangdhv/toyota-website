#!/bin/bash
# ==============================================
# DEPLOY SCRIPT - Toyota Oto Website
# Chạy script này trên Ubuntu Server
#
# Chế độ:
#   ./deploy.sh          → Tự động phát hiện (lần đầu hay update)
#   ./deploy.sh --install → Cài đặt đầy đủ (lần đầu)
#   ./deploy.sh --update  → Chỉ copy file + reload PM2 (update nhanh)
# ==============================================

set -e

APP_DIR="/var/www/toyota-oto"
DOMAIN="toyota.longbienhn.vn"   # <<< THAY ĐỔI DOMAIN CỦA BẠN

# -----------------------------------------------
# Hàm kiểm tra hệ thống đã được cài đặt chưa
# -----------------------------------------------
is_installed() {
    command -v node &> /dev/null && \
    command -v pm2 &> /dev/null && \
    command -v nginx &> /dev/null && \
    command -v psql &> /dev/null && \
    [ -f "$APP_DIR/.env" ] && \
    pm2 list | grep -q "toyota-oto"
}

# -----------------------------------------------
# Hàm UPDATE NHANH: chỉ copy file + reload PM2
# -----------------------------------------------
do_update() {
    echo "================================================"
    echo "  🔄 UPDATE NHANH - Toyota Oto Website"
    echo "================================================"

    if [ ! -f "server.js" ]; then
        echo "❌ Không tìm thấy server.js - Hãy chạy script từ thư mục source code!"
        exit 1
    fi

    echo ""
    echo ">>> [1/3] Copy files mới vào $APP_DIR ..."
    rsync -av \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.db' \
        --exclude='.env' \
        --exclude='images/' \
        . $APP_DIR/
    echo "✅ Copy files xong"

    echo ""
    echo ">>> [2/3] Cài đặt / cập nhật Node.js packages..."
    cd $APP_DIR
    npm install --production
    echo "✅ Packages đã được cập nhật"

    echo ""
    echo ">>> [3/3] Reload PM2..."
    pm2 reload toyota-oto --update-env
    pm2 save
    echo "✅ PM2 đã reload"

    echo ""
    echo "================================================"
    echo "  ✅ UPDATE HOÀN THÀNH!"
    echo "================================================"
    echo ""
    echo "  📊 Kiểm tra:  pm2 status"
    echo "  📋 Logs:      pm2 logs toyota-oto"
    echo "  🌐 Website:   http://${DOMAIN}"
    echo ""
}

# -----------------------------------------------
# Hàm CÀI ĐẶT ĐẦY ĐỦ (lần đầu)
# -----------------------------------------------
do_install() {
    echo "================================================"
    echo "  🚀 CÀI ĐẶT ĐẦY ĐỦ - Toyota Oto Website"
    echo "  Server: Ubuntu 24"
    echo "================================================"

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
    sudo systemctl start postgresql
    sudo systemctl enable postgresql

    # ---- 5. TẠO DATABASE ----
    echo ""
    echo ">>> [5/8] Tạo database PostgreSQL..."
    DB_PASS="admin"
    sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "  User admin đã tồn tại"
    sudo -u postgres psql -c "CREATE DATABASE toyota OWNER admin;" 2>/dev/null || echo "  Database toyota đã tồn tại"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE toyota TO admin;" 2>/dev/null
    echo "✅ Database đã sẵn sàng  (password: $DB_PASS)"

    # ---- 6. COPY ỨNG DỤNG ----
    echo ""
    echo ">>> [6/8] Chuẩn bị thư mục ứng dụng..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR

    if [ -f "server.js" ]; then
        echo "  Đang copy files từ thư mục hiện tại..."
        rsync -av \
            --exclude='node_modules' \
            --exclude='.git' \
            --exclude='*.db' \
            . $APP_DIR/
    else
        echo "❌ Không tìm thấy server.js - Hãy copy source code vào $APP_DIR trước!"
        exit 1
    fi

    cd $APP_DIR
    mkdir -p images

    # Tạo file .env (chỉ tạo nếu chưa có)
    if [ ! -f ".env" ]; then
        SESSION_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | head -c 48)
        cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://admin:${DB_PASS}@localhost:5432/toyota
SESSION_SECRET=${SESSION_SECRET}
EOF
        echo "✅ File .env đã được tạo"
    else
        echo "✅ File .env đã có sẵn (giữ nguyên)"
    fi

    npm install --production
    echo "✅ Packages đã được cài"

    node init-db.js || echo "⚠️  init-db lỗi - tables có thể đã tồn tại"
    echo "✅ Database tables đã sẵn sàng"

    # ---- 7. CẤU HÌNH NGINX ----
    echo ""
    echo ">>> [7/8] Cấu hình Nginx..."
    sudo tee /etc/nginx/sites-available/toyota-oto > /dev/null << NGINX_CONF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

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

    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

    sudo ln -sf /etc/nginx/sites-available/toyota-oto /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl reload nginx
    echo "✅ Nginx đã được cấu hình"

    # ---- 8. KHỞI ĐỘNG PM2 ----
    echo ""
    echo ">>> [8/8] Khởi động ứng dụng với PM2..."
    cd $APP_DIR
    pm2 delete toyota-oto 2>/dev/null || true
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup systemd -u $USER --hp $HOME | tail -1 | sudo bash
    pm2 save
    echo "✅ PM2 đã khởi động"

    echo ""
    echo "================================================"
    echo "  ✅ CÀI ĐẶT HOÀN THÀNH!"
    echo "================================================"
    echo ""
    echo "  🌐 Website:   http://${DOMAIN}"
    echo "  📁 App dir:   ${APP_DIR}"
    echo "  📊 PM2 status: pm2 status"
    echo "  📋 PM2 logs:  pm2 logs toyota-oto"
    echo ""
    echo "  🔐 Admin:     http://${DOMAIN}/admin"
    echo ""
    echo "  ⚠️  TIẾP THEO:"
    echo "  1. Cài SSL:   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    echo "  2. Backup DB: pg_dump toyota > backup.sql"
    echo ""
    echo "  📦 Lần sau chỉ cần UPDATE NHANH:"
    echo "     ./deploy.sh --update"
    echo ""
}

# -----------------------------------------------
# MAIN - Xác định chế độ chạy
# -----------------------------------------------
MODE=${1:-"auto"}

if [ "$MODE" == "--update" ]; then
    do_update
elif [ "$MODE" == "--install" ]; then
    do_install
else
    # Chế độ tự động: kiểm tra hệ thống đã cài đủ chưa
    echo "🔍 Kiểm tra hệ thống..."
    if is_installed; then
        echo "✅ Hệ thống đã được cài đặt đầy đủ → Chạy UPDATE NHANH"
        echo "   (dùng --install để cài lại từ đầu)"
        echo ""
        do_update
    else
        echo "⚙️  Chưa cài đặt đầy đủ → Chạy CÀI ĐẶT ĐẦY ĐỦ"
        echo "   (dùng --update nếu bạn chỉ muốn deploy code)"
        echo ""
        do_install
    fi
fi
