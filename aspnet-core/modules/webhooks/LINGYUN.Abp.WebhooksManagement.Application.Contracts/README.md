# LINGYUN.Abp.WebhooksManagement.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng quản lý Webhook, định nghĩa giao diện dịch vụ ứng dụng và DTO quản lý Webhook。

[English](README.EN.md)

## Tính năng

* Giao diện dịch vụ đăng ký Webhook
* Giao diện dịch vụ nhóm Webhook
* Giao diện dịch vụ định nghĩa Webhook
* Giao diện dịch vụ nhật ký Webhook
* Định nghĩa quyền Webhook
* Định nghĩa DTO Webhook

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWebhooksManagementApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện dịch vụ

* IWebhookSubscriptionAppService - Dịch vụ quản lý đăng ký Webhook
* IWebhookGroupAppService - Dịch vụ quản lý nhóm Webhook
* IWebhookDefinitionAppService - Dịch vụ quản lý định nghĩa Webhook
* IWebhookSendAttemptAppService - Dịch vụ nhật ký gửi Webhook

## Cách dùng cơ bản

1. Triển khai dịch vụ đăng ký Webhook
```csharp
public class WebhookSubscriptionAppService : 
    ApplicationService,
    IWebhookSubscriptionAppService
{
    public async Task<WebhookSubscriptionDto> CreateAsync(
        WebhookSubscriptionCreateDto input)
    {
        // Triển khai logic tạo đăng ký
    }

    public async Task<PagedResultDto<WebhookSubscriptionDto>> GetListAsync(
        WebhookSubscriptionGetListInput input)
    {
        // Triển khai logic truy vấn đăng ký
    }
}
```

2. Sử dụng DTO Webhook
```csharp
public class YourDto
{
    public WebhookSubscriptionDto Subscription { get; set; }
    public WebhookGroupDto Group { get; set; }
    public WebhookDefinitionDto Definition { get; set; }
    public WebhookSendAttemptDto SendAttempt { get; set; }
}
```
