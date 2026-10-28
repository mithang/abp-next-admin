# LINGYUN.Abp.Webhooks.Core

Mô-đun lõi Webhook, cung cấp định nghĩa, cấu hình Webhook và hỗ trợ chức năng cơ bản.

[English](README.EN.md)

## Tính năng

* Quản lý định nghĩa Webhook
* Cơ chế timeout và thử lại Webhook có thể cấu hình
* Bảo vệ vô hiệu hóa đăng ký tự động
* Tiêu đề yêu cầu HTTP có thể tùy chỉnh
* Hỗ trợ nhiều nhà cung cấp Webhook

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Webhooks": {
    "TimeoutDuration": "00:01:00",  // Thời gian timeout mặc định, mặc định 60 giây
    "MaxSendAttemptCount": 5,  // Số lần gửi tối đa mặc định
    "IsAutomaticSubscriptionDeactivationEnabled": true,  // Có tự động hủy đăng ký khi đạt số lần thất bại liên tiếp tối đa hay không
    "MaxConsecutiveFailCountBeforeDeactivateSubscription": 15,  // Số lần thất bại liên tiếp tối đa trước khi hủy đăng ký, mặc định là MaxSendAttemptCount * 3
    "DefaultAgentIdentifier": "Abp-Webhooks",  // Định danh bên gửi mặc định
    "DefaultHttpHeaders": {  // Tiêu đề yêu cầu mặc định
      "_AbpDontWrapResult": "true",
      "X-Requested-From": "abp-webhooks"
    }
  }
}
```

## Cách dùng cơ bản

1. Định nghĩa Webhook
```csharp
public class YourWebhookDefinitionProvider : WebhookDefinitionProvider
{
    public override void Define(IWebhookDefinitionContext context)
    {
        context.Add(
            new WebhookDefinition(
                name: "TestWebhook",
                displayName: L("DisplayName:TestWebhook"),
                description: L("Description:TestWebhook")
            )
        );
    }
}
```

2. Cấu hình tùy chọn Webhook
```csharp
Configure<AbpWebhooksOptions>(options =>
{
    options.TimeoutDuration = TimeSpan.FromMinutes(2);
    options.MaxSendAttemptCount = 3;
    options.AddHeader("Custom-Header", "Value");
});
```
