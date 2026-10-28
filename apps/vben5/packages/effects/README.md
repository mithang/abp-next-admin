## Thư mục Effects

Thư mục `effects` chuyên dùng để lưu trữ code và logic liên quan đến coupling nhẹ. Nếu package của bạn có các đặc điểm sau, nên đặt nó trong thư mục `effects`:

- **Quản lý trạng thái**: sử dụng framework quản lý trạng thái `pinia`, và bao gồm phần xử lý side effect (như thao tác bất đồng bộ, gọi API).
- **Cài đặt tùy chọn người dùng**: sử dụng `@vben-core/preferences` để xử lý cài đặt tùy chọn người dùng, liên quan đến logic lưu trữ cục bộ hoặc bộ nhớ đệm trình duyệt (như sử dụng `localStorage`).
- **Điều hướng và routing**: xử lý các kịch bản điều hướng, chuyển trang, cần quản lý logic thay đổi route.
- **Phụ thuộc thư viện component**: bao gồm phần coupling chặt chẽ với thư viện component cụ thể hoặc phụ thuộc vào kho lớn.

Bằng cách phân loại code liên quan vào thư mục `effects`, cấu trúc dự án có thể rõ ràng hơn, thuận tiện cho việc bảo trì và mở rộng.
