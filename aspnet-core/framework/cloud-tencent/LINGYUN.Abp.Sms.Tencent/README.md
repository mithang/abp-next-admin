# LINGYUN.Abp.Sms.Tencent

Mô-đun dịch vụ SMS Tencent Cloud, tích hợp dịch vụ SMS Tencent Cloud vào ứng dụng ABP.

## Tính năng

* Hỗ trợ gửi tin nhắn bằng dịch vụ SMS Tencent Cloud
* Hỗ trợ cấu hình đa thuê bao
* Hỗ trợ cấu hình chữ ký và mẫu mặc định
* Hỗ trợ gửi hàng loạt tới nhiều số điện thoại
* Hỗ trợ truyền tham số mẫu SMS
* Tích hợp sẵn xử lý lỗi và ghi nhật ký

## Mô tả các mục cấu hình

### Cấu hình cơ bản

```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "SecretId": "SecretId Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "SecretKey": "SecretKey Tencent Cloud của bạn", // Lấy từ bảng điều khiển Tencent Cloud
      "DurationSecond": "600" // Thời lượng phiên, đơn vị giây
    }
  }
}
```

### Cấu hình dịch vụ SMS

```json
{
  "Settings": {
    "Abp.TencentCloud.Sms": {
      "AppId": "", // ID ứng dụng SMS, được tạo sau khi thêm ứng dụng trong bảng điều khiển SMS
      "DefaultSignName": "", // Chữ ký SMS mặc định
      "DefaultTemplateId": "" // ID mẫu SMS mặc định
    }
  }
}
```

## Cách dùng cơ bản

1. Thêm phụ thuộc mô-đun
```csharp
[DependsOn(typeof(AbpSmsTencentModule))]
public class YourModule : AbpModule
{
    // ...
}
```

2. Cấu hình dịch vụ SMS Tencent Cloud
```json
{
  "Settings": {
    "Abp.TencentCloud": {
      "SecretId": "SecretId Tencent Cloud của bạn",
      "SecretKey": "SecretKey Tencent Cloud của bạn"
    },
    "Abp.TencentCloud.Sms": {
      "AppId": "ID ứng dụng SMS của bạn",
      "DefaultSignName": "Chữ ký SMS của bạn",
      "DefaultTemplateId": "ID mẫu mặc định của bạn"
    }
  }
}
```

3. Ví dụ gửi SMS
```csharp
public class YourService
{
    private readonly ISmsSender _smsSender;

    public YourService(ISmsSender smsSender)
    {
        _smsSender = smsSender;
    }

    // Gửi bằng chữ ký và mẫu mặc định
    public async Task SendSmsAsync(string phoneNumber, Dictionary<string, object> templateParams)
    {
        await _smsSender.SendAsync(
            phoneNumber,
            nameof(TencentCloudSmsSender),
            templateParams);
    }

    // Gửi bằng chữ ký và mẫu được chỉ định
    public async Task SendSmsAsync(
        string signName,
        string templateCode,
        string phoneNumber,
        Dictionary<string, object> templateParams)
    {
        await _smsSender.SendAsync(
            signName,
            templateCode,
            phoneNumber,
            templateParams);
    }
}
```

## Tính năng nâng cao

### Công tắc tính năng

Mô-đun cung cấp các công tắc tính năng sau:

* TencentSms - điều khiển việc bật/tắt dịch vụ SMS Tencent Cloud

### Xử lý lỗi

* Khi tất cả SMS đều gửi thất bại, ngoại lệ sẽ được ném ra
* Khi một phần SMS gửi thất bại, nhật ký cảnh báo sẽ được ghi lại
* Hỗ trợ xem chi tiết các lần gửi thất bại, bao gồm mã giao dịch, số điện thoại, mã lỗi và thông báo lỗi

## Tài liệu thêm

* [Dịch vụ SMS Tencent Cloud](https://cloud.tencent.com/document/product/382)
* [Bảng điều khiển SMS](https://console.cloud.tencent.com/smsv2)

[English](./README.EN.md)
