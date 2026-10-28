# Mô-đun nhật ký LINGYUN.Abp

## Tổng quan mô-đun

Mô-đun nhật ký cung cấp khả năng ghi và truy xuất nhật ký: ghi nhật ký dựa trên Serilog và tăng cường thuộc tính, cùng với việc truy xuất nhật ký từ cơ sở lưu trữ
thông qua triển khai `ILoggingProvider` (cung cấp giao diện truy vấn thống nhất ra bên ngoài thông qua `ILoggingManager`).

## Danh sách mô-đun

| Mô-đun | Mô tả | Tài liệu |
| --- | --- | --- |
| LINGYUN.Abp.Logging | Hạ tầng nhật ký, định nghĩa và triển khai `ILoggingManager`, triển khai truy vấn thông tin nhật ký | [README](./LINGYUN.Abp.Logging/README.md) |
| LINGYUN.Abp.Logging.Serilog.Elasticsearch | Triển khai Elasticsearch của `ILoggingProvider` | [README](./LINGYUN.Abp.Logging.Serilog.Elasticsearch/README.md) |
| LINGYUN.Abp.Logging.Serilog.OpenObserve | Triển khai OpenObserve của `ILoggingProvider` | [README](./LINGYUN.Abp.Logging.Serilog.OpenObserve/README.md) |
| LINGYUN.Abp.Serilog.Enrichers.Application | Thêm định danh ứng dụng vào thuộc tính nhật ký | [README](./LINGYUN.Abp.Serilog.Enrichers.Application/README.md) |
| LINGYUN.Abp.Serilog.Enrichers.UniqueId | Thêm định danh duy nhất vào thuộc tính nhật ký (thuật toán Snowflake) | [README](./LINGYUN.Abp.Serilog.Enrichers.UniqueId/README.md) |

## Tính năng

### Chức năng cốt lõi

- Giao diện truy vấn nhật ký thống nhất `ILoggingManager`, cùng với trừu tượng `ILoggingProvider` có thể thay thế
- Hỗ trợ truy vấn theo nhiều trường nhật ký (dấu thời gian, mức nhật ký, thông điệp, v.v.)
- Hỗ trợ ghi và truy vấn thông tin ngoại lệ
- Hỗ trợ thông tin trường nhật ký phong phú (tên máy, tên môi trường, tên ứng dụng, ngữ cảnh yêu cầu, v.v.)
- Hỗ trợ truy vấn phân trang và thống kê đếm

### Hỗ trợ lưu trữ

- Triển khai Elasticsearch (Serilog ghi + `ILoggingProvider` truy xuất)
- Triển khai OpenObserve (Serilog ghi + `ILoggingProvider` truy xuất)

> Cả hai triển khai đều chỉ định triển khai truy xuất thông qua `Logging:Provider`.

### Tăng cường thuộc tính nhật ký

- Tên ứng dụng (`WithApplicationName`)
- Định danh duy nhất (`WithUniqueId`, thuật toán Snowflake)

## Tham chiếu mô-đun

### Mô-đun cốt lõi

