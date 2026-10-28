# LINGYUN.Abp.Webhooks.EventBus

Mô-đun tích hợp bus sự kiện Webhook, cung cấp hỗ trợ tích hợp với bus sự kiện ABP.

[English](README.EN.md)

## Tính năng

* Hỗ trợ xuất bản sự kiện Webhook lên bus sự kiện
* Tích hợp liền mạch với bus sự kiện ABP
* Hỗ trợ bus sự kiện phân tán

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksEventBusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Định nghĩa bộ xử lý sự kiện Webhook
```csharp
public class YourWebhookEventHandler : 
    IDistributedEventHandler<WebhookEventData>,
    ITransientDependency
{
    public async Task HandleEventAsync(WebhookEventData eventData)
    {
        // Xử lý sự kiện webhook
    }
}
```

2. Xuất bản sự kiện Webhook
```csharp
public class YourService
{
    private readonly IDistributedEventBus _eventBus;

    public YourService(IDistributedEventBus eventBus)
    {
        _eventBus = eventBus;
    }

    public async Task PublishWebhook()
    {
        await _eventBus.PublishAsync(new WebhookEventData
        {
            WebhookName = "YourWebhook",
            Data = new { /* webhook data */ }
        });
    }
}
```
