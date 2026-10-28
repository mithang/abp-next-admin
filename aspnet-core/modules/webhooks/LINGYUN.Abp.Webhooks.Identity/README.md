# LINGYUN.Abp.Webhooks.Identity

Mô-đun tích hợp identity Webhook, cung cấp hỗ trợ tích hợp với hệ thống identity ABP.

[English](README.EN.md)

## Tính năng

* Tích hợp với hệ thống identity ABP
* Hỗ trợ Webhook ở cấp người dùng và tenant
* Sự kiện Webhook liên quan đến identity

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksIdentityModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Xử lý Webhook liên quan đến identity
```csharp
public class YourIdentityWebhookHandler : IWebhookHandler, ITransientDependency
{
    public async Task HandleWebhookAsync(WebhookPayload webhook)
    {
        if (webhook.WebhookName == "User.Created")
        {
            // Xử lý sự kiện tạo người dùng
        }
    }
}
```

2. Xuất bản Webhook liên quan đến identity
```csharp
public class YourService
{
    private readonly IWebhookPublisher _webhookPublisher;

    public YourService(IWebhookPublisher webhookPublisher)
    {
        _webhookPublisher = webhookPublisher;
    }

    public async Task PublishIdentityWebhook()
    {
        await _webhookPublisher.PublishAsync(
            webhookName: "User.Created",
            data: new { /* user data */ }
        );
    }
}
```
