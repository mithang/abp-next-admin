# LINGYUN.Abp.Features.LimitValidation.Redis.Client

Thành phần xác thực giới hạn tính năng phía client dựa trên Redis

## Tính năng

* Kế thừa mọi tính năng của LINGYUN.Abp.Features.LimitValidation.Redis
* Xác thực giới hạn tính năng chuyên biệt cho ứng dụng client
* Hỗ trợ chính sách giới hạn riêng cho client

## Cấu hình và sử dụng

1. Thêm dependency module

```csharp
[DependsOn(typeof(AbpFeaturesValidationRedisClientModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

2. Cấu hình tùy chọn Redis (giống LINGYUN.Abp.Features.LimitValidation.Redis)

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

## Ví dụ sử dụng

```csharp
// Giới hạn một tính năng phía client tối đa 1000 lần gọi mỗi ngày
[RequiresLimitFeature("YourClientFeature.DailyLimit", "YourClientFeature.Interval", LimitPolicy.Days)]
public async Task YourClientMethod()
{
    // Logic nghiệp vụ phía client
}
```

[Tiếng Trung giản thể](./README.md) | [English](./README.EN.md)
