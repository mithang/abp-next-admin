# LINGYUN.Abp.OpenIddict.WeChat

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.WeChat%2FLINGYUN.Abp.OpenIddict.WeChat.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.WeChat.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.WeChat)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.WeChat` là một mô-đun mở rộng xác thực WeChat dựa trên OpenIddict, hỗ trợ quy trình xác thực của nền tảng công khai WeChat và chương trình mini WeChat.

[English](./README.EN.md)

## Tính năng

* Xác thực nền tảng công khai WeChat
  * Hỗ trợ đăng nhập bằng ủy quyền tài khoản công khai
  * Hỗ trợ tự động đăng ký người dùng mới
  * Hỗ trợ xác thực đa tenant
  * Hỗ trợ ghi nhật ký bảo mật

* Xác thực chương trình mini WeChat
  * Hỗ trợ đăng nhập bằng ủy quyền chương trình mini
  * Hỗ trợ tự động đăng ký người dùng mới
  * Hỗ trợ xác thực đa tenant
  * Hỗ trợ ghi nhật ký bảo mật

* Tích hợp quản lý người dùng
  * Hỗ trợ liên kết tài khoản WeChat
  * Hỗ trợ chính sách khóa tài khoản
  * Hỗ trợ đếm số lần thử thất bại

* Nhật ký bảo mật
  * Ghi lại lần thử đăng nhập
  * Ghi lại lần xác thực thất bại
  * Ghi lại việc khóa tài khoản

* Hỗ trợ bản địa hóa
  * Tích hợp framework bản địa hóa ABP
  * Hỗ trợ thông báo lỗi tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.WeChat
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictWeChatModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép quy trình xác thực WeChat
        builder.AllowWeChatFlow();
    });
}
```

3. Ví dụ sử dụng:

Xác thực nền tảng công khai WeChat:
```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=wechat_official&
code=021iZ1Ga1TpLOB0dXJIa1Zr6RR1iZ1G7&
scope=openid profile wechat
```

Xác thực chương trình mini WeChat:
```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=wechat_mini_program&
code=021iZ1Ga1TpLOB0dXJIa1Zr6RR1iZ1G7&
scope=openid profile wechat
```

## Tham số

* code (bắt buộc)
  * Mã ủy quyền WeChat
  * Phải là mã ủy quyền WeChat hợp lệ

* scope (tùy chọn)
  * Phạm vi quyền được yêu cầu
  * Mặc định bao gồm openid profile wechat

## Mã lỗi

* invalid_grant
  * GrantTypeInvalid - Loại ủy quyền không được phép
  * WeChatTokenInvalid - Xác thực WeChat thất bại
  * WeChatCodeNotFound - Mã ủy quyền WeChat trống hoặc không tồn tại
  * WeChatNotRegister - Tài khoản WeChat của người dùng chưa được liên kết

## Lưu ý

* Phải bật tính năng tương ứng (ủy quyền nền tảng công khai hoặc chương trình mini)
* Phải cấu hình đúng ID ứng dụng và khóa bí mật WeChat
* Mã ủy quyền có thời hạn hiệu lực giới hạn
* Nhiều lần xác thực thất bại có thể dẫn đến khóa tài khoản
* Mọi thao tác xác thực đều được ghi vào nhật ký bảo mật
* Môi trường production nên sử dụng HTTPS
