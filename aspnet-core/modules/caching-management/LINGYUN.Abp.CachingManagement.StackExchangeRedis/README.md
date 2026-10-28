# LINGYUN.Abp.CachingManagement.StackExchangeRedis

Mô-đun triển khai quản lý bộ nhớ đệm dựa trên StackExchange.Redis.

## Tính năng

* Triển khai giao diện `ICacheManager`, cung cấp chức năng quản lý bộ nhớ đệm dựa trên Redis:
  * Lấy danh sách khóa bộ nhớ đệm (hỗ trợ khớp tiền tố và lọc)
  * Lấy giá trị bộ nhớ đệm
  * Đặt giá trị bộ nhớ đệm (hỗ trợ thời gian hết hạn tuyệt đối và thời gian hết hạn trượt)
  * Làm mới bộ nhớ đệm
  * Xóa bộ nhớ đệm

## Cài đặt

```bash
abp add-module LINGYUN.Abp.CachingManagement
```

## Cấu hình sử dụng

1. Trước tiên cần cấu hình chuỗi kết nối Redis, thêm vào `appsettings.json`:

```json
{
  "Redis": {
    "Configuration": "127.0.0.1:6379"
  }
}
```

2. Thêm đoạn mã sau vào phương thức `ConfigureServices` của mô-đun:

```csharp
Configure<RedisCacheOptions>(options =>
{
    // Tùy chọn: cấu hình tiền tố tên phiên bản Redis
    options.InstanceName = "MyApp:";
});

Configure<AbpDistributedCacheOptions>(options =>
{
    // Tùy chọn: cấu hình tiền tố khóa bộ nhớ đệm
    options.KeyPrefix = "MyApp:";
});
```

## Hỗ trợ đa thuê bao

Mô-đun tích hợp sẵn hỗ trợ đa thuê bao, sẽ tự động tách biệt dữ liệu bộ nhớ đệm theo ID thuê bao hiện tại:
* Định dạng khóa khi có thuê bao: `{InstanceName}t:{TenantId}:{KeyPrefix}:{Key}`
* Định dạng khóa khi không có thuê bao: `{InstanceName}c:{KeyPrefix}:{Key}`

## Thêm

Để biết thêm thông tin, hãy tham khảo các tài nguyên sau:

* [Triển khai dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application/README.md)
* [Hợp đồng dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application.Contracts/README.md)
* [HTTP API](../LINGYUN.Abp.CachingManagement.HttpApi/README.md)
* [Tầng miền](../LINGYUN.Abp.CachingManagement.Domain/README.md)
