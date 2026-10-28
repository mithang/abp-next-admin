# LINGYUN.Abp.Authorization.OrganizationUnits

Mô-đun xác thực quyền đơn vị tổ chức, cung cấp chức năng xác thực quyền dựa trên đơn vị tổ chức.

## Tính năng

* Hỗ trợ xác thực quyền dựa trên đơn vị tổ chức
* Cung cấp nhà cung cấp giá trị quyền đơn vị tổ chức (OrganizationUnitPermissionValueProvider)
* Hỗ trợ xác thực quyền cho nhiều đơn vị tổ chức
* Tích hợp hệ thống quyền ABP
* Cung cấp phần mở rộng loại Claim cho đơn vị tổ chức
* Hỗ trợ phần mở rộng truy vấn đơn vị tổ chức của người dùng hiện tại

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAuthorizationOrganizationUnitsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Cấu hình nhà cung cấp quyền
   ```csharp
   public override void ConfigureServices(ServiceConfigurationContext context)
   {
       Configure<AbpPermissionOptions>(options =>
       {
           options.ValueProviders.Add<OrganizationUnitPermissionValueProvider>();
       });
   }
   ```

2. Lấy đơn vị tổ chức của người dùng hiện tại
   ```csharp
   public class YourService
   {
       private readonly ICurrentUser _currentUser;

       public YourService(ICurrentUser currentUser)
       {
           _currentUser = currentUser;
       }

       public void YourMethod()
       {
           var organizationUnits = _currentUser.FindOrganizationUnits();
           // Sử dụng đơn vị tổ chức để xử lý nghiệp vụ
       }
   }
   ```

3. Lấy đơn vị tổ chức từ ClaimsPrincipal
   ```csharp
   public class YourService
   {
       public void YourMethod(ClaimsPrincipal principal)
       {
           var organizationUnits = principal.FindOrganizationUnits();
           // Sử dụng đơn vị tổ chức để xử lý nghiệp vụ
       }
   }
   ```

## Tài nguyên khác

* [Kho GitHub](https://github.com/colinin/abp-next-admin)
* [Ứng dụng mẫu](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/services/LINGYUN.Abp.MicroService.AllInOne)

[English](./README.EN.md)
