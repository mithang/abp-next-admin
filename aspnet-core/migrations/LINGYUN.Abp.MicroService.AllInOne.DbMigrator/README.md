# LINGYUN.Abp.MicroService.AllInOne.DbMigrator

Công cụ di chuyển cơ sở dữ liệu cho ứng dụng đơn khối, dùng để tự động thực thi di chuyển cơ sở dữ liệu và khởi tạo dữ liệu.

[English](./README.EN.md)

## Tính năng

* Tự động thực thi di chuyển cơ sở dữ liệu
* Hỗ trợ cấu hình nhiều môi trường
* Tích hợp ghi log Serilog
* Hỗ trợ cấu hình môi trường di chuyển dữ liệu
* Tự động kiểm tra và áp dụng di chuyển cơ sở dữ liệu
* Ứng dụng console, thuận tiện tích hợp vào quy trình CI/CD

## Mục cấu hình

```json
{
  "ConnectionStrings": {
    "Default": "Chuỗi kết nối cơ sở dữ liệu của bạn"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Volo.Abp": "Warning"
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình kết nối cơ sở dữ liệu
   * Cấu hình chuỗi kết nối cơ sở dữ liệu trong appsettings.json
   * Có thể cấu hình chuỗi kết nối cho từng môi trường khác nhau qua appsettings.{Environment}.json

2. Chạy công cụ di chuyển
   ```bash
   dotnet run
   ```

3. Xem log di chuyển
   * Đầu ra console
   * Tệp Logs/migrations.txt

## Biến môi trường

* `ASPNETCORE_ENVIRONMENT`: Đặt môi trường chạy (Development, Staging, Production, v.v.)
* `DOTNET_ENVIRONMENT`: Tương tự, dùng để tương thích

## Lưu ý

* Đảm bảo chuỗi kết nối cơ sở dữ liệu có đủ quyền
* Nên sao lưu cơ sở dữ liệu trước khi thực thi di chuyển
* Xem tệp log migrations.txt để biết chi tiết di chuyển
* Nếu di chuyển thất bại, kiểm tra thông tin lỗi trong log

## Gỡ lỗi khi phát triển

1. Đặt biến môi trường
   ```bash
   export ASPNETCORE_ENVIRONMENT=Development
   ```

2. Dùng Visual Studio hoặc Visual Studio Code để gỡ lỗi
   * Có thể đặt điểm ngắt
   * Xem quá trình di chuyển chi tiết

3. Tùy chỉnh logic di chuyển
   * Sửa lớp SingleDbMigrationService
   * Thêm dữ liệu seed mới
