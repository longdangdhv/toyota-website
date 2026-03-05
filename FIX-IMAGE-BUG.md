# 🔧 SỬA LỖI ẢNH KHÔNG HIỂN THỊ

## Vấn đề đã sửa

### 1. Lỗi input URL không lưu
**Nguyên nhân**: Input `imageUrl` trong tab "Nhập URL" có `name="image"`, bị conflict với hidden input `#image`

**Giải pháp**: 
- Xóa `name="image"` khỏi input `imageUrl`
- Thêm function `handleUrlInput()` để copy giá trị sang hidden input
- Cập nhật cả `admin-car-add.ejs` và `admin-car-edit.ejs`

### 2. Lỗi image lưu dạng array
**Nguyên nhân**: Dữ liệu bị lưu dạng `["", "/images/abc.jpg"]` thay vì string

**Giải pháp**:
- Thêm validation trong server.js:
```javascript
if (Array.isArray(imagePath)) {
  imagePath = imagePath[imagePath.length - 1] || '';
}
```
- Đảm bảo `image` luôn là string khi lưu

### 3. Sửa dữ liệu sai trong cars.json
**File cũ** (xe id=1):
```json
"image": ["", "/images/image-1772722234054.jpg"]
```

**File mới** (đã sửa):
```json
"image": "/images/vios.jpg"
```

## Cách test

### Test 1: Chọn ảnh từ gallery
1. Vào `/admin/cars/add`
2. Chọn tab "📁 Chọn ảnh có sẵn"
3. Click vào 1 ảnh bất kỳ
4. Kiểm tra:
   - Ảnh có viền đỏ ✅
   - Preview hiển thị ✅
   - F12 Console: `#image` input có value đúng ✅
5. Submit form
6. Vào `/admin/cars` xem ảnh có hiển thị ✅

### Test 2: Upload ảnh mới
1. Vào `/admin/cars/add`
2. Chọn tab "📤 Upload ảnh mới"
3. Chọn file ảnh từ máy
4. Kiểm tra:
   - Preview hiển thị ✅
5. Submit form
6. Vào `/admin/cars` xem ảnh có hiển thị ✅

### Test 3: Nhập URL thủ công
1. Vào `/admin/cars/add`
2. Chọn tab "🔗 Nhập URL"
3. Nhập: `/images/banner-1.jpg`
4. Kiểm tra:
   - Preview hiển thị ✅
   - F12 Console: `#image` input có value `/images/banner-1.jpg` ✅
5. Submit form
6. Vào `/admin/cars` xem ảnh có hiển thị ✅

### Test 4: Sửa xe (giữ nguyên ảnh)
1. Vào `/admin/cars`
2. Click "Sửa" ở 1 xe bất kỳ
3. Ảnh hiện tại có viền đỏ trong gallery ✅
4. Preview hiển thị ảnh cũ ✅
5. Không thay đổi ảnh, chỉ sửa tên xe
6. Submit
7. Ảnh vẫn giữ nguyên ✅

### Test 5: Sửa xe (đổi ảnh khác)
1. Vào `/admin/cars`
2. Click "Sửa" ở 1 xe bất kỳ
3. Chọn ảnh mới từ gallery
4. Preview hiển thị ảnh mới ✅
5. Submit
6. Vào `/admin/cars` xem ảnh đã đổi ✅

## Debug logs

Khi submit form, xem console server sẽ hiện:
```
📝 Form data received: { name: '...', image: '/images/abc.jpg', ... }
📁 File uploaded: undefined (hoặc file info nếu upload)
🖼️ Final image path: /images/abc.jpg
✅ Car data to save: { id: 9, name: '...', image: '/images/abc.jpg', ... }
```

## Nếu vẫn lỗi

### Lỗi: Ảnh vẫn không hiển thị sau khi lưu

**Bước 1**: Kiểm tra console server
```bash
npm start
# Xem log khi submit form
```

**Bước 2**: Kiểm tra cars.json
```bash
# Mở file D:\oto\cars.json
# Tìm xe vừa thêm
# Kiểm tra field "image" có giá trị đúng?
# Có dạng "/images/abc.jpg" (string) không?
```

**Bước 3**: Kiểm tra file ảnh tồn tại
```bash
# Mở folder D:\oto\images
# File có tồn tại không?
# Tên file có đúng?
```

**Bước 4**: Kiểm tra browser console (F12)
```javascript
// Trước khi submit, check giá trị input
console.log(document.getElementById('image').value);
// Phải có giá trị: "/images/abc.jpg"
```

**Bước 5**: Clear cache browser
```
Ctrl + Shift + R (hoặc Ctrl + F5)
```

### Lỗi: Preview không hiển thị khi chọn ảnh

**Nguyên nhân**: JavaScript không chạy hoặc đường dẫn sai

**Giải pháp**:
```javascript
// F12 Console, test thử:
selectImage('/images/banner-1.jpg', document.querySelector('.gallery-item'));

// Hoặc:
previewImage('/images/banner-1.jpg');

// Nếu lỗi "function not defined" -> JavaScript chưa load
```

### Lỗi: Submit form nhưng không redirect

**Nguyên nhân**: Có lỗi trong quá trình lưu

**Giải pháp**:
1. Xem console server có error?
2. Kiểm tra quyền ghi file cars.json
3. Restart server: `Ctrl + C` rồi `npm start`

## Checklist sau khi sửa lỗi

- [ ] Restart server (`npm start`)
- [ ] Clear cache browser (Ctrl + Shift + R)
- [ ] Test thêm xe mới với 3 cách chọn ảnh
- [ ] Test sửa xe và đổi ảnh
- [ ] Kiểm tra ảnh hiển thị trong `/admin/cars`
- [ ] Kiểm tra ảnh hiển thị ở trang chủ `/`
- [ ] Xóa log debug nếu không cần (các `console.log` trong server.js)

## Cập nhật code

Files đã được sửa:
1. ✅ `views/admin-car-add.ejs` - Sửa input URL
2. ✅ `views/admin-car-edit.ejs` - Sửa input URL
3. ✅ `server.js` - Validation image path + debug logs
4. ✅ `cars.json` - Fix xe id=1 image array

Backup trước khi test:
```bash
# Copy cars.json
copy cars.json cars.json.backup

# Nếu có lỗi, restore:
copy cars.json.backup cars.json
```
