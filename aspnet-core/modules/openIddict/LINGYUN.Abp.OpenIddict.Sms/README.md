# LINGYUN.Abp.OpenIddict.Sms

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.Sms%2FLINGYUN.Abp.OpenIddict.Sms.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.Sms.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.Sms)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.Sms` là mô-đun mở rộng xác thực bằng SMS của OpenIddict, cung cấp chức năng xác thực dựa trên số điện thoại và mã xác minh SMS.

[English](./README.EN.md)

## Tính năng

* Xác thực bằng mã SMS
  * Hỗ trợ đăng nhập bằng số điện thoại
  * Hỗ trợ xác minh mã SMS
  * Hỗ trợ xác thực đa tenant

* Tích hợp quản lý người dùng
  * Hỗ trợ tìm người dùng theo số điện thoại
  * Hỗ trợ chính sách khóa tài khoản
  * Hỗ trợ đếm số lần thử thất bại

* Nhật ký bảo mật
  * Ghi lại các lần thử đăng nhập
  * Ghi lại các lần xác minh mã thất bại
  * Ghi lại việc khóa tài khoản

* Hỗ trợ đa ngôn ngữ
  * Tích hợp khung bản địa hóa ABP
  * Hỗ trợ thông báo lỗi tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.Sms
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictSmsModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép luồng xác thực bằng mã SMS
        builder.AllowSmsFlow();
    });
}
```

3. Ví dụ sử dụng:

```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=sms&
phone_number=13800138000&
phone_verify=123456&
scope=openid profile
```

## Mô tả tham số

* phone_number (bắt buộc)
  * Số điện thoại
  * Phải đúng định dạng số điện thoại hợp lệ

* phone_verify (bắt buộc)
  * Mã xác minh SMS
  * Phải là mã xác minh hợp lệ

* scope (tùy chọn)
  * Phạm vi quyền được yêu cầu
  * Mặc định bao gồm openid profile

## Mô tả mã lỗi

* invalid_grant
  * GrantTypeInvalid - Loại ủy quyền không được phép
  * PhoneVerifyInvalid - Mã xác minh điện thoại không hợp lệ hoặc đã hết hạn
  * PhoneOrTokenCodeNotFound - Chưa nhập Số điện thoại hoặc mã xác minh
  * PhoneNumberNotRegister - Số điện thoại đăng nhập chưa được đăng ký

## Lưu ý

* Số điện thoại phải đã được đăng ký
* Mã xác minh có thời hạn hiệu lực giới hạn
* Xác minh thất bại sẽ làm tăng Số đếm thất bại
* Nhiều lần xác minh thất bại có thể dẫn đến khóa tài khoản
* Mọi thao tác xác thực đều được ghi nhật ký bảo mật
* Nên sử dụng HTTPS trong môi trường production
