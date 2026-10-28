# LINGYUN.Abp.IdentityServer.LinkUser

Mô-đun liên kết người dùng IdentityServer, cung cấp hỗ trợ loại cấp quyền mở rộng cho liên kết người dùng.

## Tính năng

* Trình xác thực cấp quyền mở rộng
  * `LinkUserGrantValidator` - Trình xác thực cấp quyền liên kết người dùng
    * Loại cấp quyền: `link_user`
    * Hỗ trợ xác thực mã truy cập
    * Hỗ trợ xác thực quan hệ liên kết người dùng
    * Hỗ trợ kịch bản đa tenant
    * Hỗ trợ mở rộng claim tùy chỉnh

* Hỗ trợ bản địa hóa
  * Tài nguyên tích hợp tiếng Trung và tiếng Anh
  * Hỗ trợ mở rộng thêm ngôn ngữ khác

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerLinkUserModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpIdentityServerDomainModule` - Mô-đun miền ABP IdentityServer

## Cấu hình sử dụng

### Tham số yêu cầu cấp quyền

* `grant_type` - Phải là `link_user`
* `access_token` - Mã truy cập của người dùng hiện tại
* `LinkUserId` - ID người dùng cần liên kết
* `LinkTenantId` - ID tenant của người dùng cần liên kết (tùy chọn)

### Ví dụ yêu cầu cấp quyền

```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=link_user&
access_token=current_user_access_token&
LinkUserId=target_user_id&
LinkTenantId=target_tenant_id
```

### Mở rộng claim tùy chỉnh

```csharp
public class CustomLinkUserGrantValidator : LinkUserGrantValidator
{
    protected override Task AddCustomClaimsAsync(List<Claim> customClaims, IdentityUser user, ExtensionGrantValidationContext context)
    {
        // Thêm claim tùy chỉnh
        customClaims.Add(new Claim("custom_claim", "custom_value"));

        return base.AddCustomClaimsAsync(customClaims, user, context);
    }
}
```

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu xác thực ABP](https://docs.abp.io/en/abp/latest/Authentication)

[Xem tài liệu tiếng Anh](README.EN.md)
