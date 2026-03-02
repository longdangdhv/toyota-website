# 🖼️ HƯỚNG DẪN THÊM BANNER

## Hiện Tại:
Bạn có **1 banner**: `banner-corolla-cross-240510-pc01.jpg`

## Cần Làm Gì:

### 1️⃣ Copy thêm 2 ảnh banner vào folder `images/`

**Đặt tên theo format**:
```
images/
├── banner-corolla-cross-240510-pc01.jpg  ✅ (đã có)
├── banner-2.jpg                          ➕ (cần thêm)
├── banner-3.jpg                          ➕ (cần thêm)
```

**HOẶC**:
```
images/
├── banner-corolla-cross-240510-pc01.jpg  ✅
├── banner-fortuner.jpg                   ➕
├── banner-camry.jpg                      ➕
```

### 2️⃣ Khởi động lại server
```bash
# Tắt server: Ctrl + C
# Chạy lại:
npm start
```

### 3️⃣ Xem kết quả
Truy cập: http://localhost:3000

## ✨ Tính Năng Banner Slider:

✅ **3 ảnh banner** (hoặc nhiều hơn)  
✅ **Auto-play** - Tự động chuyển sau 5 giây  
✅ **Navigation arrows** - Nút prev/next hai bên  
✅ **Dots indicator** - 3 chấm tròn ở giữa dưới cùng  
✅ **Smooth fade effect** - Chuyển mượt mà  
✅ **Click dots** - Nhảy đến slide bất kỳ  
✅ **Nút CTA** - Ở dưới banner (không overlay)  

## 🎯 Nếu Chưa Có Ảnh Banner:

### Cách 1: Tạm dùng ảnh có sẵn
```bash
# Copy ảnh corolla hiện tại thành 3 file
copy images\banner-corolla-cross-240510-pc01.jpg images\banner-2.jpg
copy images\banner-corolla-cross-240510-pc01.jpg images\banner-3.jpg
```

### Cách 2: Tải ảnh từ Unsplash
1. Truy cập: https://unsplash.com/s/photos/toyota-car
2. Tải 2 ảnh banner đẹp
3. Đổi tên: `banner-2.jpg`, `banner-3.jpg`
4. Copy vào `images/`

### Cách 3: Dùng URL ảnh trực tiếp (nhanh nhất)
Sửa file `server.js` thêm banner mặc định nếu không có đủ ảnh:

```javascript
// Thêm banner mặc định nếu < 3 ảnh
if (banners.length < 3) {
  banners = [
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1920',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920'
  ];
}
```

## 📐 Thông Số Banner Khuyến Nghị:

- **Kích thước**: 1920x600px (tỷ lệ 16:5)
- **Định dạng**: JPG hoặc PNG
- **Dung lượng**: < 500KB (để load nhanh)
- **Nội dung**: Ảnh xe Toyota, không có text overlay (web tự thêm)

## 🔧 Tùy Chỉnh Banner:

### Đổi chiều cao banner:
Sửa trong `index.ejs`:
```html
<div class="banner-slider relative" style="height: 600px;">
<!-- Đổi 600px thành số khác -->
```

### Đổi thời gian auto-play:
Sửa trong `index.ejs`:
```javascript
setInterval(() => {
  nextSlide();
}, 5000);  // 5000 = 5 giây, đổi thành 3000 = 3 giây
```

### Tắt auto-play:
Xóa đoạn code:
```javascript
// Auto play
if (totalSlides > 1) {
  setInterval(() => {
    nextSlide();
  }, 5000);
}
```
