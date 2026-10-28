# LINGYUN.Abp.OpenIddict.WeChat.Work

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.WeChat.Work%2FLINGYUN.Abp.OpenIddict.WeChat.Work.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.WeChat.Work.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.WeChat.Work)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.WeChat.Work` là một mô-đun mở rộng xác thực WeChat Doanh nghiệp dựa trên OpenIddict, hỗ trợ quy trình xác thực WeChat Doanh nghiệp.

[English](./README.EN.md)

## Tính năng

* Xác thực WeChat Doanh nghiệp
  * Hỗ trợ đăng nhập bằng ủy quyền WeChat Doanh nghiệp
  * Hỗ trợ tự động đăng ký người dùng mới
  * Hỗ trợ xác thực xuyên tenant
  * Hỗ trợ ghi nhật ký bảo mật

* Tích hợp quản lý người dùng
  * Hỗ trợ liên kết tài khoản WeChat Doanh nghiệp
  * Hỗ trợ chính sách khóa tài khoản
  * Hỗ trợ đếm số lần thử thất bại

* Nhật ký bảo mật
  * Ghi lại lần thử đăng nhập
  * Ghi lại lần xác thực thất bại
  * Ghi lại việc khóa tài khoản

* Hỗ trợ bản địa hóa
  * Tích hợp khung bản địa hóa ABP
  * Hỗ trợ thông báo lỗi tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.WeChat.Work
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictWeChatWorkModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép quy trình xác thực WeChat Doanh nghiệp
        builder.AllowWeChatWorkFlow();
    });
}
```

3. Ví dụ sử dụng:

Xác thực WeChat Doanh nghiệp:
```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=wechat_work&
agent_id=1000001&
code=021iZ1Ga1TpLOB0dXJIa1Zr6RR1iZ1G7&
scope=openid profile wechat_work
```

## Tham số

* agent_id (bắt buộc)
  * ID ứng dụng WeChat Doanh nghiệp
  * Phải là ID ứng dụng WeChat Doanh nghiệp hợp lệ

* code (bắt buộc)
  * Mã ủy quyền WeChat Doanh nghiệp
  * Phải là mã ủy quyền WeChat Doanh nghiệp hợp lệ

* scope (tùy chọn)
  * Phạm vi quyền được yêu cầu
  * Mặc định bao gồm openid profile wechat_work

## Mã lỗi

* invalid_grant
  * GrantTypeInvalid - Loại ủy quyền không được phép
  * WeChatTokenInvalid - Xác thực WeChat Doanh nghiệp thất bại
  * AgentIdOrCodeNotFound - ID ứng dụng hoặc mã ủy quyền trống hoặc không tồn tại
  * UserIdNotRegister - Tài khoản WeChat Doanh nghiệp của người dùng chưa được liên kết

## Lưu ý

* Phải cấu hình đúng ID ứng dụng và khóa bí mật WeChat Doanh nghiệp
* Phải cấu hình đúng ID doanh nghiệp WeChat Doanh nghiệp
* Mã ủy quyền có thời hạn hiệu lực giới hạn
* Nhiều lần xác thực thất bại có thể dẫn đến khóa tài khoản
* Mọi thao tác xác thực đều được ghi vào nhật ký bảo mật
* Môi trường production nên sử dụng HTTPS
