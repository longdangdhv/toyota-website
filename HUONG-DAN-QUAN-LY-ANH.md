# 🚗 HƯỚNG DẪN QUẢN LÝ ẢNH XE

## Tính năng đã thêm

### 1. Upload ảnh độc lập
- Truy cập: `/admin/upload`
- Upload ảnh JPG/PNG (tối đa 5MB)
- Đặt tên file tùy chỉnh
- Xem và xóa ảnh đã upload
- Tất cả ảnh lưu trong folder `images/`

### 2. Quản lý ảnh trong form xe

Khi thêm/sửa xe, bạn có **3 cách chọn ảnh**:

#### Cách 1: Chọn ảnh có sẵn (Khuyến nghị) ⭐
1. Chọn tab "📁 Chọn ảnh có sẵn"
2. Xem tất cả ảnh đã upload dưới dạng lưới
3. Click vào ảnh muốn dùng
4. Ảnh được chọn sẽ có viền đỏ
5. Preview hiển thị ngay lập tức

#### Cách 2: Upload ảnh mới
1. Chọn tab "📤 Upload ảnh mới"
2. Click "Chọn file" và chọn ảnh JPG/PNG
3. Ảnh sẽ được upload khi submit form
4. Preview hiển thị trước khi upload

#### Cách 3: Nhập URL thủ công
1. Chọn tab "🔗 Nhập URL"
2. Nhập đường dẫn: `/images/ten-file.jpg`
3. Preview hiển thị để kiểm tra

## Quy trình làm việc khuyến nghị

### Thêm xe mới
```
Bước 1: Upload ảnh trước
- Vào /admin/upload
- Upload ảnh xe với tên: camry-2024.jpg
- Kiểm tra ảnh đã lưu thành công

Bước 2: Thêm thông tin xe
- Vào /admin/cars
- Click "➕ Thêm xe mới"
- Điền thông tin xe
- Chọn tab "Chọn ảnh có sẵn"
- Click vào ảnh camry-2024.jpg
- Submit form
```

### Sửa xe
```
Bước 1: Vào danh sách xe
- Truy cập /admin/cars
- Click "Sửa" ở xe muốn chỉnh sửa

Bước 2: Thay đổi ảnh
Cách A - Chọn ảnh khác đã có:
  - Tab "Chọn ảnh có sẵn"
  - Click vào ảnh mới

Cách B - Upload ảnh mới:
  - Tab "Upload ảnh mới"
  - Chọn file ảnh mới
  - Submit

Cách C - Giữ nguyên ảnh cũ:
  - Không thay đổi gì
  - Submit form
```

## Hiển thị ảnh trong danh sách xe

Trong trang `/admin/cars`, mỗi xe hiển thị:
- ✅ Thumbnail ảnh (60x40px)
- ✅ Tên xe
- ✅ Danh mục (Sedan, SUV, MPV, Bán tải)
- ✅ Khoảng giá
- ✅ Trạng thái nổi bật
- ✅ Nút chỉnh sửa

## Lưu ý quan trọng

### Quy tắc đặt tên file ảnh
```
✅ Đúng:
- camry-2024.jpg
- fortuner-legender.png
- vios-gr-sport.jpg

❌ Sai:
- Camry 2024.jpg (có khoảng trắng)
- xe-camry!.jpg (có ký tự đặc biệt)
- VIOS.JPG (viết hoa - nên viết thường)
```

### Quy ước đặt tên
- **Xe**: `ten-xe-phien-ban.jpg`
  - Ví dụ: `camry-2.5q.jpg`, `vios-g.jpg`
- **Banner**: `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg`
- **Khuyến mãi**: `promotion-thang-1.jpg`
- **Tin tức**: `news-ra-mat-camry.jpg`

### Kích thước ảnh khuyến nghị
- **Ảnh xe chính**: 800x600px (tỷ lệ 4:3)
- **Banner**: 1920x600px (tỷ lệ 16:5)
- **Thumbnail**: Tự động resize bởi CSS
- **Dung lượng**: < 5MB (khuyến nghị < 500KB)

## Xử lý sự cố

### Ảnh không hiển thị trong gallery
**Nguyên nhân**: 
- File không phải JPG/PNG
- Tên file có ký tự đặc biệt

**Giải pháp**:
1. Kiểm tra định dạng file
2. Đổi tên file theo quy tắc
3. Upload lại
4. Refresh trang (F5)

### Ảnh preview không hiển thị
**Nguyên nhân**:
- Đường dẫn sai
- File không tồn tại

