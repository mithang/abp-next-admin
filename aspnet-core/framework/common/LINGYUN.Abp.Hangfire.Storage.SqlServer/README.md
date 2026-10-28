# LINGYUN.Abp.Hangfire.Storage.SqlServer

[English](README.EN.md) | Tiếng Việt

## 1. Giới thiệu

`LINGYUN.Abp.Hangfire.Storage.SqlServer` là một mô-đun ABP dùng để cấu hình Hangfire sử dụng SQL Server làm bộ lưu trữ. Mô-đun này cung cấp cách cấu hình đơn giản, giúp bạn dễ dàng sử dụng SQL Server làm bộ lưu trữ bền vững cho Hangfire.

## 2. Tính năng

* Cấu hình bộ lưu trữ SQL Server đơn giản
* Hỗ trợ chuỗi kết nối tùy chỉnh
* Hỗ trợ cấu hình tùy chọn lưu trữ SQL Server
* Tích hợp liền mạch với hệ thống cấu hình ABP

## 3. Cài đặt

```bash
dotnet add package LINGYUN.Abp.Hangfire.Storage.SqlServer
```

## 4. Cách sử dụng

1. Thêm `AbpHangfireSqlServerStorageModule` vào các phụ thuộc mô-đun:

```csharp
[DependsOn(typeof(AbpHangfireSqlServerStorageModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình chuỗi kết nối và tùy chọn lưu trữ trong appsettings.json:

```json
{
  "Hangfire": {
    "SqlServer": {
      "Connection": "Server=localhost;Database=YourDb;Trusted_Connection=True;",
      "CommandBatchMaxTimeout": "00:05:00",
      "SlidingInvisibilityTimeout": "00:05:00",
      "QueuePollInterval": "00:00:00",
      "UseRecommendedIsolationLevel": true,
      "DisableGlobalLocks": true
    }
  }
}
```

## 5. Mục cấu hình

### 5.1 Cấu hình chuỗi kết nối

Mô-đun sẽ tìm chuỗi kết nối theo thứ tự sau:
1. `Hangfire:SqlServer:Connection`
2. `ConnectionStrings:Default`

### 5.2 Tùy chọn lưu trữ

* `CommandBatchMaxTimeout`: Thời gian chờ tối đa cho xử lý hàng loạt lệnh
* `SlidingInvisibilityTimeout`: Thời gian chờ ẩn trượt
* `QueuePollInterval`: Khoảng thời gian thăm dò hàng đợi
* `UseRecommendedIsolationLevel`: Có sử dụng mức cô lập được khuyến nghị hay không
* `DisableGlobalLocks`: Có vô hiệu hóa khóa toàn cục hay không

## 6. Phụ thuộc

* Volo.Abp.Hangfire
* Hangfire.SqlServer

## 7. Tài liệu và tài nguyên

* [Tài liệu chính thức của Hangfire](https://docs.hangfire.io/)
* [Tài liệu Hangfire.SqlServer](https://docs.hangfire.io/en/latest/configuration/using-sql-server.html)
* [Tài liệu khung ABP](https://docs.abp.io/)
