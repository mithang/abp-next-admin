# LINGYUN.Abp.TaskManagement.EntityFrameworkCore

Triển khai Entity Framework Core của mô-đun quản lý tác vụ, cung cấp truy cập cơ sở dữ liệu và lưu trữ bền vững.

## Tính năng

### Ngữ cảnh cơ sở dữ liệu
- TaskManagementDbContext dùng để quản lý các thao tác cơ sở dữ liệu
- Tiền tố bảng và lược đồ có thể cấu hình
- Hỗ trợ đa thuê bao

### Cấu hình thực thể
- Thông tin tác vụ nền:
  - Tên bảng: {prefix}BackgroundJobs
  - Tạo chỉ mục trên Name và Group
  - Thuộc tính có ràng buộc độ dài
  - Hỗ trợ thuộc tính mở rộng
- Nhật ký tác vụ nền:
  - Tên bảng: {prefix}BackgroundJobLogs
  - Tạo chỉ mục trên JobGroup và JobName
  - Thuộc tính có ràng buộc độ dài
- Hành vi tác vụ nền:
  - Tên bảng: {prefix}BackgroundJobActions
  - Tạo chỉ mục trên Name
  - Hỗ trợ thuộc tính mở rộng cho tham số

### Triển khai kho lưu trữ
- Kho lưu trữ thông tin tác vụ nền:
  - Các thao tác CRUD
  - Quản lý trạng thái tác vụ
  - Lọc và truy vấn tác vụ
  - Hỗ trợ hết hạn tác vụ
  - Quản lý danh sách tác vụ đang chờ
  - Quản lý tác vụ định kỳ
- Kho lưu trữ nhật ký tác vụ nền:
  - Lưu trữ và truy xuất nhật ký
  - Lọc và truy vấn nhật ký
  - Hỗ trợ phân trang
- Kho lưu trữ hành vi tác vụ nền:
  - Lưu trữ và truy xuất hành vi
  - Quản lý tham số

### Chức năng truy vấn
- Sắp xếp động
- Phân trang
- Lọc theo đặc tả
- Thao tác bất đồng bộ
- Truy vấn không theo dõi cho thao tác chỉ đọc

### Tối ưu hiệu năng
- Chỉ mục hiệu quả
- Hỗ trợ thao tác hàng loạt
- Truy vấn tối ưu theo trạng thái tác vụ

### Hỗ trợ đa thuê bao
- Cô lập dữ liệu theo từng thuê bao
- Thao tác xuyên thuê bao
- Kho lưu trữ nhận biết thuê bao

### Tính năng tích hợp
- Tích hợp ABP Framework
- Quy ước của Entity Framework Core
- Bộ chuyển đổi giá trị cho kiểu phức tạp
- Hỗ trợ thuộc tính mở rộng
