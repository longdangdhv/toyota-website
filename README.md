# Website Quản Lý Sản Phẩm Ô Tô Toyota

Website bán xe Toyota tương tự Toyota Long Biên với đầy đủ tính năng quản lý sản phẩm, tin tức, khuyến mãi.

## 🚀 Tính Năng

✅ **Trang chủ** - Banner hero, sản phẩm nổi bật, tin tức, khuyến mãi  
✅ **Danh sách sản phẩm** - Hiển thị tất cả xe, filter theo danh mục  
✅ **Chi tiết sản phẩm** - Thông số kỹ thuật, tính năng, giá các phiên bản  
✅ **Đăng ký lái thử** - Form đăng ký trải nghiệm xe miễn phí  
✅ **Tư vấn trả góp** - Calculator tính toán trả góp, form tư vấn  
✅ **Tin tức** - Danh sách và chi tiết tin tức  
✅ **Khuyến mãi** - Các chương trình ưu đãi đặc biệt  
✅ **Liên hệ** - Thông tin showroom, form liên hệ  

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **Template Engine**: EJS
- **CSS Framework**: Tailwind CSS
- **Database**: JSON files (dữ liệu cứng)
- **No dependencies**: Không cần database, không cần admin panel

## 📦 Cài Đặt

```bash
# Cài đặt dependencies
npm install

# Chạy server
npm start

# Truy cập website
http://localhost:3000
```

## 📁 Cấu Trúc Thư Mục

```
toyota-oto-website/
├── server.js              # Express server
├── package.json           # Dependencies
├── cars.json             # Dữ liệu xe
├── news.json             # Dữ liệu tin tức
├── promotions.json       # Dữ liệu khuyến mãi
├── public/
│   └── css/
│       └── style.css     # Custom CSS
├── index.ejs             # Trang chủ
├── products.ejs          # Danh sách sản phẩm
├── product-detail.ejs    # Chi tiết sản phẩm
├── test-drive.ejs        # Đăng ký lái thử
├── installment.ejs       # Tư vấn trả góp
├── news.ejs              # Danh sách tin tức
├── news-detail.ejs       # Chi tiết tin tức
├── promotions.ejs        # Khuyến mãi
└── contact.ejs           # Liên hệ
```

## 🎨 Tùy Chỉnh Dữ Liệu

### Thêm/Sửa Xe (cars.json)
```json
{
  "id": 9,
  "name": "Toyota Innova Cross",
  "slug": "innova-cross",
  "tagline": "MPV cao cấp",
  "price": "810.000.000",
  "priceRange": "810 - 990 triệu VNĐ",
  "featured": true,
  "category": "MPV",
  "specs": { ... },
  "features": [ ... ],
  "versions": [ ... ]
}
```

### Thêm Tin Tức (news.json)
```json
{
  "id": 6,
  "title": "Tiêu đề tin tức",
  "summary": "Tóm tắt ngắn",
  "date": "2024-03-02",
  "category": "Danh mục",
  "content": "Nội dung chi tiết..."
}
```

### Thêm Khuyến Mãi (promotions.json)
```json
{
  "id": 4,
  "title": "Tên chương trình",
  "description": "Mô tả ngắn",
  "validUntil": "2024-12-31",
  "highlight": true,
  "details": ["Ưu đãi 1", "Ưu đãi 2"],
  "applicableCars": ["Tất cả dòng xe"]
}
```

## 🌐 Routes

- `/` - Trang chủ
- `/san-pham` - Danh sách sản phẩm
- `/san-pham/:slug` - Chi tiết sản phẩm
- `/tin-tuc` - Tin tức
- `/tin-tuc/:id` - Chi tiết tin tức
- `/khuyen-mai` - Khuyến mãi
- `/dang-ky-lai-thu` - Đăng ký lái thử
- `/tra-gop` - Tư vấn trả góp
- `/lien-he` - Liên hệ

## 📞 API Endpoints

- `POST /api/test-drive` - Đăng ký lái thử
- `POST /api/quote` - Yêu cầu báo giá
- `POST /api/contact` - Gửi tin nhắn liên hệ

## 📝 Ghi Chú

- Dữ liệu lưu trữ trong file JSON (dữ liệu cứng)
- Không cần database hoặc admin panel
- Form submission chỉ log ra console (có thể tích hợp email/SMS)
- Hình ảnh placeholder (có thể thay bằng hình ảnh thật)
- Responsive design cho mobile và desktop

## 🎯 Mở Rộng (Tùy Chọn)

- Tích hợp email service (Nodemailer, SendGrid)
- Thêm Google Maps cho showroom
- Tích hợp chatbot Zalo/Facebook
- Thêm Google Analytics
- SEO optimization
- Thêm hình ảnh thật cho sản phẩm

## 📄 License

ISC

---

**Hotline**: 098 888 8888  
**Email**: info@toyota.vn  
**Website**: http://localhost:3000
