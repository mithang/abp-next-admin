# LINGYUN.Abp.Serilog.Enrichers.Application

Tiếng Việt | [English](./README.EN.md)

Thêm định danh ứng dụng vào thuộc tính log

## Tính năng

* Thêm tên ứng dụng vào sự kiện log
* Hỗ trợ tùy chỉnh trường tên ứng dụng
* Hỗ trợ cả hai cách cấu hình bằng code và bằng JSON
* Lưu trữ đệm (cache) thuộc tính sự kiện log để cải thiện hiệu năng
* Tích hợp liền mạch với Serilog

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpSerilogEnrichersApplicationModule))]
public class YouProjectModule : AbpModule
{
  public override void PreConfigureServices(ServiceConfigurationContext context)
  {
    AbpSerilogEnrichersConsts.ApplicationName = "demo-app";
  }
}
```

## Mục cấu hình

Dưới đây là các hằng số trường, cần thay đổi một cách rõ ràng:

* AbpSerilogEnrichersConsts.ApplicationNamePropertyName - Dùng để tùy chỉnh tên trường ApplicationName
* AbpSerilogEnrichersConsts.ApplicationName - Tên dùng để định danh ứng dụng hiện tại trong log

## Cách sử dụng

### Cách cấu hình bằng code

```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.WithApplicationName()
    // ...các cấu hình khác...
    .CreateLogger();
```

### Cách cấu hình bằng JSON

```json
{
   "Serilog": {
    "MinimumLevel": {
      "Default": "Information"
    },
    "Enrich": [ "WithApplicationName" ]
  }
}
```

## Chi tiết triển khai

Enricher này thêm vào mỗi sự kiện log một thuộc tính có tên "ApplicationName" (có thể cấu hình), giá trị của nó là giá trị được chỉ định trong `AbpSerilogEnrichersConsts.ApplicationName`. Để cải thiện hiệu năng, thuộc tính sẽ được lưu trữ đệm.

## Thực hành tốt nhất

1. Đặt tên ứng dụng càng sớm càng tốt khi ứng dụng khởi động:
```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    AbpSerilogEnrichersConsts.ApplicationName = "your-app-name";
}
```

2. Sử dụng quy ước đặt tên nhất quán cho ứng dụng để thuận tiện cho việc lọc log.

3. Cân nhắc đặt tên ứng dụng thông qua file cấu hình:
```json
{
  "App": {
    "Name": "your-app-name"
  }
}
```
```csharp
AbpSerilogEnrichersConsts.ApplicationName = configuration["App:Name"];
```

## Lưu ý

1. Tên ứng dụng một khi đã đặt là tĩnh, giống nhau đối với mọi mục log của ứng dụng
2. Enricher sử dụng bộ nhớ đệm thuộc tính để cải thiện hiệu năng
3. Thuộc tính chỉ được thêm khi nó chưa tồn tại trong sự kiện log
