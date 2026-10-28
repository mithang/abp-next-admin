# LINGYUN.Abp.WebhooksManagement.HttpApi.Client

Mô-đun client HTTP API quản lý Webhook, cung cấp client proxy động cho HTTP API quản lý Webhook.

[English](README.EN.md)

## Tính năng

* Proxy client API động
* Tự động cấu hình HTTP client
* Hỗ trợ gọi dịch vụ từ xa
* Tích hợp client C# API động của ABP

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksManagementHttpApiClientModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cấu hình

```json
{
  "RemoteServices": {
    "WebhooksManagement": {
      "BaseUrl": "http://localhost:44315/"  // URL cơ sở của dịch vụ quản lý Webhook
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình dịch vụ từ xa
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    var configuration = context.Services.GetConfiguration();
    
    Configure<AbpRemoteServiceOptions>(options =>
    {
        options.RemoteServices.Default = new RemoteServiceConfiguration(
            configuration["RemoteServices:WebhooksManagement:BaseUrl"]);
    });
}
```

2. Sử dụng HTTP client
```csharp
public class YourService
{
    private readonly IWebhookSubscriptionAppService _webhookSubscriptionAppService;

    public YourService(IWebhookSubscriptionAppService webhookSubscriptionAppService)
    {
        _webhookSubscriptionAppService = webhookSubscriptionAppService;
    }

    public async Task CallRemoteApi()
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
