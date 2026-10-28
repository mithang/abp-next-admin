# LINGYUN.Abp.Elsa.Activities.Webhooks

Mô-đun tích hợp hoạt động Webhook cho quy trình làm việc Elsa

## Tính năng

* Cung cấp hoạt động **PublishWebhook** để phát hành Webhook
  * Hỗ trợ gửi dữ liệu tới người đăng ký
  * Hỗ trợ đầu mục HTTP tùy chỉnh
  * Hỗ trợ cú pháp JavaScript, JSON và Liquid
  * Tích hợp giao diện `IWebhookPublisher` của khung ABP
  * Hỗ trợ đa tenant

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesWebhooksModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "PublishWebhook": true    // Bật hoạt động Webhook
    }
}
```

## Tham số hoạt động

* **WebhooName**: Tên duy nhất của Webhook
* **WebhookData**: Dữ liệu cần gửi
* **SendExactSameData**: Có gửi trực tiếp dữ liệu gốc hay không (nếu là true, sẽ gửi trực tiếp dữ liệu trong tham số cho máy khách)
* **UseOnlyGivenHeaders**: Có chỉ sử dụng các đầu mục đã cho hay không (nếu là true, sẽ chỉ sử dụng các đầu mục đã cho; nếu là false, các đầu mục đã cho sẽ được thêm vào các đầu mục đã định nghĩa trước trong đăng ký)
* **Headers**: Đầu mục HTTP cần gửi (tùy chọn nâng cao)

[English](./README.EN.md)
