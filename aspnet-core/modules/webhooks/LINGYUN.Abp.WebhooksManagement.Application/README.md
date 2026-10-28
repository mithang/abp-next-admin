# LINGYUN.Abp.WebhooksManagement.Application

Mô-đun dịch vụ ứng dụng quản lý Webhook, cung cấp triển khai tầng ứng dụng cho quản lý Webhook.

[English](README.EN.md)

## Tính năng

* Quản lý đăng ký Webhook
* Quản lý nhóm Webhook
* Quản lý định nghĩa Webhook
* Tra cứu nhật ký Webhook
* Quản lý quyền Webhook

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksManagementApplicationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa quyền

* WebhooksManagement.Webhooks
  * WebhooksManagement.Webhooks.Create
  * WebhooksManagement.Webhooks.Update
  * WebhooksManagement.Webhooks.Delete
  * WebhooksManagement.Webhooks.ManagePermissions
* WebhooksManagement.Groups
  * WebhooksManagement.Groups.Create
  * WebhooksManagement.Groups.Update
  * WebhooksManagement.Groups.Delete
* WebhooksManagement.Subscriptions
  * WebhooksManagement.Subscriptions.Create
  * WebhooksManagement.Subscriptions.Update
  * WebhooksManagement.Subscriptions.Delete
* WebhooksManagement.Logs
  * WebhooksManagement.Logs.Default

## Cách dùng cơ bản

1. Quản lý đăng ký Webhook
```csharp
public class YourService
{
    private readonly IWebhookSubscriptionAppService _webhookSubscriptionAppService;

    public YourService(IWebhookSubscriptionAppService webhookSubscriptionAppService)
    {
        _webhookSubscriptionAppService = webhookSubscriptionAppService;
    }

    public async Task ManageSubscription()
    {
        // Tạo đăng ký
        await _webhookSubscriptionAppService.CreateAsync(new WebhookSubscriptionCreateDto
        {
            WebhookUri = "https://your-webhook-endpoint",
            Webhooks = new[] { "YourWebhook" }
        });

        // Tra cứu đăng ký
        var subscriptions = await _webhookSubscriptionAppService.GetListAsync(
            new WebhookSubscriptionGetListInput());
    }
}
```

2. Tra cứu nhật ký Webhook
```csharp
public class YourService
{
    private readonly IWebhookSendAttemptAppService _webhookSendAttemptAppService;

    public YourService(IWebhookSendAttemptAppService webhookSendAttemptAppService)
    {
        _webhookSendAttemptAppService = webhookSendAttemptAppService;
    }

    public async Task QueryLogs()
    {
        var logs = await _webhookSendAttemptAppService.GetListAsync(
            new WebhookSendAttemptGetListInput());
    }
}
```