**Giải pháp**:
1. Vào `/admin/upload` kiểm tra file có tồn tại
2. Copy đúng đường dẫn từ gallery
3. Kiểm tra console browser (F12) xem lỗi

### Upload ảnh bị lỗi
**Nguyên nhân**:
- File quá lớn (> 5MB)
- Định dạng không hỗ trợ
- Folder images/ không có quyền ghi

**Giải pháp**:
1. Nén ảnh xuống < 5MB
2. Chuyển đổi sang JPG/PNG
3. Kiểm tra quyền folder:
   ```bash
   # Windows: Click phải folder images > Properties > Security
   ```

### Form submit không lưu ảnh
**Nguyên nhân**:
- Quên chọn ảnh
- Hidden input #image không có giá trị

**Giải pháp**:
1. Kiểm tra ảnh đã được chọn (có viền đỏ)
2. Xem preview có hiển thị không
3. F12 console kiểm tra giá trị input#image

## Cấu trúc file

```
oto/
├── images/                    # Thư mục chứa ảnh
│   ├── banner-1.jpg
│   ├── banner-2.jpg
│   ├── camry-2024.jpg
│   ├── vios-2024.jpg
│   └── ...
├── views/
│   ├── admin-upload.ejs      # Trang upload ảnh
│   ├── admin-car-add.ejs     # Form thêm xe mới
│   ├── admin-car-edit.ejs    # Form sửa xe
│   └── admin-cars.ejs        # Danh sách xe
├── server.js                  # Routes và multer config
├── database-file.js           # Database functions
└── package.json               # Dependencies (multer)
```

## API Endpoints

```javascript
// Upload ảnh độc lập
GET  /admin/upload           // Trang upload
POST /admin/upload           // Upload ảnh mới
POST /admin/upload/delete    // Xóa ảnh

// Quản lý xe
GET  /admin/cars             // Danh sách xe
GET  /admin/cars/add         // Form thêm xe
POST /admin/cars/add         // Thêm xe mới
GET  /admin/cars/edit/:id    // Form sửa xe
POST /admin/cars/update/:id  // Cập nhật xe
```

## Tips & Tricks

### 1. Upload nhiều ảnh cùng lúc
- Vào `/admin/upload`
- Upload từng ảnh một với tên rõ ràng
- Sau đó vào form xe chọn ảnh từ gallery

### 2. Tìm ảnh nhanh trong gallery
- Đặt tên file có quy tắc
- Sắp xếp theo tên xe
- Ví dụ: `camry-*`, `vios-*`, `fortuner-*`

### 3. Backup ảnh
- Copy toàn bộ folder `images/`
- Lưu vào nơi an toàn
- Khi cần restore, paste lại

### 4. Optimize ảnh trước khi upload
- Dùng tool: TinyPNG, Squoosh.app
- Giảm dung lượng 50-70%
- Giữ nguyên chất lượng hiển thị

### 5. Xem ảnh đang dùng
- Vào `/admin/cars`
- Xem thumbnail ở cột "Ảnh"
- Click "Sửa" để xem ảnh lớn

## Checklist khi thêm xe mới

- [ ] Upload ảnh xe vào `/admin/upload`
- [ ] Đặt tên file theo quy tắc (ví dụ: `camry-2024.jpg`)
- [ ] Vào `/admin/cars` → Click "Thêm xe mới"
- [ ] Điền tên xe (tự động tạo slug)
- [ ] Chọn danh mục (Sedan/SUV/MPV/Bán tải)
- [ ] Điền giá và khoảng giá
- [ ] Chọn ảnh từ gallery
- [ ] Kiểm tra preview
- [ ] Điền mô tả (tùy chọn)
- [ ] Đánh dấu "Nổi bật" nếu cần
- [ ] Click "💾 Thêm xe"
- [ ] Kiểm tra trong danh sách xe

## Video hướng dẫn (đề xuất quay)

1. **Upload ảnh cơ bản** (2 phút)
   - Truy cập admin/upload
   - Upload 3-4 ảnh xe
   - Xóa 1 ảnh

2. **Thêm xe mới với ảnh** (3 phút)
   - Vào form thêm xe
   - Điền thông tin
   - Chọn ảnh từ gallery
   - Submit và kiểm tra

3. **Sửa ảnh xe** (2 phút)
   - Vào danh sách xe
   - Click sửa xe
   - Thay đổi ảnh
   - Lưu và kiểm tra
