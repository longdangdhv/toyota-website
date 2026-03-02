# Hướng Dẫn Thêm Hình Ảnh Cho Website

## 🎯 BANNER SLIDER (Trang Chủ)

Website tự động phát hiện và hiển thị tất cả ảnh banner trong folder `images/`.

### Quy Tắc Đặt Tên Banner:
```
images/
├── banner-1.jpg          ✅ Hiển thị
├── banner-2.jpg          ✅ Hiển thị
├── banner-corolla.jpg    ✅ Hiển thị
├── banner-camry.png      ✅ Hiển thị
├── vios.jpg              ❌ Không hiển thị (thiếu prefix "banner-")
```

**Format**: `banner-*.jpg` hoặc `banner-*.png`

### Thêm Banner Mới:
1. Đặt ảnh vào folder `images/`
2. Đặt tên file bắt đầu bằng `banner-`
3. Khởi động lại server: `npm start`
4. Banner tự động xuất hiện và auto-play

### Tính Năng Banner:
- ✅ Auto-play 5 giây/slide
- ✅ Navigation arrows (nếu >1 banner)
- ✅ Dots indicator
- ✅ Smooth fade transition
- ✅ Responsive design
- ✅ Overlay text có thể tùy chỉnh

---

## ⚠️ Lưu Ý Bản Quyền
Không được copy ảnh từ website Toyota hoặc bất kỳ website nào khác vì vi phạm bản quyền.

## ✅ Nguồn Ảnh Hợp Pháp

### 1. **Ảnh Chính Thức Từ Toyota**
- Truy cập: https://www.toyota.com.vn/
- Tải Press Kit chính thức từ Toyota Việt Nam
- Hoặc liên hệ Toyota để xin phép sử dụng ảnh

### 2. **Ảnh Stock Miễn Phí** (cho mục đích demo)
- **Unsplash**: https://unsplash.com/s/photos/toyota
- **Pexels**: https://www.pexels.com/search/toyota/
- **Pixabay**: https://pixabay.com/images/search/toyota/

### 3. **Tự Chụp Ảnh**
- Chụp ảnh xe tại showroom Toyota
- Sử dụng ảnh xe của chính bạn

## 📁 Cách Thêm Ảnh Vào Website

### Bước 1: Tạo thư mục images
```bash
mkdir public\images
```

### Bước 2: Đặt tên file theo format
```
public/images/
├── vios.jpg              # Toyota Vios
├── camry.jpg             # Toyota Camry
├── corolla-cross.jpg     # Toyota Corolla Cross
├── fortuner.jpg          # Toyota Fortuner
├── veloz.jpg             # Toyota Veloz Cross
├── yaris-cross.jpg       # Toyota Yaris Cross
├── hilux.jpg             # Toyota Hilux
├── raize.jpg             # Toyota Raize
├── news-camry-2024.jpg   # Tin tức 1
├── news-promotion.jpg    # Tin tức 2
├── news-maintenance.jpg  # Tin tức 3
├── news-fortuner.jpg     # Tin tức 4
├── news-installment.jpg  # Tin tức 5
├── promo-1.jpg           # Khuyến mãi 1
├── promo-2.jpg           # Khuyến mãi 2
└── promo-3.jpg           # Khuyến mãi 3
```

### Bước 3: Tải ảnh và đổi tên
1. Tải ảnh từ nguồn hợp pháp (Unsplash/Pexels)
2. Đổi tên file theo danh sách trên
3. Copy vào thư mục `public/images/`

### Bước 4: Website tự động hiển thị
Không cần sửa code, website đã được config đúng đường dẫn.

## 🔍 Tìm Ảnh Trên Unsplash

```bash
# Toyota Vios
https://unsplash.com/s/photos/toyota-vios

# Toyota Camry
https://unsplash.com/s/photos/toyota-camry

# Toyota Fortuner
https://unsplash.com/s/photos/toyota-fortuner

# Hoặc search chung
https://unsplash.com/s/photos/toyota-car
```

## 💡 Tạm Thời Dùng URL Ảnh Public

Nếu không muốn tải về, có thể dùng link ảnh trực tiếp từ Unsplash:

**Ví dụ sửa file cars.json:**
```json
{
  "id": 1,
  "name": "Toyota Vios",
  "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
  ...
}
```

## 📝 Checklist

- [ ] Tạo thư mục `public/images`
- [ ] Tìm ảnh từ Unsplash/Pexels
- [ ] Tải về và đổi tên theo format
- [ ] Copy vào `public/images/`
- [ ] Khởi động lại server: `npm start`
- [ ] Kiểm tra website: http://localhost:3000

## ⚖️ Disclaimer

Website này chỉ dùng cho mục đích học tập/demo. Nếu triển khai thương mại:
- Phải xin phép sử dụng ảnh từ Toyota
- Hoặc sử dụng ảnh tự chụp/mua bản quyền
- Không được sao chép nội dung từ website khác
