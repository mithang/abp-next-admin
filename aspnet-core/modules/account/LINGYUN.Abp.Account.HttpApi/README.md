# LINGYUN.Abp.Account.HttpApi

Lớp HTTP API của mô-đun tài khoản ABP, cung cấp triển khai giao diện API RESTful.

[English](./README.EN.md)

## Tính năng

* Cung cấp giao diện HTTP API quản lý tài khoản
* Hỗ trợ bản địa hóa và đa ngôn ngữ
* Tích hợp framework ABP MVC
* Tự động đăng ký API controller

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpAccountHttpApiModule),
    typeof(AbpAccountApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## API controller

### AccountController

Cung cấp các endpoint HTTP API sau:
* POST /api/account/register - Đăng ký bằng số điện thoại
* POST /api/account/register-by-wechat - Đăng ký bằng mini-program WeChat
* POST /api/account/reset-password - Đặt lại mật khẩu
* POST /api/account/send-phone-register-code - Gửi mã xác minh đăng ký qua điện thoại
* POST /api/account/send-phone-signin-code - Gửi mã xác minh đăng nhập qua điện thoại
* POST /api/account/send-email-signin-code - Gửi mã xác minh đăng nhập qua email
* POST /api/account/send-phone-reset-password-code - Gửi mã xác minh đặt lại mật khẩu qua điện thoại

### MyProfileController

Cung cấp các endpoint HTTP API sau:
* GET /api/account/my-profile - Lấy hồ sơ cá nhân
* PUT /api/account/my-profile - Cập nhật hồ sơ cá nhân
* POST /api/account/my-profile/change-password - Đổi mật khẩu
* POST /api/account/my-profile/change-phone-number - Đổi số điện thoại
* POST /api/account/my-profile/send-phone-number-change-code - Gửi mã xác minh đổi số điện thoại
* POST /api/account/my-profile/change-avatar - Cập nhật ảnh đại diện

### MyClaimController

Cung cấp các endpoint HTTP API sau:
* GET /api/account/my-claim - Lấy claim của người dùng
* PUT /api/account/my-claim - Cập nhật claim của người dùng

## Cấu hình bản địa hóa

Mô-đun đã cấu hình trước tùy chọn bản địa hóa:
* Hỗ trợ bản địa hóa tài nguyên AccountResource
* Tự động đăng ký application part MVC
