# LINGYUN.Abp.Webhooks.Saas

Mô-đun tích hợp SaaS Webhook, cung cấp hỗ trợ tích hợp với hệ thống SaaS ABP.

[English](README.EN.md)

## Tính năng

* Tích hợp với hệ thống SaaS ABP
* Hỗ trợ Webhook đa tenant
* Sự kiện Webhook liên quan đến SaaS

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksSaasModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Xử lý Webhook liên quan đến SaaS
```csharp
public class YourSaasWebhookHandler : IWebhookHandler, ITransientDependency
{
    public async Task HandleWebhookAsync(WebhookPayload webhook)
    {
        if (webhook.WebhookName == "Tenant.Created")
        {
            // Xử lý sự kiện tạo tenant
        }
    }
}
```

2. Xuất bản Webhook liên quan đến SaaS
```csharp
public class YourService
{
    private readonly IWebhookPublisher _webhookPublisher;

    public YourService(IWebhookPublisher webhookPublisher)
    {
        _webhookPublisher = webhookPublisher;
    }

    public async Task PublishSaasWebhook()
    {
        await _webhookPublisher.PublishAsync(
            webhookName: "Tenant.Created",
            data: new { /* tenant data */ }
        );
    }
}
```
