# LINGYUN.Abp.Identity.OrganizaztionUnits

Mô-đun đơn vị tổ chức xác thực danh tính, cung cấp chức năng tích hợp hệ thống xác thực danh tính với đơn vị tổ chức。

## Tính năng

* Mở rộng mô-đun AbpIdentityDomainModule
* Tích hợp mô-đun AbpAuthorizationOrganizationUnitsModule
* Hỗ trợ thêm động khai báo đơn vị tổ chức
* Cung cấp chức năng xác thực danh tính liên quan đến đơn vị tổ chức

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityDomainModule),
    typeof(AbpAuthorizationOrganizationUnitsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

### AbpClaimsPrincipalFactoryOptions

```json
{
  "Abp": {
    "Security": {
      "Claims": {
        "DynamicClaims": {
          "OrganizationUnit": true  // Bật khai báo động đơn vị tổ chức
        }
      }
    }
  }
}
```

## Loại khai báo

* `AbpOrganizationUnitClaimTypes.OrganizationUnit` - Loại khai báo đơn vị tổ chức
  * Dùng để xác định đơn vị tổ chức mà người dùng thuộc về
  * Tự động thêm vào khai báo khi xác thực người dùng

## Cách dùng cơ bản

1. Cấu hình khai báo đơn vị tổ chức
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<AbpClaimsPrincipalFactoryOptions>(options =>
    {
        options.DynamicClaims.Add(AbpOrganizationUnitClaimTypes.OrganizationUnit);
    });
}
```

2. Lấy khai báo đơn vị tổ chức của người dùng
```csharp
public class YourService
{
    private readonly ICurrentUser _currentUser;

    public YourService(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public string[] GetUserOrganizationUnits()
    {
        return _currentUser.FindClaims(AbpOrganizationUnitClaimTypes.OrganizationUnit)
            .Select(c => c.Value)
            .ToArray();
    }
}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
* [Tài liệu đơn vị tổ chức ABP](https://docs.abp.io/en/abp/latest/Organization-Units)