```csharp
[DependsOn(typeof(AbpLoggingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Mô-đun Elasticsearch

```csharp
[DependsOn(typeof(AbpLoggingSerilogElasticsearchModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Mô-đun OpenObserve

```csharp
[DependsOn(typeof(AbpLoggingSerilogOpenObserveModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Bộ tăng cường tên ứng dụng

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

### Bộ tăng cường định danh duy nhất

```csharp
[DependsOn(typeof(AbpSerilogEnrichersUniqueIdModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Tùy chọn cấu hình

### Cấu hình nhật ký cơ bản

```json
{
  "Logging": {
    "MachineName": "Tên máy của bạn",
    "EnvironmentName": "Tên môi trường"
  }
}
```

### Cấu hình Elasticsearch

* AbpLoggingSerilogElasticsearchOptions.IndexFormat phải giống với IndexFormat trong mục cấu hình Serilog, nếu không sẽ không thể xác định đúng chỉ mục

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

### Cấu hình OpenObserve

* AbpLoggingSerilogOpenObserveOptions.Stream là tên stream lưu trữ nhật ký
* AbpLoggingSerilogOpenObserveOptions.Organization là tên organization lưu trữ nhật ký

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

### Cấu hình định danh duy nhất

* AbpSerilogUniqueIdConsts.UniqueIdPropertyName là tên của trường định danh duy nhất, mặc định là "UniqueId"

```json
{
  "UniqueId": {
    "Snowflake": {
      "WorkerId": 1,        // ID máy worker
      "DatacenterId": 1,    // ID trung tâm dữ liệu
      "Sequence": 0,        // Số thứ tự
      "BaseTime": "2020-01-01 00:00:00"  // Thời gian cơ sở
    }
  }
}
```

### Tăng cường thuộc tính nhật ký(Serilog Enrich)

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information"
    },
    "Enrich": [ "WithApplicationName", "WithUniqueId" ]
  }
}
```

## Cách dùng cơ bản

1. Tiêm giao diện `ILoggingManager`:

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

### Các điều kiện truy vấn được hỗ trợ

* Khoảng thời gian (startTime, endTime)
* Mức nhật ký (level)
* Tên máy (machineName)
* Tên môi trường(environment)
* Tên ứng dụng (application)
* Ngữ cảnh (context)
* ID yêu cầu (requestId)
* Đường dẫn yêu cầu (requestPath)
* ID tương quan (correlationId)
* ID tiến trình (processId)
* ID luồng (threadId)
* Có chứa ngoại lệ hay không (hasException)

## Mô tả trường nhật ký

* TimeStamp - Dấu thời gian nhật ký
* Level - Mức nhật ký
* Message - Thông điệp nhật ký
* Fields - Thông tin trường nhật ký
  * Id - Định danh duy nhất của nhật ký
  * MachineName - Tên máy
  * Environment - Tên môi trường
  * Application - Tên ứng dụng
  * Context - Ngữ cảnh
  * ActionId - ID thao tác
  * ActionName - Tên thao tác
  * RequestId - ID yêu cầu
  * RequestPath - Đường dẫn yêu cầu
  * ConnectionId - ID kết nối
  * CorrelationId - ID tương quan
  * ClientId - ID máy khách
  * UserId - ID người dùng
  * ProcessId - ID tiến trình
  * ThreadId - ID luồng
* Exceptions - Danh sách thông tin ngoại lệ

## Lưu ý đặc biệt

- Triển khai Elasticsearch: `IndexFormat` phải nhất quán với cấu hình Serilog (mặc định `logstash-{0:yyyy.MM.dd}`);
  Hỗ trợ đa tenant, sẽ lọc nhật ký theo ID tenant hiện tại; truy vấn hỗ trợ phân trang, sắp xếp và khớp mờ đường dẫn yêu cầu
- Triển khai OpenObserve: hỗ trợ truy xuất theo `Stream`/`Organization`; phía ghi chịu giới hạn `ZO_INGEST_ALLOWED_UPTO` từ phía máy chủ
  (mặc định 5 giờ); lưu trữ dạng append-only, không hỗ trợ xóa theo bản ghi
- Bộ tăng cường tên ứng dụng: tên ứng dụng là giá trị tĩnh, một khi đã đặt sẽ có hiệu lực với mọi mục nhật ký của ứng dụng đó; chỉ ghi khi sự kiện nhật ký chưa có thuộc tính này
- Bộ tăng cường định danh duy nhất: ID do thuật toán Snowflake tạo ra tăng dần theo xu hướng nhưng không đảm bảo tăng nghiêm ngặt; ID máy worker và ID trung tâm dữ liệu phải là duy nhất trong cụm;
  thời gian cơ sở sau khi đặt không thể sửa đổi

## Mô-đun liên quan

* Triển khai OpenObserve của nhật ký kiểm toán: [LINGYUN.Abp.AuditLogging.OpenObserve](../auditing/LINGYUN.Abp.AuditLogging.OpenObserve/README.md)
* Triển khai Elasticsearch của nhật ký kiểm toán: [LINGYUN.Abp.AuditLogging.Elasticsearch](../auditing/LINGYUN.Abp.AuditLogging.Elasticsearch/README.md)
