# LINGYUN.Abp.Logging.Serilog.OpenObserve

Tiếng Việt | [English](./README.EN.md)

Triển khai OpenObserve của giao diện ILoggingProvider, truy xuất thông tin nhật ký từ OpenObserve  

## Tính năng

* Lưu trữ và truy xuất nhật ký dựa trên OpenObserve
* Hỗ trợ nhiều cấp độ nhật ký (Debug, Information, Warning, Error, Critical)
* Hỗ trợ tự động ánh xạ cấp độ nhật ký của Serilog và Microsoft.Extensions.Logging
* Hỗ trợ điều kiện truy vấn phong phú (khoảng thời gian, cấp độ nhật ký, tên máy, tên môi trường, v.v.)
* Hỗ trợ lưu trữ và truy xuất thông tin ngoại lệ
* Hỗ trợ đa tenant

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLoggingSerilogOpenObserveModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

*  AbpLoggingSerilogOpenObserveOptions.Stream	  Tên stream lưu trữ nhật ký
*  AbpLoggingSerilogOpenObserveOptions.Organization	  Tên organization lưu trữ nhật ký

## appsettings.json

```json
{
  "Logging": {
    "Provider": "OpenObserveLoggingProvider",
    "Serilog": {
      "OpenObserve": {
        "Stream": "default",
        "Organization": "default"
      }
    }
  },
  "OpenObserve": {
    "Endpoint": "http://localhost:5080",
    "AccessToken": "Basic XXXXXXXXXXX"
  }
}
```

## Cách dùng cơ bản

1. Tiêm giao diện ILoggingManager:
```csharp
public class YourService
{
    private readonly ILoggingManager _loggingManager;

    public YourService(ILoggingManager loggingManager)
    {
        _loggingManager = loggingManager;
    }
}
```

2. Truy vấn nhật ký:
```csharp
// Lấy danh sách nhật ký
var logs = await _loggingManager.GetListAsync(
    startTime: DateTime.Now.AddDays(-1),
    maxResultCount: 10,
    skipCount: 0,
    level: LogLevel.Error,
    environment: "Production",
    application: "YourApp"
);

// Lấy tổng số nhật ký
var count = await _loggingManager.GetCountAsync(
    startTime: DateTime.Now.AddDays(-1),
    level: LogLevel.Error
);

// Lấy một bản ghi nhật ký
var log = await _loggingManager.GetAsync(id);
```

## Điều kiện truy vấn được hỗ trợ

* Khoảng thời gian (startTime, endTime)
* Cấp độ nhật ký (level)
* Tên máy (machineName)
* Tên môi trường (environment)
* Tên ứng dụng (application)
* Ngữ cảnh (context)
* ID yêu cầu (requestId)
* Đường dẫn yêu cầu (requestPath)
* ID tương quan (correlationId)
* ID tiến trình (processId)
* ID luồng (threadId)
* Có chứa ngoại lệ hay không (hasException)

## Thành phần chung phụ thuộc

* Kết nối và tuần tự hóa: `LINGYUN.Abp.OpenObserve`（`OpenObserveClient`、`IOpenObserveSerializer`、`AbpOpenObserveOptions`）
* Điều kiện truy vấn và xây dựng SQL: `ExpressionParser`、`Condition`、`ComparisonOp` trong `LINGYUN.Abp.OpenObserve.Utils`
  và `OpenObserveSqlBuilder`

## Lưu ý
