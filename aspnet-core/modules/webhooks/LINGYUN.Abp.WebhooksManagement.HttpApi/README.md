# LINGYUN.Abp.WebhooksManagement.HttpApi

Mô-đun Webhook Management HTTP API, cung cấp giao diện REST API quản lý Webhook.

[English](README.EN.md)

## Tính năng

* REST API đăng ký Webhook
* REST API nhóm Webhook
* REST API định nghĩa Webhook
* REST API nhật ký Webhook
* Tự động định tuyến API
* Kiểm soát quyền API

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksManagementHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định tuyến API

* /api/webhooks-management/subscriptions - Quản lý đăng ký Webhook
* /api/webhooks-management/groups - Quản lý nhóm Webhook
* /api/webhooks-management/definitions - Quản lý định nghĩa Webhook
* /api/webhooks-management/logs - Truy vấn nhật ký Webhook

## Cách dùng cơ bản

1. Cấu hình định tuyến API
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpAspNetCoreMvcOptions>(options =>
    {
        options.ConventionalControllers.Create(
            typeof(AbpWebhooksManagementHttpApiModule).Assembly,
            opts =>
            {
                opts.RootPath = "webhooks-management";
            });
    });
}
```

2. Ví dụ gọi API
```http
### Tạo đăng ký Webhook
POST /api/webhooks-management/subscriptions
{
    "webhookUri": "https://your-webhook-endpoint",
    "webhooks": ["YourWebhook"]
}

### Truy vấn đăng ký Webhook
GET /api/webhooks-management/subscriptions?maxResultCount=10&skipCount=0

### Truy vấn nhật ký Webhook
GET /api/webhooks-management/logs?maxResultCount=10&skipCount=0
```
