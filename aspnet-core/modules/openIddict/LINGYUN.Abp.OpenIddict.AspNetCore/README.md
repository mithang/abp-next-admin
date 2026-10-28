# LINGYUN.Abp.OpenIddict.AspNetCore

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.AspNetCore%2FLINGYUN.Abp.OpenIddict.AspNetCore.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.AspNetCore.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.AspNetCore)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.AspNetCore` là mô-đun tích hợp ASP.NET Core dựa trên ABP OpenIddict, cung cấp mở rộng thông tin người dùng và hỗ trợ claim URL ảnh đại diện.

[English](./README.EN.md)

## Tính năng

* Mở rộng endpoint thông tin người dùng
  * Hỗ trợ trả về URL ảnh đại diện của người dùng
  * Mở rộng claim chuẩn OpenID Connect
  * Hỗ trợ đa tenant

* Bên đóng góp claim URL ảnh đại diện
  * Tự động thêm claim URL ảnh đại diện của người dùng
  * Tích hợp với hệ thống danh tính

* Cấu hình máy chủ OpenIddict
  * Cấu hình sẵn hỗ trợ claim URL ảnh đại diện
  * Kế thừa từ Volo.Abp.OpenIddict.AbpOpenIddictAspNetCoreModule

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.AspNetCore
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictAspNetCoreModule))]` vào lớp mô-đun của bạn.

2. Endpoint thông tin người dùng sẽ tự động được mở rộng để bao gồm các claim sau:
   * sub (ID người dùng)
   * tenant_id (ID tenant, nếu đã bật đa tenant)
   * preferred_username (Tên người dùng)
   * family_name (Họ)
   * given_name (Tên)
   * picture (URL ảnh đại diện)
   * email
   * email_verified
   * phone_number
   * phone_number_verified
   * role

3. Claim URL ảnh đại diện sẽ tự động được thêm vào claim danh tính của người dùng.

## Cấu hình

Theo mặc định, mô-đun đã được cấu hình sẵn các thiết lập cần thiết. Nếu cần tùy chỉnh cấu hình, có thể sửa trong phương thức `PreConfigureServices` của mô-đun:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cấu hình tùy chỉnh
        builder.RegisterClaims(new[] { "your_custom_claim" });
    });
}
```

## Lưu ý

* Loại của claim URL ảnh đại diện là `IdentityConsts.ClaimType.Avatar.Name`
* Endpoint thông tin người dùng cần quyền phạm vi tương ứng mới trả về thông tin:
  * profile: Thông tin cơ bản và ảnh đại diện
  * email: Thông tin liên quan đến email
  * phone: Thông tin liên quan đến số điện thoại
  * roles: Thông tin vai trò người dùng
