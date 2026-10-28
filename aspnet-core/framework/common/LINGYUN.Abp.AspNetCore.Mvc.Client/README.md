# LINGYUN.Abp.AspNetCore.Mvc.Client

Viết lại dựa trên Volo.Abp.AspNetCore.Mvc.Client  

Hỗ trợ cấu hình thời gian lưu bộ nhớ đệm của cấu hình người dùng  
Hỗ trợ đăng ký sự kiện làm mới cấu hình để xóa bộ nhớ đệm cấu hình người dùng  
Hỗ trợ các API quyền, tính năng, cấu hình, bản địa hóa và ngôn ngữ dựa trên bộ nhớ đệm người dùng  
Tham chiếu LINGYUN.Abp.MultiTenancy.RemoteService để hỗ trợ API đa thuê bao  
Hoàn toàn tách khỏi API cơ sở dữ liệu cụ thể  

#### Lưu ý


## Cấu hình sử dụng


``` json

{
	"AbpMvcClient": {
		"Cache": {
			"UserCacheExpirationSeconds": 300,
			"AnonymousCacheExpirationSeconds": 300
		}
	}
}

```

```csharp
[DependsOn(typeof(AbpAspNetCoreMvcClientModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```