# LINGYUN.Abp.WebhooksManagement.Domain

Mô-đun miền quản lý Webhook, cung cấp chức năng lưu trữ và quản lý Webhook.

[English](README.EN.md)

## Tính năng

* Hỗ trợ lưu trữ Webhook tĩnh vào cơ sở dữ liệu
* Hỗ trợ lưu trữ Webhook động
* Quản lý bộ nhớ đệm Webhook
* Cơ chế hết hạn dấu thời gian

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksManagementDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "WebhooksManagement": {
    "SaveStaticWebhooksToDatabase": true,  // Có lưu Webhook tĩnh vào cơ sở dữ liệu hay không, mặc định là true
    "IsDynamicWebhookStoreEnabled": false,  // Có bật lưu trữ Webhook động hay không, mặc định là false
    "WebhooksCacheRefreshInterval": "00:00:30",  // Thời gian làm mới bộ nhớ đệm, mặc định là 30 giây
    "WebhooksCacheStampTimeOut": "00:02:00",  // Thời gian hết hạn khi áp dụng dấu thời gian, mặc định là 2 phút
    "WebhooksCacheStampExpiration": "00:30:00"  // Thời gian hết hạn của dấu thời gian, mặc định là 30 phút
  }
}
```

## Cách dùng cơ bản

1. Cấu hình tùy chọn quản lý Webhook
```csharp
Configure<WebhooksManagementOptions>(options =>
{
    options.SaveStaticWebhooksToDatabase = true;
    options.IsDynamicWebhookStoreEnabled = true;
    options.WebhooksCacheRefreshInterval = TimeSpan.FromMinutes(1);
});
```

2. Sử dụng bộ lưu trữ Webhook
```csharp
public class YourService
{
    private readonly IWebhookDefinitionManager _webhookDefinitionManager;

    public YourService(IWebhookDefinitionManager webhookDefinitionManager)
    {
        _webhookDefinitionManager = webhookDefinitionManager;
    }

    public async Task DoSomething()
    {
        var webhooks = await _webhookDefinitionManager.GetAllAsync();
        // Xử lý webhook
    }
}
```
