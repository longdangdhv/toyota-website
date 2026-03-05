# 🔍 DEBUG: ẢNH ĐÃ CHỌN = 0

## Các bước debug

### 1. Mở trang sửa xe
```
http://localhost:3000/admin/cars/edit/1
```

### 2. Mở F12 Console và xem logs

Khi trang load, phải thấy:
```javascript
🔍 Loaded images: ["/images/vios.jpg"]
⭐ Main image: /images/vios.jpg
📊 Updating display. Count: 1
✅ Display updated
💾 Updated images input: /images/vios.jpg
⭐ Updated mainImage input: /images/vios.jpg
```

### 3. Nếu KHÔNG thấy logs

**Problem 1**: JavaScript không chạy
```javascript
// Test trong Console:
console.log(typeof selectedImagesList);
// Phải in: "object"

console.log(selectedImagesList);
// Phải in: Array ["/images/vios.jpg"]
```

**Problem 2**: EJS không render đúng
```javascript
// View page source (Ctrl+U), tìm dòng:
let selectedImagesList = [];

// Phải thấy ngay sau đó:
selectedImagesList = ["/images/vios.jpg"];
```

### 4. Nếu thấy logs nhưng UI không update

**Check element tồn tại:**
```javascript
console.log(document.getElementById('selectedImages'));
// Phải khác null

console.log(document.getElementById('imageCount'));
// Phải khác null
```

**Check innerHTML:**
```javascript
console.log(document.getElementById('selectedImages').innerHTML);
// Phải chứa <div class="selected-image-item">
```

### 5. Test thủ công

```javascript
// Trong Console, chạy:
selectedImagesList = ["/images/banner-1.jpg", "/images/banner-2.jpg"];
mainImagePath = "/images/banner-1.jpg";
updateSelectedImagesDisplay();
updateHiddenInputs();

// Kiểm tra UI có cập nhật?
```

### 6. Kiểm tra database

```javascript
// Server console khi load trang edit, phải thấy xe có images:
{
  id: 1,
  name: "Toyota Vios",
  image: "/images/vios.jpg",
  images: ["/images/vios.jpg"]  // ← Phải có array này
}
```

### 7. Kiểm tra hidden inputs

```javascript
// Trong Console:
console.log(document.getElementById('images').value);
// Phải in: "/images/vios.jpg"

console.log(document.getElementById('mainImage').value);
// Phải in: "/images/vios.jpg"
```

### 8. Test flow hoàn chỉnh

```
1. Load trang → Xem Console logs
2. Click ảnh trong gallery → Số đếm tăng?
3. Xóa ảnh → Số đếm giảm?
4. Submit form → Xem Server console
5. Reload trang → Ảnh vẫn còn?
```

## Các lỗi thường gặp

### Lỗi: "selectedImagesList is not defined"
→ Script chưa load hoặc có lỗi syntax

### Lỗi: "Cannot read property 'textContent' of null"
→ Element #imageCount không tồn tại trong HTML

### Lỗi: Images = []  (array rỗng)
→ EJS không render đúng car.images

### Lỗi: Images = [""] (array có string rỗng)
→ Database có ảnh rỗng, cần filter

## Fix nhanh

### Fix 1: Reload hard
```
Ctrl + Shift + R
```

### Fix 2: Clear console và reload
```javascript
console.clear();
location.reload();
```

### Fix 3: Force update UI
```javascript
// Chạy trong Console sau khi trang load:
if (typeof updateSelectedImagesDisplay === 'function') {
  console.log('Function exists');
  updateSelectedImagesDisplay();
} else {
  console.error('Function NOT exists');
}
```

### Fix 4: Kiểm tra xe trong database
```bash
# Mở cars.json, tìm xe id=1
# Phải có:
"image": "/images/vios.jpg",
"images": ["/images/vios.jpg"]
```

## Test script nhanh

Copy paste vào Console để test:

```javascript
// Test 1: Check biến tồn tại
console.log('selectedImagesList:', selectedImagesList);
console.log('mainImagePath:', mainImagePath);

// Test 2: Set thủ công
selectedImagesList = ['/images/banner-1.jpg', '/images/banner-2.jpg'];
mainImagePath = '/images/banner-1.jpg';

// Test 3: Update UI
updateSelectedImagesDisplay();
updateHiddenInputs();

// Test 4: Check kết quả
console.log('Count:', document.getElementById('imageCount').textContent);
console.log('HTML:', document.getElementById('selectedImages').innerHTML.substring(0, 100));
```

## Kết luận

Nếu sau các bước trên vẫn "Ảnh đã chọn = 0", có 3 khả năng:

1. **JavaScript không chạy** → Xem Console có lỗi
2. **Database không có images** → Kiểm tra cars.json
3. **EJS render sai** → View page source kiểm tra

Chạy các test trên và báo kết quả để fix tiếp!
