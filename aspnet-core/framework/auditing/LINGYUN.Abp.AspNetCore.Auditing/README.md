# LINGYUN.Abp.AspNetCore.Auditing

Mô-đun mở rộng ngày kiểm toán, dùng để ghi các Http header cụ thể vào nhật ký kiểm toán  

## Tham chiếu mô-đun


```csharp
[DependsOn(typeof(AbpAspNetCoreAuditingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

*	AbpAspNetCoreAuditingHeaderOptions.IsEnabled      Có ghi Http header vào nhật ký kiểm toán hay không, mặc định: true
*	AbpAspNetCoreAuditingHeaderOptions.HttpHeaders    Danh sách Http header cần ghi vào nhật ký kiểm toán
