# LINGYUN.Abp.Tencent.QQ

Module kết nối QQ của Tencent, tích hợp dịch vụ kết nối QQ của Tencent vào ứng dụng ABP.

## Tính năng

* Hỗ trợ đăng nhập nhanh qua kết nối QQ
* Hỗ trợ cấu hình đa tenant
* Cung cấp factory client kết nối QQ, hỗ trợ tạo client động

## Mô tả các mục cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời gian duy trì phiên (giây)
    }
  }
}
```

### Cấu hình kết nối QQ

```json
{
  "Settings": {
    "Abp.TencentCloud.QQConnect": {
      "AppId": "", // ID ứng dụng kết nối QQ, lấy từ trung tâm quản lý kết nối QQ
      "AppKey": "", // Khóa ứng dụng kết nối QQ, lấy từ trung tâm quản lý kết nối QQ
      "IsMobile": "false" // Có sử dụng kiểu giao diện di động hay không, mặc định là kiểu PC
    }
  }
}
```

## Cách dùng cơ bản

1. Thêm phụ thuộc module
```csharp
[DependsOn(typeof(AbpTencentQQModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấu hình dịch vụ kết nối QQ

Tham khảo mô tả các mục cấu hình ở trên để cấu hình tương ứng.

3. Ví dụ sử dụng dịch vụ kết nối QQ
```csharp
public class YourService
{
    private readonly TencentQQClientFactory _qqClientFactory;

    public YourService(TencentQQClientFactory qqClientFactory)
    {
        _qqClientFactory = qqClientFactory;
    }

    public async Task QQConnectAsync()
    {
        var qqClient = await _qqClientFactory.CreateAsync();
        // Dùng qqClient để gọi API dịch vụ kết nối QQ
        // Cách dùng API chi tiết vui lòng tham khảo tài liệu phát triển kết nối QQ
    }
}
```

## Thêm tài liệu

* [Nền tảng mở kết nối QQ](https://connect.qq.com/)
* [Tài liệu phát triển kết nối QQ](https://wiki.connect.qq.com/)

[English](./README.EN.md)
