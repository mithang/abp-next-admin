# LINGYUN.Abp.Serilog.Enrichers.UniqueId

Tiếng Việt | [English](./README.EN.md)

Thêm định danh duy nhất vào thuộc tính nhật ký, dùng thuật toán Snowflake để tạo ID duy nhất.

## Tính năng

* Thêm định danh duy nhất cho mỗi sự kiện nhật ký
* Tạo ID duy nhất phân tán dựa trên thuật toán Snowflake
* Hỗ trợ tùy chỉnh cấu hình thuật toán Snowflake
* Hỗ trợ hai cách cấu hình: bằng code và bằng JSON
* Tích hợp liền mạch với Serilog

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpSerilogEnrichersUniqueIdModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

### Cấu hình hằng số

* AbpSerilogUniqueIdConsts.UniqueIdPropertyName - tên của trường định danh duy nhất, mặc định là "UniqueId"

### Cấu hình thuật toán Snowflake

Cấu hình tham số thuật toán Snowflake qua `AbpSerilogEnrichersUniqueIdOptions`:

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

## Cách sử dụng

### Cách cấu hình bằng code

```csharp
Log.Logger = new LoggerConfiguration()
    .Enrich.WithUniqueId()
    // ...cấu hình khác...
    .CreateLogger();
```

### Cách cấu hình bằng JSON

```json
{
   "Serilog": {
    "MinimumLevel": {
      "Default": "Information"
    },
    "Enrich": [ "WithUniqueId" ]
  }
}
```

## Chi tiết triển khai

Enricher này dùng thuật toán Snowflake để tạo một ID duy nhất cho mỗi sự kiện nhật ký. Đặc điểm của thuật toán Snowflake là:

* ID tạo ra là số nguyên dài 64 bit
* ID gồm dấu thời gian, ID trung tâm dữ liệu, ID máy worker và số thứ tự
* Đảm bảo tính duy nhất trong môi trường phân tán
* Tính có thứ tự dựa trên dấu thời gian

## Thực tiễn tốt nhất

1. Cấu hình hợp lý ID máy worker và ID trung tâm dữ liệu để tránh xung đột trong môi trường phân tán:
```json
{
  "UniqueId": {
    "Snowflake": {
      "WorkerId": 1,
      "DatacenterId": 1
    }
  }
}
```

2. Đặt thời gian cơ sở phù hợp để tối đa hóa khoảng thời gian ID có thể dùng:
```json
{
  "UniqueId": {
    "Snowflake": {
      "BaseTime": "2020-01-01 00:00:00"
    }
  }
}
```

3. Khi truy vấn nhật ký có thể dùng trường UniqueId để định vị chính xác.

## Lưu ý

1. ID do thuật toán Snowflake tạo ra tăng dần theo xu hướng, nhưng không đảm bảo tăng nghiêm ngặt
2. ID máy worker và ID trung tâm dữ liệu trong cụm phải là duy nhất
3. Thời gian cơ sở một khi đã đặt thì không được sửa, nếu không có thể gây trùng ID
4. Mỗi sự kiện nhật ký đều tạo ID duy nhất mới, điều này có thể làm tăng một chút chi phí hiệu năng
