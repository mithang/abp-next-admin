# Tổng quan module common

## Giới thiệu module
Module `common` là module nền tảng của framework ABP, cung cấp một loạt chức năng và dịch vụ chung, nhằm hỗ trợ việc phát triển và mở rộng các loại ứng dụng. Module này bao gồm nhiều module con, mỗi module con triển khai một chức năng cụ thể, giúp nhà phát triển nhanh chóng xây dựng các ứng dụng hiệu quả.

## Danh sách các dự án được bao gồm
1. **LINGYUN.Abp.Aliyun.Authorization**
   - Cung cấp chức năng xác thực cơ bản của Alibaba Cloud, hỗ trợ cấu hình AppKeyId và AccessKeySecret.

2. **LINGYUN.Abp.AspNetCore.HttpOverrides**
   - Triển khai việc ghi đè tiêu đề truyền tải HTTP, hỗ trợ lấy địa chỉ khách hàng thực trong proxy ngược.

3. **LINGYUN.Abp.AspNetCore.Mvc.Client**
   - Cung cấp thời gian bộ nhớ đệm cấu hình người dùng có thể cấu hình, hỗ trợ giao diện đa tenant.

4. **LINGYUN.Abp.BackgroundJobs.Hangfire**
   - Module công việc nền triển khai dựa trên Hangfire, hỗ trợ tác vụ tức thời, trì hoãn và định kỳ.

5. **LINGYUN.Abp.ExceptionHandling**
   - Cung cấp cơ chế xử lý ngoại lệ và thông báo thống nhất, hỗ trợ trình xử lý ngoại lệ tùy chỉnh.

6. **LINGYUN.Abp.Location**
   - Cung cấp chức năng mã hóa địa lý, mã hóa địa lý ngược và phân giải vị trí địa lý theo IP.

7. **LINGYUN.Abp.IdGenerator**
   - Triển khai bộ sinh ID duy nhất phân tán, hỗ trợ thuật toán snowflake.

8. **LINGYUN.Abp.Wrapper**
   - Đóng gói thống nhất kết quả trả về và xử lý ngoại lệ của API.

## Tổng quan chức năng chính của từng dự án
- **Module xác thực Alibaba Cloud**: Cung cấp chức năng xác thực của Alibaba Cloud, đơn giản hóa việc truy cập các dịch vụ Alibaba Cloud.
- **Module ghi đè HTTP**: Xử lý tiêu đề trong yêu cầu HTTP, đảm bảo lấy được địa chỉ khách hàng thực.
- **Module MVC client**: Cung cấp bộ nhớ đệm cấu hình người dùng, hỗ trợ kiến trúc đa tenant.
- **Module công việc nền**: Hỗ trợ lập lịch và thực thi tác vụ, đảm bảo độ tin cậy của các tác vụ nền.
- **Module xử lý ngoại lệ**: Xử lý các ngoại lệ trong ứng dụng, cung cấp cơ chế thông báo thống nhất.
- **Module dịch vụ vị trí**: Cung cấp các chức năng liên quan đến vị trí địa lý, hỗ trợ chuyển đổi giữa địa chỉ và tọa độ.
- **Module sinh ID**: Sinh ID duy nhất phân tán, đảm bảo tính duy nhất trong môi trường đồng thời cao.
- **Module wrapper**: Xử lý thống nhất kết quả trả về và ngoại lệ của API, nâng cao tính khả dụng của API.

## Mục đích tổng thể và tầm quan trọng của module
Module `common` cung cấp hạ tầng cho framework ABP, hỗ trợ nhà phát triển nhanh chóng tích hợp các chức năng thường dùng khi xây dựng ứng dụng, giảm công việc lặp lại, nâng cao hiệu quả phát triển. Thông qua các module này, nhà phát triển có thể tập trung hơn vào việc triển khai logic nghiệp vụ, mà không cần lo lắng về các chi tiết triển khai ở tầng dưới.

## Hướng dẫn ngắn gọn về cách sử dụng hoặc tích hợp module
Khi sử dụng module `common` trong dự án, chỉ cần thêm dependency tương ứng vào lớp module, và thực hiện cấu hình cần thiết trong phương thức `ConfigureServices`. Ví dụ:

```csharp
[DependsOn(typeof(LINGYUN.Abp.Aliyun.Authorization))]
public class YourProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Cấu hình dịch vụ
    }
}
```

## Ghi chú
README trong dự án này được tạo tự động bởi mô hình AI sau khi phân tích logic code, nếu có sai sót, vui lòng tạo issue hoặc PR.
