# Tổng quan mô-đun LINGYUN.Abp.Tencent

## Giới thiệu
Mô-đun LINGYUN.Abp.Tencent tích hợp các dịch vụ của Tencent Cloud, cung cấp hỗ trợ toàn diện cho các dịch vụ Tencent Cloud, bao gồm lưu trữ đối tượng, dịch vụ SMS, QQ Connect và tổng hợp giọng nói.

## Danh sách các dự án bao gồm
- **LINGYUN.Abp.Tencent**
- **LINGYUN.Abp.BlobStoring.Tencent**
- **LINGYUN.Abp.Sms.Tencent**
- **LINGYUN.Abp.Tencent.QQ**
- **LINGYUN.Abp.Tencent.SettingManagement**
- **LINGYUN.Abp.Tencent.TTS**

## Tổng quan chức năng chính của từng dự án

### LINGYUN.Abp.Tencent
- Cung cấp factory client SDK của Tencent Cloud, hỗ trợ tạo động client cho từng dịch vụ Tencent Cloud.
- Hỗ trợ cấu hình đa tenant và bản địa hóa đa ngôn ngữ.
- Cung cấp quản lý cấu hình thống nhất cho các dịch vụ Tencent Cloud.

### LINGYUN.Abp.BlobStoring.Tencent
- Hỗ trợ dịch vụ lưu trữ đối tượng của Tencent Cloud, tự động tạo bucket lưu trữ.
- Hỗ trợ cấu hình đa vùng và giới hạn kích thước tệp.

### LINGYUN.Abp.Sms.Tencent
- Hỗ trợ chức năng gửi của dịch vụ SMS Tencent Cloud, hỗ trợ gửi hàng loạt cho nhiều số điện thoại.
- Tích hợp sẵn xử lý lỗi và ghi nhật ký.

### LINGYUN.Abp.Tencent.QQ
- Hỗ trợ đăng nhập nhanh bằng QQ Connect, hỗ trợ cấu hình đa tenant.

### LINGYUN.Abp.Tencent.SettingManagement
- Cung cấp giao diện quản lý cấu hình cho các dịch vụ Tencent Cloud, hỗ trợ quản lý cấu hình ở cấp toàn cục và cấp tenant.

### LINGYUN.Abp.Tencent.TTS
- Hỗ trợ dịch vụ tổng hợp giọng nói của Tencent Cloud, cung cấp factory client TTS.

## Mục đích tổng thể và tầm quan trọng của mô-đun
Mô-đun này mang đến cho nhà phát triển khả năng tích hợp liền mạch với các dịch vụ Tencent Cloud, đơn giản hóa việc sử dụng và quản lý dịch vụ đám mây, đồng thời nâng cao tính linh hoạt và khả năng mở rộng của ứng dụng.

## Cách sử dụng hoặc tích hợp mô-đun này
Tham chiếu mô-đun tương ứng trong dự án và cấu hình các tham số liên quan của Tencent Cloud theo nhu cầu. Đảm bảo phối hợp với các mô-đun khác của khung ABP để đạt hiệu quả tốt nhất.
