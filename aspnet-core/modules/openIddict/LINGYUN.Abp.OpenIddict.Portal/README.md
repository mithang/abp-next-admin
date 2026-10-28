# LINGYUN.Abp.OpenIddict.Portal

[![ABP version](https://img.shields.io/badge/dynamic/xml?style=flat-square&color=yellow&label=abp&query=%2F%2FProject%2FPropertyGroup%2FAbpVersion&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcolinin%2Fabp-next-admin%2Fmaster%2Faspnet-core%2Fmodules%2FopenIddict%2FLINGYUN.Abp.OpenIddict.Portal%2FLINGYUN.Abp.OpenIddict.Portal.csproj)](https://abp.io)
[![NuGet](https://img.shields.io/nuget/v/LINGYUN.Abp.OpenIddict.Portal.svg?style=flat-square)](https://www.nuget.org/packages/LINGYUN.Abp.OpenIddict.Portal)

## Giới thiệu

`LINGYUN.Abp.OpenIddict.Portal` là mô-đun mở rộng xác thực cổng thông tin của OpenIddict, cung cấp chức năng xác thực cho cổng doanh nghiệp, bao gồm lựa chọn đa tenant, xác thực hai yếu tố, chính sách mật khẩu, v.v.

[English](./README.EN.md)

## Tính năng

* Xác thực cổng doanh nghiệp
  * Hỗ trợ lựa chọn danh sách doanh nghiệp
  * Hỗ trợ xác thực đa tenant
  * Hỗ trợ hiển thị Logo doanh nghiệp

* Tăng cường xác thực bằng mật khẩu
  * Hỗ trợ đăng nhập bằng email
  * Hỗ trợ nhà cung cấp đăng nhập bên ngoài
  * Hỗ trợ kiểm tra chính sách mật khẩu
  * Hỗ trợ bắt buộc đổi mật khẩu
  * Hỗ trợ đổi mật khẩu định kỳ

* Xác thực hai yếu tố
  * Hỗ trợ nhiều nhà cung cấp xác minh
  * Hỗ trợ xác minh bằng mã xác thực
  * Hỗ trợ xác minh bằng ứng dụng xác thực

* Nhật ký bảo mật
  * Ghi lại lần thử đăng nhập
  * Ghi lại lần đăng nhập thất bại
  * Ghi lại lần đổi mật khẩu

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenIddict.Portal
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpOpenIddictPortalModule))]` vào lớp mô-đun của bạn.

2. Cấu hình máy chủ OpenIddict:

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<OpenIddictServerBuilder>(builder =>
    {
        // Cho phép luồng xác thực cổng thông tin
        builder.AllowPortalFlow();
    });
}
```

3. Ví dụ sử dụng:

```http
POST /connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=portal&
username=admin&
password=1q2w3E*&
enterpriseId=your-enterprise-id&
scope=openid profile
```

## Quy trình xác thực

1. Lựa chọn doanh nghiệp
   * Người dùng cung cấp ID doanh nghiệp (enterpriseId)
   * Nếu không cung cấp hoặc không hợp lệ, trả về danh sách doanh nghiệp có thể chọn

2. Xác minh mật khẩu
   * Hỗ trợ đăng nhập bằng tên người dùng hoặc email
   * Kiểm tra chính sách mật khẩu
   * Kiểm tra trạng thái tài khoản

3. Xác thực hai yếu tố (nếu được bật)
   * Xác minh mã xác thực hai yếu tố
   * Hỗ trợ nhiều nhà cung cấp xác minh

4. Đổi mật khẩu (nếu cần)
   * Bắt buộc đổi mật khẩu khi đăng nhập lần đầu
   * Yêu cầu đổi mật khẩu định kỳ

## Mô tả tham số

* username (bắt buộc)
  * Tên người dùng hoặc địa chỉ email

* password (bắt buộc)
  * Mật khẩu người dùng

* enterpriseId (bắt buộc)
  * ID doanh nghiệp, phải có định dạng GUID hợp lệ

* TwoFactorProvider (tùy chọn)
  * Tên nhà cung cấp xác thực hai yếu tố
  * Chỉ cần khi đã bật xác thực hai yếu tố

* TwoFactorCode (tùy chọn)
  * Mã xác thực hai yếu tố
  * Chỉ cần khi đã bật xác thực hai yếu tố

* ChangePasswordToken (tùy chọn)
  * Mã thông báo đổi mật khẩu
  * Chỉ cần khi cần đổi mật khẩu

* NewPassword (tùy chọn)
  * Mật khẩu mới
  * Chỉ cần khi cần đổi mật khẩu

## Lưu ý

* ID doanh nghiệp phải có định dạng GUID hợp lệ
* Mật khẩu phải tuân thủ chính sách mật khẩu đã cấu hình trong hệ thống
* Mã xác thực hai yếu tố có thời hạn hiệu lực giới hạn
* Mọi thao tác xác thực đều được ghi vào nhật ký bảo mật
* Nên sử dụng HTTPS trong môi trường production
