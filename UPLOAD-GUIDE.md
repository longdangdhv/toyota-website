# 📤 HƯỚNG DẪN UPLOAD ẢNH

## Cài đặt thư viện cần thiết

```bash
npm install multer
```

## Cách sử dụng tính năng Upload Ảnh

### 1. Truy cập trang Admin Upload

- Đăng nhập vào Admin: http://localhost:3000/admin/login
- Click vào menu "📤 Upload ảnh" hoặc truy cập: http://localhost:3000/admin/upload

### 2. Upload ảnh mới

1. **Chọn file ảnh**: Click "Chọn ảnh" và chọn file JPG hoặc PNG (tối đa 5MB)
2. **Đặt tên file**: Nhập tên file không có khoảng trắng (ví dụ: `camry-2024`)
   - Hệ thống tự động thêm phần mở rộng (.jpg hoặc .png)
   - Tên file nên dùng dấu gạch ngang `-` thay cho khoảng trắng
3. **Click "Upload Ảnh"** để tải lên

### 3. Xem danh sách ảnh đã upload

- Tất cả ảnh được hiển thị dưới dạng lưới
- Mỗi ảnh hiển thị preview và tên file
- Tổng số ảnh được hiển thị ở tiêu đề

### 4. Xóa ảnh

- Click nút "🗑️ Xóa" trên ảnh muốn xóa
- Xác nhận xóa trong hộp thoại

### 5. Sử dụng ảnh đã upload

Sau khi upload, ảnh có thể sử dụng với đường dẫn:
```
/images/ten-file.jpg
```

**Ví dụ sử dụng trong quản lý xe:**
- Upload ảnh với tên: `camry-2024`
- File được lưu: `camry-2024.jpg`
- Đường dẫn sử dụng: `/images/camry-2024.jpg`

## Quy định về ảnh

- **Định dạng**: Chỉ chấp nhận JPG, JPEG, PNG
- **Kích thước**: Tối đa 5MB
- **Tên file**: Không dấu, không khoảng trắng, dùng dấu gạch ngang `-`
- **Thư mục lưu**: Tất cả ảnh lưu trong folder `images/`

## Lưu ý

1. Tên file phải duy nhất, nếu trùng sẽ ghi đè lên file cũ
2. Nên đặt tên file có ý nghĩa để dễ quản lý
3. Ảnh banner nên đặt tên: `banner-1.jpg`, `banner-2.jpg`...
4. Ảnh xe nên đặt tên theo mẫu: `ten-xe-nam.jpg`

## Khắc phục sự cố

### Lỗi "Chỉ chấp nhận file ảnh JPG hoặc PNG"
- Kiểm tra định dạng file
- Đảm bảo file có phần mở rộng .jpg, .jpeg hoặc .png

### Lỗi upload không thành công
- Kiểm tra kích thước file (< 5MB)
- Đảm bảo folder `images/` có quyền ghi
- Khởi động lại server

### File không hiển thị
- Xóa cache trình duyệt (Ctrl + F5)
- Kiểm tra đường dẫn file trong console

## Cấu trúc code

Tính năng upload sử dụng:
- **Thư viện**: `multer` (xử lý upload)
- **Routes**: `/admin/upload` (GET, POST)
- **View**: `views/admin-upload.ejs`
- **Storage**: `images/` folder

## Ví dụ sử dụng trong form quản lý xe

Khi chỉnh sửa xe, bạn có thể:
1. Upload ảnh trong trang Upload
2. Copy đường dẫn: `/images/ten-file.jpg`
3. Paste vào trường "Ảnh" trong form chỉnh sửa xe
