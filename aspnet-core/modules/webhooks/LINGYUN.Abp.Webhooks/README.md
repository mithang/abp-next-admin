# LINGYUN.Abp.Webhooks

Module Webhook cơ sở, cung cấp định nghĩa và chức năng cơ bản của Webhook.

[English](README.EN.md)

## Tính năng

* Định nghĩa Webhook cơ bản
* Phát hành và đăng ký Webhook
* Xử lý dữ liệu sự kiện Webhook
* Quản lý cấu hình Webhook

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpWebhooksModule))]
public class YouProjectModule : AbpModule
{
  // other
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
                name: "YourWebhook",
                displayName: L("DisplayName:YourWebhook"),
                description: L("Description:YourWebhook")
            )
        );
    }
}
```

2. Phát hành Webhook
```csharp
public class YourService
{
    private readonly IWebhookPublisher _webhookPublisher;

    public YourService(IWebhookPublisher webhookPublisher)
    {
        _webhookPublisher = webhookPublisher;
    }

    public async Task PublishWebhook()
    {
        await _webhookPublisher.PublishAsync(
            webhookName: "YourWebhook",
            data: new { /* webhook data */ }
        );
    }
}
```

3. Xử lý sự kiện Webhook
```csharp
public class YourWebhookHandler : IWebhookHandler, ITransientDependency
{
    public async Task HandleWebhookAsync(WebhookPayload webhook)
    {
        // Xử lý sự kiện webhook
    }
}
```
