# LINGYUN.Abp.Elsa.Activities.Sms

Module tích hợp hoạt động SMS cho workflow Elsa

## Tính năng

* Cung cấp hoạt động **SendSms** để gửi SMS
  * Hỗ trợ gửi tới nhiều số điện thoại
  * Hỗ trợ thuộc tính tin nhắn tùy chỉnh
  * Hỗ trợ cú pháp JavaScript, JSON và Liquid
  * Tích hợp giao diện `ISmsSender` của framework ABP

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesSmsModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "Sms": true    // Bật hoạt động SMS
    }
}
```

## Tham số hoạt động

* **To**: Danh sách số điện thoại nhận
* **Message**: Nội dung SMS
* **Properties**: Thuộc tính bổ sung (tùy chọn nâng cao)

[English](./README.EN.md)
