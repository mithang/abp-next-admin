# LINGYUN.Abp.WebhooksManagement.Dapr.Client

Module tích hợp client Dapr quản lý Webhook, cung cấp hỗ trợ tích hợp với khối xây dựng gọi dịch vụ Dapr.

[English](README.EN.md)

## Tính năng

* Hỗ trợ truy cập dịch vụ quản lý Webhook thông qua gọi dịch vụ Dapr
* Tích hợp liền mạch với khối xây dựng gọi dịch vụ Dapr
* Hỗ trợ gọi dịch vụ phân tán

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpWebhooksManagementDaprClientModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Hạng mục cấu hình

```json
{
  "WebhooksManagement": {
    "Dapr": {
      "AppId": "webhooks-management",  // ID ứng dụng Dapr của dịch vụ quản lý Webhook
      "HttpEndpoint": "http://localhost:3500"  // Điểm cuối HTTP của Dapr sidecar
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình client Dapr
```csharp
Configure<AbpWebhooksManagementDaprClientOptions>(options =>
{
    options.AppId = "webhooks-management";
    options.HttpEndpoint = "http://localhost:3500";
});
```

2. Sử dụng client quản lý Webhook
```csharp
public class YourService
{
    private readonly IWebhookSubscriptionAppService _webhookSubscriptionAppService;

    public YourService(IWebhookSubscriptionAppService webhookSubscriptionAppService)
    {
        _webhookSubscriptionAppService = webhookSubscriptionAppService;
    }

    public async Task SubscribeWebhook()
    {
        await _webhookSubscriptionAppService.SubscribeAsync(new WebhookSubscriptionCreateDto
        {
            WebhookUri = "https://your-webhook-endpoint",
            Webhooks = new[] { "YourWebhook" }
        });
    }
}
```
