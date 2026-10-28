# LINGYUN.Abp.Tencent

Mô-đun cơ sở dịch vụ Tencent Cloud, cung cấp hỗ trợ hạ tầng cho các mô-đun dịch vụ Tencent Cloud khác.

## Tính năng

* Cung cấp factory client SDK Tencent Cloud, hỗ trợ tạo động client cho từng dịch vụ Tencent Cloud
* Hỗ trợ cấu hình đa tenant
* Hỗ trợ sẵn đa ngôn ngữ (tiếng Trung và tiếng Anh)
* Cung cấp quản lý cấu hình dịch vụ Tencent Cloud thống nhất
* Hỗ trợ quản lý tính năng (Feature), có thể bật/tắt tính năng theo nhu cầu
* Hỗ trợ hiển thị địa phương hoá vùng (Region)

## Cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "LINGYUN.Abp.Tencent": {
      "EndPoint": "ap-guangzhou", // Vùng tài nguyên đặt tại, mặc định là Quảng Châu
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời lượng phiên, tính bằng giây
    }
  }
}
```

### Cấu hình kết nối

```json
{
  "Settings": {
    "LINGYUN.Abp.Tencent.Connection": {
      "HttpMethod": "POST", // Phương thức yêu cầu, mặc định là POST
      "Timeout": "60", // Thời gian chờ kết nối, tính bằng giây
      "WebProxy": "" // Địa chỉ máy chủ proxy, tùy chọn
    }
  }
}
```

## Cách dùng cơ bản

1. Thêm phụ thuộc mô-đun
```csharp
[DependsOn(typeof(AbpTencentCloudModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấu hình dịch vụ Tencent Cloud
```json
{
  "Settings": {
    "LINGYUN.Abp.Tencent": {
      "SecretId": "SecretId Tencent Cloud của bạn",
      "SecretKey": "SecretKey Tencent Cloud của bạn"
    }
  }
}
```

## Tính năng nâng cao

### Quản lý tính năng

Mô-đun cung cấp các công tắc tính năng sau:

* TencentSms - Dịch vụ SMS Tencent Cloud
* TencentBlobStoring - Dịch vụ lưu trữ đối tượng Tencent Cloud
  * MaximumStreamSize - Giới hạn kích thước luồng tệp tải lên một lần (MB)

### Hỗ trợ đa tenant

Mọi cấu hình đều hỗ trợ cấu hình đa tenant, có thể cấu hình tham số dịch vụ Tencent Cloud khác nhau cho từng tenant.

## Tài liệu thêm

* [Quản lý khóa API Tencent Cloud](https://console.cloud.tencent.com/cam/capi)
* [Vùng và khu vực sẵn sàng của Tencent Cloud](https://cloud.tencent.com/document/product/213/6091)

[English](./README.EN.md)
