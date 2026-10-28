# LINGYUN.Abp.IdentityServer.Portal

Mô-đun xác thực cổng IdentityServer, cung cấp chức năng xác thực cho cổng doanh nghiệp.

## Tính năng

* Xác thực cổng
  * `PortalGrantValidator` - Trình xác thực ủy quyền cổng
    * Hỗ trợ đăng nhập cổng doanh nghiệp
    * Hỗ trợ xác thực đa tenant
    * Tự động chuyển tenant
    * Xác thực thông tin doanh nghiệp
    * Xác thực mật khẩu người dùng
    * Ghi nhật ký bảo mật

* Quy trình xác thực
  1. Người dùng dùng portal để gửi yêu cầu đăng nhập
  2. Kiểm tra có mang theo trường định danh doanh nghiệp (EnterpriseId) hay không
     * Chưa mang theo EnterpriseId: trả về danh sách doanh nghiệp đã liên kết thông tin tenant
     * Đã mang theo EnterpriseId: truy xuất thông tin tenant liên kết và chuyển sang tenant chỉ định
  3. Dùng phương thức password để xác thực đăng nhập
  4. Đăng nhập thành công trả về token

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerPortalModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpIdentityServerDomainModule` - Mô-đun miền ABP IdentityServer
* `AbpAspNetCoreMultiTenancyModule` - Mô-đun đa tenant ABP
* `PlatformDomainModule` - Mô-đun miền nền tảng

## Cấu hình và sử dụng

### Cấu hình xác thực cổng

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<IIdentityServerBuilder>(builder =>
    {
        builder.AddExtensionGrantValidator<PortalGrantValidator>();
    });
}
```

### Tham số yêu cầu xác thực

* `grant_type`: "portal" (bắt buộc)
* `enterpriseId`: Định danh doanh nghiệp (tùy chọn)
* `username`: Tên người dùng (bắt buộc)
* `password`: Mật khẩu (bắt buộc)
* `scope`: Phạm vi yêu cầu (tùy chọn)

### Phản hồi xác thực

* Khi chưa cung cấp enterpriseId:
```json
{
    "error": "invalid_grant",
    "enterprises": [
        {
            "id": "Định danh doanh nghiệp",
            "name": "Tên doanh nghiệp",
            "code": "Mã doanh nghiệp"
        }
    ]
}
```

* Xác thực thành công:
```json
{
    "access_token": "Mã truy cập",
    "expires_in": Thời hạn hiệu lực,
    "token_type": "Bearer",
    "refresh_token": "Mã làm mới"
}
```

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu đa tenant ABP](https://docs.abp.io/en/abp/latest/Multi-Tenancy)

[Xem tài liệu tiếng Anh](README.EN.md)
