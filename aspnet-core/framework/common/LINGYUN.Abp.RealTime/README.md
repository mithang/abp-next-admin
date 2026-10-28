# LINGYUN.Abp.RealTime

## Giới thiệu

`LINGYUN.Abp.RealTime` là một mô-đun cơ sở giao tiếp thời gian thực, cung cấp hạ tầng truyền tải thông điệp thời gian thực. Mô-đun này chủ yếu dùng để xử lý việc truyền tải thông báo, thông điệp và sự kiện thời gian thực.

## Tính năng

* Hạ tầng truyền tải sự kiện thời gian thực
* Hỗ trợ xử lý chuỗi đã bản địa hóa
* Tích hợp sự kiện phân tán
* Cơ chế xử lý sự kiện có thể mở rộng

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.RealTime
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpRealTimeModule))]` vào lớp mô-đun của bạn.

```csharp
[DependsOn(typeof(AbpRealTimeModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Tạo đối tượng truyền tải dữ liệu sự kiện thời gian thực:

```csharp
public class YourRealTimeEto : RealTimeEto<YourData>
{
    public YourRealTimeEto(YourData data) 
        : base(data)
    {
    }
}
```

3. Sử dụng chuỗi đã bản địa hóa:

```csharp
public class LocalizedMessage
{
    private readonly LocalizableStringInfo _localizableString;

    public LocalizedMessage()
    {
        _localizableString = new LocalizableStringInfo(
            "YourResource",
            "MessageKey",
            new Dictionary<object, object>
            {
                { "param1", "value1" }
            });
    }
}
```

## Cách dùng nâng cao

### 1. Tùy chỉnh sự kiện thời gian thực

```csharp
[EventName("your-custom-event")]
public class CustomRealTimeEto : RealTimeEto<CustomData>
{
    public CustomRealTimeEto(CustomData data) 
        : base(data)
    {
    }
}
```

### 2. Xử lý sự kiện thời gian thực

```csharp
public class YourRealTimeEventHandler : 
    IDistributedEventHandler<YourRealTimeEto>,
    ITransientDependency
{
    public async Task HandleEventAsync(YourRealTimeEto eventData)
    {
        // Xử lý sự kiện thời gian thực
    }
}
```

## Liên kết

* [English document](./README.EN.md)
