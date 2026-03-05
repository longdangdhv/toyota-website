const fs = require('fs');
const path = require('path');

// Đọc file cars.json
const carsFile = path.join(__dirname, 'cars.json');
const cars = JSON.parse(fs.readFileSync(carsFile, 'utf-8'));

// Thêm field images cho mỗi xe nếu chưa có
cars.forEach(car => {
  // Nếu chưa có field images, tạo mới từ image
  if (!car.images) {
    if (car.image) {
      car.images = [car.image];
    } else {
      car.images = [];
      car.image = ''; // Thêm field image rỗng nếu thiếu
    }
  }
  
  // Đảm bảo có field image
  if (!car.image && car.images && car.images.length > 0) {
    car.image = car.images[0];
  }
});

// Lưu lại file
fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2), 'utf-8');

console.log('✅ Đã cập nhật tất cả xe với field images');
console.log(`📊 Tổng số xe: ${cars.length}`);

// Hiển thị kết quả
cars.forEach(car => {
  console.log(`- ${car.name}: ${car.images ? car.images.length : 0} ảnh`);
});
