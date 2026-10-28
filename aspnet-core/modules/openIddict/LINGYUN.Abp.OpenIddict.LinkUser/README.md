# LINGYUN.Abp.OpenIddict.LinkUser

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.LinkUser%2FLINGYUN.Abp.OpenIddict.LinkUser.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.LinkUser.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.LinkUser)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.LinkUser` là mô-đun mở rộng liên kết người dùng của OpenIddict, cung cấp chức năng xác thực liên kết giữa các người dùng.

[English](./README.EN.md)

## Tính năng

* Xác thực liên kết người dùng
  * Hỗ trợ xác thực liên kết giữa các người dùng
  * Hỗ trợ liên kết người dùng xuyên tenant
  * Hỗ trợ trao đổi access token

* Loại ủy quyền mở rộng
  * Thêm loại ủy quyền link_user
  * Hỗ trợ quy trình ủy quyền tùy chỉnh
  * Ghi nhật ký bảo mật

* Hỗ trợ đa ngôn ngữ
  * Tích hợp khung bản địa hóa ABP
  * Hỗ trợ thông báo lỗi tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.LinkUser
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictLinkUserModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép loại ủy quyền link_user
        builder.AllowLinkUserFlow();
    });
}
```

3. Ví dụ sử dụng:

```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=link_user&
access_token=current-user-access-token&
LinkUserId=target-user-id&
LinkTenantId=target-tenant-id&
scope=openid profile
```

## Giải thích tham số

* access_token (bắt buộc)
  * Access token của người dùng hiện tại
  * Dùng để xác minh danh tính người dùng hiện tại

* LinkUserId (bắt buộc)
  * ID của người dùng liên kết đích
  * Phải có định dạng GUID hợp lệ

* LinkTenantId (tùy chọn)
  * ID tenant của người dùng liên kết đích
  * Nếu chỉ định, phải có định dạng GUID hợp lệ

* scope (tùy chọn)
  * Phạm vi quyền được yêu cầu
  * Mặc định bao gồm openid profile

## Lưu ý

* Phải cung cấp access token hợp lệ
* Người dùng đích phải có quan hệ liên kết với người dùng hiện tại
* Khi liên kết xuyên tenant cần chỉ định đúng ID tenant
* Mọi thao tác đều được ghi nhật ký bảo mật
* Khuyến nghị sử dụng HTTPS trong môi trường production
