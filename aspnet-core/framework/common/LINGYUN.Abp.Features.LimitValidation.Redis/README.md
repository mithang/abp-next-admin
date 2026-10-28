# LINGYUN.Abp.Features.LimitValidation.Redis

Thành phần xác thực giới hạn tính năng dựa trên Redis

## Tính năng

* Sử dụng Redis để lưu trữ và xác thực giới hạn số lần gọi tính năng
* Hỗ trợ script Lua để thực hiện thao tác nguyên tử
* Hỗ trợ nhiều chính sách giới hạn (phút, giờ, ngày, tuần, tháng, năm)
* Hỗ trợ tùy chỉnh tùy chọn cấu hình Redis

## Cấu hình và sử dụng

1. Thêm phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpFeaturesValidationRedisModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình tùy chọn Redis

```json
{
  "Features": {
    "Validation": {
      "Redis": {
        "Configuration": "127.0.0.1",
        "InstanceName": "YourInstanceName"
      }
    }
  }
}
```

## Giải thích các mục cấu hình

* Configuration: Chuỗi kết nối Redis
* InstanceName: Tên instance Redis (tùy chọn)
* ConfigurationOptions: Tùy chọn cấu hình Redis (tùy chọn, dùng cho cấu hình Redis chi tiết hơn)

## Ví dụ sử dụng

```csharp
// Giới hạn một phương thức được gọi tối đa 100 lần mỗi phút
[RequiresLimitFeature("YourFeature.MethodLimit", "YourFeature.Interval", LimitPolicy.Minute)]
public async Task YourMethod()
{
    // Logic nghiệp vụ
}
```

[Tiếng Việt](./README.md) | [English](./README.EN.md)
