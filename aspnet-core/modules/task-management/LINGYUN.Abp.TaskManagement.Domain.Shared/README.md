# LINGYUN.Abp.TaskManagement.Domain.Shared

Module chia sẻ miền quản lý tác vụ, chứa các mô hình miền, enum và hằng số dùng chung.

## Tính năng

### Quản lý quyền
- Quyền nền tảng lập lịch tác vụ
- Quyền công việc nền
- Quyền hành vi công việc
- Quyền nhật ký công việc

### Loại và trạng thái công việc
- Loại công việc:
  - Công việc một lần (chỉ thực thi một lần)
  - Công việc định kỳ (chạy định kỳ theo điều kiện cho trước)
  - Công việc liên tục (chạy lặp lại theo điều kiện cho trước)
- Trạng thái công việc:
  - Chưa xác định
  - Đã hoàn thành
  - Đang chạy
  - Trong hàng đợi
  - Đã tạm dừng
  - Thử lại sau thất bại
  - Đã dừng

### Mức ưu tiên
- Thấp
- Thấp hơn bình thường
- Bình thường
- Cao hơn bình thường
- Cao

### Thuộc tính công việc
- Thông tin cơ bản:
  - Nhóm
  - Tên
  - Mô tả
  - Loại
  - Trạng thái
  - Thời gian bắt đầu/kết thúc
- Cài đặt thực thi:
  - Khoảng thời gian (giây)
  - Biểu thức Cron
  - Thời gian chờ khóa
  - Mức ưu tiên
  - Số lần kích hoạt tối đa
  - Số lần thử lại tối đa
- Thông tin theo dõi:
  - Thời gian tạo
  - Thời gian thực thi lần cuối
  - Thời gian dự kiến lần tới
  - Số lần kích hoạt
  - Số lần thử
  - Kết quả thực thi

### Bản địa hóa
- Hỗ trợ đa ngôn ngữ
- Bản địa hóa mã lỗi
- Bản địa hóa văn bản giao diện

### Hỗ trợ đa tenant
- Quản lý tác vụ cấp tenant
- Quản lý tác vụ cấp hệ thống

### Loại nguồn
- Tác vụ của người dùng
- Tác vụ tích hợp sẵn của hệ thống
