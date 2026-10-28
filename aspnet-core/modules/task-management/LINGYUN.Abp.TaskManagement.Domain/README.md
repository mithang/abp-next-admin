# LINGYUN.Abp.TaskManagement.Domain

Mô-đun miền quản lý tác vụ, triển khai logic nghiệp vụ cốt lõi và mô hình miền.

## Tính năng

### Quản lý công việc nền
- Quản lý vòng đời công việc (tạo, cập nhật, xóa)
- Điều khiển trạng thái công việc (khởi động, dừng, tạm dừng, khôi phục, kích hoạt)
- Hỗ trợ các loại công việc khác nhau:
  - Công việc một lần
  - Công việc định kỳ (dùng biểu thức cron)
  - Công việc liên tục (dùng khoảng thời gian)

### Lưu trữ công việc
- Lưu trữ thông tin công việc và trạng thái thực thi
- Theo dõi lịch sử thực thi công việc
- Dọn dẹp công việc đã hết hạn
- Hỗ trợ đa tenant

### Đồng bộ công việc
- Đồng bộ trạng thái công việc trong hệ thống phân tán
- Xử lý sự kiện tạo, cập nhật và xóa công việc
- Duy trì tính nhất quán của hàng đợi công việc

### Hành vi công việc
- Quản lý các hành vi liên quan đến công việc
- Lưu trữ tham số hành vi
- Bật/tắt hành vi

### Lọc và đặc tả công việc
- Lọc công việc theo nhiều điều kiện:
  - Loại
  - Nhóm
  - Tên
  - Trạng thái
  - Mức ưu tiên
  - Nguồn
  - Thời gian tạo
  - Thời gian chạy lần cuối
- Hỗ trợ truy vấn công việc phức tạp

### Nhật ký công việc
- Ghi lại chi tiết thực thi công việc
- Theo dõi kết quả thực thi và ngoại lệ
- Hỗ trợ ghi nhật ký đa tenant

### Sự kiện miền
- Sự kiện thay đổi trạng thái công việc
- Sự kiện thực thi công việc
- Xử lý sự kiện phân tán

### Quản lý mức ưu tiên công việc
- Hỗ trợ nhiều mức ưu tiên:
  - Thấp
  - Dưới mức bình thường
  - Bình thường
  - Trên mức bình thường
  - Cao

### Quản lý nguồn công việc
- Hỗ trợ các nguồn công việc khác nhau:
  - Công việc của người dùng
  - Công việc hệ thống

### Hỗ trợ đa tenant
- Quản lý công việc riêng theo tenant
- Thao tác công việc xuyên tenant
- Cô lập tenant trong quá trình thực thi công việc

### Dịch vụ miền
- Trình quản lý công việc nền
- Dịch vụ lưu trữ công việc
- Dịch vụ hành vi công việc
- Dịch vụ nhật ký công việc
