# Flash Card - Learning Application

A lightweight flashcard web application designed to help users memorize vocabulary, phrases, and concepts through an interactive and user-friendly interface. Built with Flask and vanilla JavaScript, this project provides a simple yet effective learning tool.

## Giới thiệu

- Flask-based web application with clean, responsive interface
- Interactive flashcard system with smooth animations (anime.js)
- Client-side rendering for fast, fluid user experience
- No database required - perfect for static deployment
- Lightweight and easy to deploy

## Công nghệ chính

- Python 3.x + Flask (Backend framework)
- HTML5/CSS3 (Frontend markup & styling)
- Vanilla JavaScript (Interactive logic)
- anime.js (Smooth animations)
- Virtual environment for dependency isolation

## Yêu cầu hệ thống

- Python >= 3.8
- pip >= 20.0
- Virtual environment support (venv or virtualenv)
- Compatible with Windows, macOS, and Linux

## Thiết lập môi trường

1. Clone repository:

   ```bash
   git clone https://github.com/Kirizakuga/flash-card.git
   cd flash-card
   ```

   Hoặc tải phiên bản release trực tiếp từ GitHub.

2. Tạo và kích hoạt môi trường ảo:

   **Windows:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Cài đặt các thư viện phụ thuộc:

   ```bash
   pip install -r requirements.txt
   ```

   **Lưu ý:** Nếu gặp lỗi khi chạy dự án do xung đột phiên bản thư viện, hãy cập nhật các phiên bản trong file `requirements.txt` thủ công và chạy lại lệnh `pip install`. Từ đó mọi thứ sẽ hoạt động ổn định. Nếu vẫn gặp vấn đề, bạn có thể liên hệ tác giả hoặc tự khắc phục (tác giả khuyến nghị lựa chọn thứ hai).

## Chạy ứng dụng

| Lệnh              | Mô tả                                   |
| ----------------- | ---------------------------------------- |
| `python app.py`   | Khởi chạy Flask development server.     |
| `flask run`       | Chạy ứng dụng Flask (alternative).      |

Sau khi khởi chạy, truy cập `http://localhost:5000` (hoặc port được chỉ định) để sử dụng ứng dụng flashcard.

**Lưu ý:** Đối với production deployment, sử dụng WSGI server như Gunicorn hoặc uWSGI thay vì Flask development server.

## Cấu trúc thư mục

```
flash-card/
├── app.py                     # Entry point chính của ứng dụng Flask
├── requirements.txt           # Danh sách thư viện phụ thuộc
├── README.md                  # Tài liệu hướng dẫn
├── .gitattributes             # Cấu hình Git attributes
├── .gitignore                 # Loại trừ file không cần commit
├── .venv/                     # Môi trường ảo Python (không commit)
├── static/                    # Tài nguyên tĩnh (CSS, JS, images)
│   └── js/
│       ├── anime.min.js       # Thư viện animation
│       ├── body.css           # Stylesheet chính
│       └── scripts.js         # JavaScript logic
└── templates/                 # Jinja2 HTML templates
    ├── core.html              # Template cốt lõi/base
    └── index.html             # Trang chủ
```

## Tính năng chính

- **Giao diện tương tác**: Flip animation mượt mà với anime.js
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị (desktop, tablet, mobile)
- **Lightweight**: Không cần database, dễ dàng deploy lên GitHub Pages hoặc Netlify
- **Fast Loading**: Client-side rendering cho trải nghiệm nhanh chóng
- **Clean UI**: Thiết kế tối giản, tập trung vào nội dung học tập
- **Easy Customization**: Code đơn giản, dễ tùy chỉnh và mở rộng

## Hướng dẫn sử dụng

1. Khởi chạy ứng dụng với `python app.py`
2. Mở trình duyệt và truy cập `http://localhost:5000`
3. Tương tác với flashcard bằng cách click để lật thẻ
4. Sử dụng các nút điều hướng để chuyển giữa các thẻ
5. Tùy chỉnh nội dung flashcard bằng cách chỉnh sửa code trong `app.py` hoặc `templates/`

## Kiểm thử & chất lượng mã

| Lệnh                    | Công dụng                                       |
| ----------------------- | ------------------------------------------------ |
| `pylint app.py`         | Kiểm tra chất lượng code Python.                |
| `eslint static/js/`     | Kiểm tra JavaScript code quality.               |
| `black app.py`          | Format Python code theo chuẩn PEP 8.            |

Khuyến nghị chạy `pylint` trước khi commit code.

## Ghi chú triển khai

- Đảm bảo môi trường ảo được kích hoạt trước khi chạy ứng dụng.
- Để deploy lên production, sử dụng WSGI server (Gunicorn) và reverse proxy (Nginx).
- Có thể deploy miễn phí lên:
  - **Render**: Hỗ trợ Flask apps với free tier
  - **Railway**: Deploy nhanh với Python support
  - **PythonAnywhere**: Hosting Python web apps miễn phí
  - **Vercel/Netlify**: Nếu convert sang static site
- Với các vấn đề về phiên bản thư viện, ưu tiên cập nhật `requirements.txt` thay vì downgrade Python.

## Định hướng mở rộng

- [ ] Thêm backend API để lưu trữ flashcard động
- [ ] Tích hợp database (SQLite hoặc PostgreSQL) cho persistent storage
- [ ] Hỗ trợ nhiều bộ flashcard và chuyển đổi giữa các bộ
- [ ] Thêm chế độ quiz/test mode
- [ ] Progress tracking và statistics
- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App) support để hoạt động offline
- [ ] Import/Export flashcard từ JSON/CSV
- [ ] User authentication và personal deck management
- [ ] Spaced repetition algorithm cho ôn tập hiệu quả

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## Liên hệ

- GitHub: [@Kirizakuga](https://github.com/Kirizakuga)
- Repository: [https://github.com/Kirizakuga/flash-card](https://github.com/Kirizakuga/flash-card)

## Acknowledgments

- Cảm ơn cộng đồng Python và các thư viện open-source đã hỗ trợ dự án này
- Lấy cảm hứng từ các ứng dụng flashcard phổ biến như Anki và Quizlet
- Đặc biệt cảm ơn các contributor đã đóng góp vào dự án

---

**Note:** Nếu bạn thích dự án này, hãy cho một ⭐ trên GitHub để ủng hộ tác giả!