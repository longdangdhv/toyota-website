# 📸 HƯỚNG DẪN SỬ DỤNG NHIỀU ẢNH CHO XE

## ✨ Tính năng mới

### 1. Mỗi xe có nhiều ảnh
- Upload/chọn được nhiều ảnh cùng lúc
- Chọn 1 ảnh làm ảnh đại diện (có dấu ⭐)
- Ảnh đại diện hiển thị ở danh sách và trang chủ

### 2. Slider ảnh ở trang chi tiết
- Hiển thị tất cả ảnh của xe
- Có nút Previous/Next để chuyển ảnh
- Thumbnails để xem trước và click chọn
- Hỗ trợ điều khiển bằng phím mũi tên ←→
- Hiển thị số thứ tự ảnh (1/5, 2/5...)

## 🎯 Cách sử dụng

### Thêm xe mới với nhiều ảnh

1. Vào `/admin/cars/add`
2. Điền thông tin xe
3. Phần "🖼️ Quản lý ảnh xe":
   
   **Cách 1: Chọn từ thư viện**
   - Click vào nhiều ảnh (có thể chọn 3, 5, 10 ảnh...)
   - Ảnh được chọn sẽ có dấu ✓ màu đỏ
   - Ảnh đầu tiên tự động làm ảnh đại diện (có dấu ⭐)
   - Click vào ảnh trong "Ảnh đã chọn" để đổi ảnh đại diện
   
   **Cách 2: Upload ảnh mới**
   - Chọn tab "📤 Upload ảnh mới"
   - Click "Choose Files"
   - Giữ Ctrl và click để chọn nhiều file
   - Ảnh đầu tiên làm ảnh đại diện

4. Submit form

### Sửa xe - Thay đổi ảnh

1. Vào `/admin/cars`, click "Sửa"
2. Xem "Ảnh đã chọn" - hiển thị tất cả ảnh hiện tại
3. Thêm/bớt ảnh:
   - Click ảnh trong gallery để thêm
   - Click nút "×" trên ảnh đã chọn để xóa
4. Đổi ảnh đại diện:
   - Click vào ảnh trong "Ảnh đã chọn"
   - Ảnh có badge "Đại diện" là ảnh chính
5. Submit

## 💡 Lưu ý

### Ảnh đại diện
- Ảnh đại diện = ảnh hiển thị ở danh sách xe
- Có badge "Đại diện" màu vàng
- Có dấu ⭐ trong gallery
- Không thể xóa nếu chưa chọn ảnh khác làm đại diện

### Thứ tự ảnh
- Ảnh đại diện luôn là ảnh đầu tiên trong slider
- Các ảnh khác theo thứ tự chọn

### Upload nhiều file
- Tối đa 10 file/lần
- Mỗi file < 5MB
- Chỉ chấp nhận JPG, PNG

## 🎨 Giao diện slider (Trang chi tiết xe)

```
┌──────────────────────────────────────┐
│     ← [Ảnh chính lớn]      →       │
│                              1 / 5  │
└──────────────────────────────────────┘
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │  <- Thumbnails
└───┴───┴───┴───┴───┘
```

- Click thumbnail để xem ảnh
- Click nút ← → để chuyển ảnh
- Nhấn phím ← → trên bàn phím

## 🔧 Cấu trúc dữ liệu

### Database (cars.json)
```json
{
  "id": 1,
  "name": "Toyota Camry",
  "image": "/images/camry-main.jpg",  // Ảnh đại diện
  "images": [                         // Tất cả ảnh
    "/images/camry-main.jpg",
    "/images/camry-interior.jpg",
    "/images/camry-back.jpg",
    "/images/camry-side.jpg"
  ]
}
```

### Form data khi submit
```
images=/images/img1.jpg,/images/img2.jpg,/images/img3.jpg
mainImage=/images/img1.jpg
```

## 📝 Checklist khi thêm xe mới

- [ ] Chọn ít nhất 1 ảnh
- [ ] Kiểm tra ảnh đại diện đã đúng (có badge "Đại diện")
- [ ] Xem preview trong "Ảnh đã chọn"
- [ ] Submit form
- [ ] Vào `/admin/cars` xem ảnh hiển thị
- [ ] Vào trang chi tiết xe xem slider hoạt động
- [ ] Test nút Previous/Next
- [ ] Test click thumbnail
- [ ] Test phím mũi tên

## 🐛 Khắc phục sự cố

### Slider không hiển thị
- Kiểm tra xe có `images` array trong database?
- Mở F12 Console xem lỗi JavaScript?
- Kiểm tra file ảnh có tồn tại?

### Không chọn được nhiều ảnh
- Đảm bảo JavaScript đã load
- F12 Console kiểm tra lỗi
- Thử refresh trang (Ctrl + F5)

### Ảnh đại diện không đúng
- Click vào ảnh muốn làm đại diện trong "Ảnh đã chọn"
- Kiểm tra badge "Đại diện" hiển thị đúng
- Submit lại form

### Upload nhiều file không hoạt động
- Kiểm tra input có thuộc tính `multiple`
- Thử chọn từng file một
- Kiểm tra dung lượng từng file < 5MB

## 📊 Ví dụ

### Xe có 5 ảnh
```
1. camry-exterior.jpg  ⭐ Ảnh đại diện
2. camry-interior.jpg
3. camry-dashboard.jpg
4. camry-engine.jpg
5. camry-trunk.jpg
```

Khi vào trang chi tiết:
- Ảnh 1 hiển thị đầu tiên
- Click → để xem ảnh 2, 3, 4, 5
- Click thumbnail để jump trực tiếp
- Hiển thị "1 / 5", "2 / 5"...

## 🚀 Tính năng nâng cao (có thể thêm sau)

- [ ] Drag & drop để sắp xếp thứ tự ảnh
- [ ] Zoom ảnh khi click
- [ ] Lightbox xem ảnh full screen
- [ ] Auto-play slider
- [ ] Thêm caption/mô tả cho từng ảnh
- [ ] Upload ảnh bằng kéo thả
- [ ] Crop/resize ảnh trước khi upload
- [ ] Lazy load cho ảnh

## 📖 API Endpoints

```javascript
// Sửa xe với nhiều ảnh
POST /admin/cars/update/:id
Content-Type: multipart/form-data

Body:
  - images: "/images/img1.jpg,/images/img2.jpg,..."
  - mainImage: "/images/img1.jpg"
  - imageFiles: [File, File, ...] (nếu upload mới)

// Hoặc upload nhiều file
POST /admin/cars/update/:id
Content-Type: multipart/form-data

Body:
  - imageFiles[]: File1
  - imageFiles[]: File2
  - imageFiles[]: File3
```

## ✅ Đã hoàn thành

- [x] Slider ảnh ở trang chi tiết
- [x] Chọn nhiều ảnh từ gallery
- [x] Upload nhiều ảnh cùng lúc
- [x] Đặt ảnh đại diện
- [x] Thumbnails navigation
- [x] Keyboard navigation (← →)
- [x] Image counter (1/5)
- [x] Visual feedback (badges, borders)
- [x] Database support (images array)
- [x] Backward compatible (xe cũ vẫn hoạt động)
