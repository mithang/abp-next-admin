# LINGYUN.Abp.OpenIddict.QrCode

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.QrCode%2FLINGYUN.Abp.OpenIddict.QrCode.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.QrCode.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.QrCode)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.QrCode` là mô-đun mở rộng xác thực đăng nhập bằng quét mã của OpenIddict, cung cấp chức năng xác thực đăng nhập bằng quét mã.

[English](./README.EN.md)

## Tính năng

* Đăng nhập bằng quét mã QR

* Nhật ký bảo mật
  * Ghi lại lần thử đăng nhập
  * Ghi lại lần đăng nhập thất bại

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.QrCode
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictQrCodeModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép luồng xác thực cổng
        builder.AllowQrCodeFlow();
    });
}
```

3. Ví dụ sử dụng:

```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=qr_code&
qrcode_key=a73faf8936f649868223a9287317d8d1&
scope=openid profile
```

## Luồng xác thực

1. Xác minh mã QR
   * Người dùng cung cấp Key mã QR (qrcode_key_)
   * Nếu không cung cấp hoặc không hợp lệ, trả về lỗi mã QR không hợp lệ

## Mô tả tham số

* qrcode_key_ (bắt buộc)
  * Key mã QR

## Lưu ý

* Mọi thao tác xác thực đều được ghi vào nhật ký bảo mật
* Khuyến nghị sử dụng HTTPS trong môi trường sản xuất
