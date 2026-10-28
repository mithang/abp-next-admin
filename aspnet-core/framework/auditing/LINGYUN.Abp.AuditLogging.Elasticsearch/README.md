# LINGYUN.Abp.AuditLogging.Elasticsearch

Tiếng Trung giản thể | [English](./README.EN.md)

Triển khai Elasticsearch cho mô-đun kiểm toán

ElasticsearchAuditLogManager triển khai IAuditLogManager, nhật ký kiểm toán do ES quản lý  
ElasticsearchSecurityLogManager triển khai ISecurityLogManager, nhật ký bảo mật do ES quản lý  

## Tham chiếu mô-đun


```csharp
[DependsOn(typeof(AbpAuditLoggingElasticsearchModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

*	AbpAuditLoggingElasticsearchOptions.IndexPrefix      Tiền tố chỉ mục, mặc định là auditlogging

## Lưu ý

Tích hợp với mô-đun tenant, khi chuyển đổi tenant sẽ đổi chỉ mục

## appsettings.json

```json
{
  "AuditLogging": {
    "Elasticsearch": {
      "IndexPrefix": "auditlogging"
    }
  }
}