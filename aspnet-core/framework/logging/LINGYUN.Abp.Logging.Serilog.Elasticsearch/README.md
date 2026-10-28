# LINGYUN.Abp.Logging.Serilog.Elasticsearch

Tiếng Việt | [English](./README.EN.md)

Triển khai ES của giao diện ILoggingProvider, truy xuất thông tin nhật ký từ ES  

## Tính năng

* Lưu trữ và truy xuất nhật ký dựa trên Elasticsearch
* Hỗ trợ nhiều cấp độ nhật ký (Debug, Information, Warning, Error, Critical)
* Hỗ trợ tự động ánh xạ cấp độ nhật ký của Serilog và Microsoft.Extensions.Logging
* Hỗ trợ điều kiện truy vấn phong phú (khoảng thời gian, cấp độ nhật ký, tên máy, tên môi trường, v.v.)
* Hỗ trợ lưu trữ và truy xuất thông tin ngoại lệ
* Hỗ trợ đa tenant

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLoggingSerilogElasticsearchModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

*  AbpLoggingSerilogElasticsearchOptions.IndexFormat	phải giống IndexFormat trong mục cấu hình Serilog, nếu không sẽ không định vị được chỉ mục đúng  

## appsettings.json

```json
{
  "Logging": {
    "Provider": "ElasticsearchLoggingProvider",
    "Serilog": {
      "Elasticsearch": {
        "IndexFormat": "logstash-{0:yyyy.MM.dd}"
      }
    }
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

## Lưu ý

1. Cấu hình IndexFormat phải nhất quán với cấu hình Serilog, định dạng mặc định là "logstash-{0:yyyy.MM.dd}"
2. Hỗ trợ đa tenant, sẽ tự động lọc nhật ký theo ID tenant hiện tại
3. Kết quả truy vấn hỗ trợ phân trang và sắp xếp
4. Hỗ trợ khớp mờ đường dẫn yêu cầu
5. Hỗ trợ truy vấn theo sự tồn tại của thông tin ngoại lệ