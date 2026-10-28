# LINGYUN.Abp.TaskManagement.Application.Contracts

Hợp đồng ứng dụng của mô-đun quản lý tác vụ, định nghĩa giao diện dịch vụ ứng dụng và DTO.

## Chức năng

### Giao diện dịch vụ ứng dụng
- Dịch vụ thông tin tác vụ nền:
  - Thao tác CRUD
  - Thao tác điều khiển tác vụ
  - Thao tác hàng loạt
  - Thao tác truy vấn
- Dịch vụ hành vi tác vụ nền:
  - Quản lý hành vi
  - Định nghĩa hành vi
  - Xử lý tham số
- Dịch vụ nhật ký tác vụ nền:
  - Truy xuất nhật ký
  - Lọc nhật ký
  - Xóa nhật ký

### Đối tượng truyền dữ liệu (DTOs)
- DTOs thông tin tác vụ nền:
  - DTO thông tin tác vụ
  - DTO tạo tác vụ
  - DTO cập nhật tác vụ
  - DTO danh sách tác vụ
  - DTO đầu vào hàng loạt tác vụ
- DTOs hành vi tác vụ nền:
  - DTO hành vi
  - DTO tạo hành vi
  - DTO cập nhật hành vi
  - DTO định nghĩa hành vi
  - DTO tham số hành vi
- DTOs nhật ký tác vụ nền:
  - DTO nhật ký
  - DTO danh sách nhật ký
  - DTO lọc nhật ký

### Quyền
- Tác vụ nền:
  - Quyền tạo
  - Quyền cập nhật
  - Quyền xóa
  - Quyền kích hoạt
  - Quyền tạm dừng
  - Quyền khôi phục
  - Quyền khởi động
  - Quyền dừng
- Nhật ký tác vụ nền:
  - Quyền xem
  - Quyền xóa

### Cấu hình dịch vụ từ xa
- Hằng số tên dịch vụ
- Cấu hình điểm cuối dịch vụ
- Cài đặt proxy client

### Xác thực
- Xác thực đầu vào
- Chú thích dữ liệu
- Quy tắc xác thực tùy chỉnh

### Chức năng tích hợp
- Tích hợp framework ABP
- Hỗ trợ truy vấn động
- Trừu tượng tầng dịch vụ ứng dụng

### Cấu hình mô-đun
- Phụ thuộc mô-đun
- Đăng ký dịch vụ
- Quản lý tính năng
