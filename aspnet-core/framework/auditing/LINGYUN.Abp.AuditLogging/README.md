# LINGYUN.Abp.AuditLogging

Mô-đun lõi nhật ký kiểm toán, cung cấp chức năng cơ bản và định nghĩa giao diện cho nhật ký kiểm toán.

[English](./README.EN.md)

## Tính năng

* Hạ tầng nhật ký kiểm toán
* Định nghĩa giao diện kho lưu trữ nhật ký kiểm toán
* Định nghĩa giao diện trình quản lý nhật ký kiểm toán
* Hỗ trợ bỏ qua việc ghi nhật ký kiểm toán của một số loại nhất định

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAuditLoggingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Auditing": {
    "IsEnabled": true,  // Có bật nhật ký kiểm toán hay không
    "HideErrors": true, // Có ẩn thông tin lỗi hay không
    "IsEnabledForAnonymousUsers": true, // Có bật nhật ký kiểm toán cho người dùng ẩn danh hay không
    "IsEnabledForGetRequests": false,   // Có bật nhật ký kiểm toán cho yêu cầu GET hay không
    "ApplicationName": null  // Tên ứng dụng
  }
}
```

## Cách dùng cơ bản

1. Tham chiếu mô-đun
2. Cấu hình tùy chọn nhật ký kiểm toán
3. Triển khai nhà cung cấp lưu trữ nhật ký kiểm toán (ví dụ: EntityFrameworkCore hoặc Elasticsearch)

## Tính năng nâng cao

### Bỏ qua một số loại nhất định

Theo mặc định, mô-đun sẽ bỏ qua nhật ký kiểm toán của các loại sau:
* CancellationToken
* CancellationTokenSource

Bạn có thể thêm các loại cần bỏ qua khác thông qua cấu hình:

```csharp
Configure<AbpAuditingOptions>(options =>
{
    options.IgnoredTypes.AddIfNotContains(typeof(YourType));
});
```
