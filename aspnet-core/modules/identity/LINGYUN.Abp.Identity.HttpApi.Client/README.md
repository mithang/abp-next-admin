# LINGYUN.Abp.Identity.HttpApi.Client

Mô-đun máy khách HTTP API xác thực danh tính, cung cấp proxy máy khách HTTP API liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun Volo.Abp.Identity.AbpIdentityHttpApiClientModule
* Cung cấp proxy máy khách HTTP API liên quan đến xác thực danh tính
* Tự động đăng ký dịch vụ proxy máy khách HTTP

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityHttpApiClientModule),
    typeof(AbpIdentityApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "RemoteServices": {
    "Identity": {
      "BaseUrl": "http://localhost:44388/"
    }
  }
}
```

## Proxy máy khách

* IIdentityUserAppService - Proxy máy khách quản lý người dùng
* IIdentityRoleAppService - Proxy máy khách quản lý vai trò
* IIdentityClaimTypeAppService - Proxy máy khách quản lý loại claim
* IIdentitySecurityLogAppService - Proxy máy khách nhật ký bảo mật
* IIdentitySettingsAppService - Proxy máy khách cài đặt xác thực danh tính
* IProfileAppService - Proxy máy khách hồ sơ người dùng

## Cách dùng cơ bản

1. Cấu hình dịch vụ từ xa
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    var configuration = context.Services.GetConfiguration();

    Configure<AbpRemoteServiceOptions>(options =>
    {
        options.RemoteServices.Default =
            new RemoteServiceConfiguration(configuration["RemoteServices:Identity:BaseUrl"]);
    });
}
```

2. Sử dụng proxy máy khách
```csharp
public class YourService
{
    private readonly IIdentityUserAppService _userAppService;
    private readonly IIdentityRoleAppService _roleAppService;

    public YourService(
        IIdentityUserAppService userAppService,
        IIdentityRoleAppService roleAppService)
    {
        _userAppService = userAppService;
        _roleAppService = roleAppService;
    }

    public async Task<IdentityUserDto> GetUserAsync(Guid id)
    {
        return await _userAppService.GetAsync(id);
    }

    public async Task<IdentityRoleDto> GetRoleAsync(Guid id)
    {
        return await _roleAppService.GetAsync(id);
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
* [Tài liệu proxy máy khách HTTP API ABP](https://docs.abp.io/en/abp/latest/API/HTTP-Client-Proxies)
