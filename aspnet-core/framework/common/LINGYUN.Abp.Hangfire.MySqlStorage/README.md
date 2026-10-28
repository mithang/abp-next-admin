# LINGYUN.Abp.Hangfire.Storage.MySql

[English](README.EN.md) | Tiếng Việt

## 1. Giới thiệu

`LINGYUN.Abp.Hangfire.Storage.MySql` là một mô-đun ABP dùng để cấu hình Hangfire sử dụng MySQL làm bộ nhớ lưu trữ. Mô-đun này cung cấp cách cấu hình đơn giản, giúp bạn dễ dàng sử dụng MySQL làm bộ nhớ bền vững (persistent storage) của Hangfire.

## 2. Tính năng

* Cấu hình bộ nhớ lưu trữ MySQL đơn giản
* Hỗ trợ chuỗi kết nối tùy chỉnh
* Hỗ trợ cấu hình tùy chọn lưu trữ MySQL
* Tích hợp liền mạch với hệ thống cấu hình của ABP

## 3. Cài đặt

```bash
dotnet add package LINGYUN.Abp.Hangfire.Storage.MySql
```

## 4. Cách sử dụng

1. Thêm `AbpHangfireMySqlStorageModule` vào các phụ thuộc của mô-đun:

```csharp
[DependsOn(typeof(AbpHangfireMySqlStorageModule))]
public class YourModule : AbpModule
{
}
```

2. Cấu hình chuỗi kết nối và tùy chọn lưu trữ trong appsettings.json:

```json
{
  "Hangfire": {
    "MySql": {
      "Connection": "Server=localhost;Database=YourDb;Uid=root;Pwd=123456;",
      "TablePrefix": "Hangfire",
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
1. `Hangfire:MySql:Connection`
2. `ConnectionStrings:Default`

### 5.2 Tùy chọn lưu trữ

* `TablePrefix`: Tiền tố của bảng dữ liệu
* `CommandBatchMaxTimeout`: Thời gian chờ tối đa của quá trình xử lý lệnh theo lô
* `SlidingInvisibilityTimeout`: Thời gian chờ không hiển thị dạng trượt (sliding)
* `QueuePollInterval`: Khoảng thời gian thăm dò hàng đợi
* `UseRecommendedIsolationLevel`: Có sử dụng mức cô lập được khuyến nghị hay không
* `DisableGlobalLocks`: Có tắt khóa toàn cục hay không

## 6. Phụ thuộc

* Volo.Abp.Hangfire
* Hangfire.MySql.Core

## 7. Tài liệu và tài nguyên

* [Tài liệu chính thức của Hangfire](https://docs.hangfire.io/)
* [Tài liệu Hangfire.MySql.Core](https://github.com/arnoldasgudas/Hangfire.MySqlStorage)
* [Tài liệu framework ABP](https://docs.abp.io/)
