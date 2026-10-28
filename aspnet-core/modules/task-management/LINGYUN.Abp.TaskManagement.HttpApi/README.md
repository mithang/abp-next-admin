# LINGYUN.Abp.TaskManagement.HttpApi

Triển khai HTTP API của mô-đun quản lý tác vụ, cung cấp các giao diện RESTful để quản lý tác vụ nền.

## Tính năng

### API thông tin tác vụ nền
- Thao tác CRUD:
  - Tạo tác vụ mới
  - Lấy chi tiết tác vụ
  - Cập nhật thuộc tính tác vụ
  - Xóa tác vụ
- Thao tác điều khiển tác vụ:
  - Khởi động tác vụ
  - Dừng tác vụ
  - Tạm dừng tác vụ
  - Tiếp tục tác vụ
  - Kích hoạt tác vụ
- Thao tác hàng loạt:
  - Khởi động hàng loạt
  - Dừng hàng loạt
  - Tạm dừng hàng loạt
  - Tiếp tục hàng loạt
  - Kích hoạt hàng loạt
  - Xóa hàng loạt
- Thao tác truy vấn:
  - Lấy danh sách tác vụ phân trang
  - Lấy định nghĩa tác vụ
  - Lọc và sắp xếp tác vụ

### API hành vi tác vụ nền
- Quản lý hành vi:
  - Thêm hành vi cho tác vụ
  - Cập nhật thuộc tính hành vi
  - Xóa hành vi
  - Lấy danh sách hành vi
- Định nghĩa hành vi:
  - Lấy các định nghĩa hành vi khả dụng
  - Truy vấn định nghĩa hành vi

### API nhật ký tác vụ nền
- Thao tác nhật ký:
  - Lấy chi tiết nhật ký
  - Lấy danh sách nhật ký phân trang
  - Xóa nhật ký
- Lọc nhật ký:
  - Lọc theo tác vụ
  - Lọc theo khoảng thời gian
  - Lọc theo trạng thái

### Phân quyền
- Kiểm soát truy cập dựa trên quyền:
  - Quyền tạo tác vụ
  - Quyền cập nhật tác vụ
  - Quyền xóa tác vụ
  - Quyền kích hoạt tác vụ
  - Quyền tạm dừng tác vụ
  - Quyền tiếp tục tác vụ
  - Quyền khởi động tác vụ
  - Quyền dừng tác vụ
  - Quyền xóa nhật ký

### Đặc tính API
- Giao diện RESTful
- Thao tác dựa trên phương thức HTTP
- Kiểm soát phiên bản API dựa trên route
- Định dạng phản hồi chuẩn hóa
- Hỗ trợ phân trang
- Lọc và sắp xếp động

### Bản địa hóa
- Hỗ trợ đa ngôn ngữ
- Thông báo lỗi đã bản địa hóa
- Thông báo kiểm tra hợp lệ đã bản địa hóa

### Tích hợp
- Tích hợp với framework ABP
- Tích hợp MVC
- Hỗ trợ truy vấn động
- Hỗ trợ kiểm tra hợp lệ
