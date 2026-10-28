# LINGYUN.Abp.Logging

Mô-đun nhật ký cơ sở

Định nghĩa giao diện ILoggingManager, triển khai truy vấn thông tin nhật ký  

[English](./README.EN.md)

## Tính năng

* Cung cấp giao diện truy vấn nhật ký thống nhất ILoggingManager
* Hỗ trợ truy vấn nhiều trường nhật ký, bao gồm dấu thời gian, cấp độ nhật ký, thông báo, v.v.
* Hỗ trợ ghi và truy vấn thông tin ngoại lệ
* Hỗ trợ thông tin trường nhật ký phong phú, như tên máy, tên môi trường, tên ứng dụng, v.v.
* Hỗ trợ truy vấn phân trang và thống kê đếm

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLoggingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

Cấu hình trong `appsettings.json`:

```json
{
  "Logging": {
    "MachineName": "Tên máy của bạn",
    "EnvironmentName": "Tên môi trường"
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
    level: LogLevel.Error
);

// Lấy tổng số nhật ký
var count = await _loggingManager.GetCountAsync(
    startTime: DateTime.Now.AddDays(-1),
    level: LogLevel.Error
);

// Lấy một nhật ký
var log = await _loggingManager.GetAsync(id);
```

## Mô tả các trường nhật ký

* TimeStamp - Dấu thời gian nhật ký
* Level - Cấp độ nhật ký
* Message - Thông báo nhật ký
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
