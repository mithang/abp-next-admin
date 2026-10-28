# LINGYUN.Abp.TaskManagement.HttpApi.Client

Triển khai client HTTP API của mô-đun quản lý tác vụ, cung cấp dịch vụ proxy client để gọi API từ xa.

## Tính năng

### Proxy client HTTP
- Tự động tạo proxy cho hợp đồng ứng dụng
- Giao diện client an toàn về kiểu
- DTO kiểu mạnh

### Cấu hình dịch vụ từ xa
- Cấu hình tên dịch vụ từ xa
- Cấu hình endpoint dịch vụ
- Cấu hình tùy chọn client

### Xác thực danh tính
- Hỗ trợ xác thực danh tính dựa trên token
- Xử lý header xác thực
- Giao tiếp an toàn

### Tích hợp dịch vụ
- Tích hợp liền mạch với framework ABP
- Cấu hình client HTTP động
- Tự động đăng ký dịch vụ

### Xử lý lỗi
- Chuyển đổi ngoại lệ
- Xử lý phản hồi lỗi
- Chiến lược thử lại

### Tính năng client
- Thao tác bất đồng bộ
- Bộ chặn request/response
- Tự động thương lượng nội dung

### Dependency injection
- Tự động đăng ký dependency
- Vòng đời dịch vụ theo scope
- Phân giải dịch vụ

### Cấu hình mô-đun
- Quản lý dependency của mô-đun
- Cấu hình dịch vụ
- Cấu hình proxy client
