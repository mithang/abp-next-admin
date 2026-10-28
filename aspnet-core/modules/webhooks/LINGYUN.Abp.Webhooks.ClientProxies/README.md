# LINGYUN.Abp.Webhooks.ClientProxies

Mô-đun proxy client Webhook, cung cấp triển khai proxy cho client Webhook.

[English](README.EN.md)

## Tính năng

* Proxy client Webhook
* Cấu hình HTTP client
* Cơ chế tự động thử lại
* Xử lý lỗi

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksClientProxiesModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cấu hình

```json
{
  "Webhooks": {
    "ClientProxies": {
      "RetryCount": 3,  // Số lần thử lại
      "RetryInterval": "00:00:05",  // Khoảng thời gian thử lại
      "HttpTimeout": "00:00:30"  // Thời gian chờ yêu cầu HTTP
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình proxy client
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpWebhooksClientProxiesOptions>(options =>
    {
        options.RetryCount = 5;
        options.RetryInterval = TimeSpan.FromSeconds(10);
    });
}
```

2. Sử dụng proxy client
```csharp
public class YourService
{
    private readonly IWebhookClientProxy _webhookClientProxy;

    public YourService(IWebhookClientProxy webhookClientProxy)
    {
        _webhookClientProxy = webhookClientProxy;
    }

    public async Task SendWebhook()
    {
        await _webhookClientProxy.SendAsync(
            new WebhookSendArgs
            {
                WebhookUri = "https://your-webhook-endpoint",
                Data = new { /* webhook data */ }
            });
    }
}
```
