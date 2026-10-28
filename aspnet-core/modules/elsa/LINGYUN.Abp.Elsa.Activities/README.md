# LINGYUN.Abp.Elsa.Activities

Tích hợp Activity thường dùng  

## Cấu hình sử dụng

```csharp

    [DependsOn(
        typeof(AbpElsaActivitiesModule)
        )]
    public class YouProjectModule : AbpModule
    {
    }
```

## appsettings.json
```json
    {
        "Elsa": {
            "BlobStoring": true,
            "Emailing": true,
            "Notification": true,
            "Sms": true,
            "IM": true,
            "PublishWebhook": true
        }
    }

```