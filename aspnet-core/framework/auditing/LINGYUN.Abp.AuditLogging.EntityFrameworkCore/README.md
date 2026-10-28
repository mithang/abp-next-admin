# LINGYUN.Abp.AuditLogging.EntityFrameworkCore

Module kiểm toán triển khai bằng EntityFrameworkCore, module này chỉ đóng vai trò cầu nối, phần triển khai cụ thể do module chính thức của ABP đảm nhiệm  

AuditLogManager    triển khai IAuditLogManager, nhật ký kiểm toán do module Volo.Abp.AuditLogging quản lý  
SecurityLogManager  triển khai ISecurityLogManager, nhật ký bảo mật do module Volo.Abp.Identity quản lý  

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpAuditLoggingEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

Vui lòng tuân theo cấu hình trong các module Volo.Abp.AuditLogging và Volo.Abp.Identity  

## appsettings.json

```json
{
  "ConnectionStrings": {
    "AbpIdentity": "Server=127.0.0.1;Database=Identity;User Id=root;Password=*",
    "AbpAuditLogging": "Server=127.0.0.1;Database=AuditLogging;User Id=root;Password=*",
  }
}

```