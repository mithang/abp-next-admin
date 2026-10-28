# LINGYUN.Abp.AspNetCore.Mvc.Idempotent

Mô-đun kiểm tra tính lũy đẳng của API MVC

## Cấu hình sử dụng

```csharp
[DependsOn(typeof(AbpAspNetCoreMvcIdempotentModule))]
public class YouProjectModule : AbpModule
{
	public override void ConfigureServices(ServiceConfigurationContext context)
	{
		Configure<AbpMvcIdempotentOptions>(options =>
		{
			// Ví dụ: kiểm tra tính lũy đẳng cho phương thức yêu cầu DELETE
			options.SupportedMethods.Add("DELETE");
        });
	}
}
```
## Mô tả mục cấu hình

## Khác

