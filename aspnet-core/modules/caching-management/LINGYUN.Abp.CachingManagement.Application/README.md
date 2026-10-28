# LINGYUN.Abp.CachingManagement.Application

Triển khai của mô-đun dịch vụ ứng dụng quản lý bộ nhớ đệm.

## Chức năng

* Đã triển khai giao diện `ICacheAppService`, cung cấp các chức năng cơ bản của quản lý bộ nhớ đệm:
  * Lấy danh sách khóa bộ nhớ đệm
  * Lấy giá trị bộ nhớ đệm
  * Thiết lập giá trị bộ nhớ đệm
  * Làm mới bộ nhớ đệm
  * Xóa bộ nhớ đệm

## Quyền

* AbpCachingManagement.Cache：Quản lý bộ nhớ đệm
  * AbpCachingManagement.Cache.Refresh：Làm mới bộ nhớ đệm
  * AbpCachingManagement.Cache.Delete：Xóa bộ nhớ đệm
  * AbpCachingManagement.Cache.ManageValue：Quản lý giá trị bộ nhớ đệm

## Cài đặt

```bash
abp add-module LINGYUN.Abp.CachingManagement
```

## Cấu hình sử dụng

1. Trước tiên cần cài đặt mô-đun triển khai bộ nhớ đệm tương ứng, ví dụ: [LINGYUN.Abp.CachingManagement.StackExchangeRedis](../LINGYUN.Abp.CachingManagement.StackExchangeRedis/README.md)

2. Thêm đoạn mã sau vào phương thức `ConfigureServices` của mô-đun:

```csharp
Configure<AbpAutoMapperOptions>(options =>
{
    options.AddProfile<AbpCachingManagementApplicationAutoMapperProfile>(validate: true);
});
```

## Xem thêm

Để biết thêm thông tin, vui lòng tham khảo các tài nguyên sau:

* [Hợp đồng dịch vụ ứng dụng](../LINGYUN.Abp.CachingManagement.Application.Contracts/README.md)
* [HTTP API](../LINGYUN.Abp.CachingManagement.HttpApi/README.md)
* [Tầng miền](../LINGYUN.Abp.CachingManagement.Domain/README.md)
