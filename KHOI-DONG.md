# 🚀 KHỞI ĐỘNG WEBSITE

## Lần Đầu Chạy:

```bash
cd D:\oto
npm install
npm start
```

## Đã Cài Đặt - Chỉ Cần Start:

```bash
cd D:\oto
npm start
```

## ❗ Nếu Gặp Lỗi "banners is not defined":

**Nguyên nhân**: Server đang chạy code cũ

**Giải pháp**:
1. Tắt server hiện tại (Ctrl + C trong terminal)
2. Chạy lại: `npm start`
3. Truy cập: http://localhost:3000

## 🎯 Banner Slider Đã Sẵn Sàng

Bạn có 1 banner trong folder `images/`:
- `banner-corolla-cross-240510-pc01.jpg` ✅

### Thêm banner mới:
1. Copy ảnh vào folder `images/`
2. Đặt tên: `banner-2.jpg`, `banner-3.jpg`, etc.
3. Restart server
4. Banner tự động hiển thị với slider

### Banner hiện tại:
- Chiều cao: 600px
- Auto-play: 5 giây
- Có nút prev/next (nếu >1 ảnh)
- Có dots indicator
- Overlay text "TOYOTA - Luôn Tốt Hơn Mỗi Ngày"

## ✅ Truy Cập Website

**URL**: http://localhost:3000

**Các trang**:
- `/` - Trang chủ (có banner slider)
- `/san-pham` - Danh sách xe
- `/san-pham/vios` - Chi tiết xe Vios
- `/tin-tuc` - Tin tức
- `/khuyen-mai` - Khuyến mãi
- `/dang-ky-lai-thu` - Đăng ký lái thử
- `/tra-gop` - Tư vấn trả góp
- `/lien-he` - Liên hệ
