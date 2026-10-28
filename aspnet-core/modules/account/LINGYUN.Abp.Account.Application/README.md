# LINGYUN.Abp.Account.Application

Triển khai dịch vụ ứng dụng của mô-đun tài khoản ABP, cung cấp triển khai đầy đủ chức năng quản lý tài khoản.

[English](./README.EN.md)

## Tính năng

* Triển khai dịch vụ quản lý tài khoản
  * Đăng ký bằng số điện thoại
  * Đăng ký bằng WeChat Mini Program
  * Đặt lại mật khẩu
  * Gửi mã xác minh (SMS, email)
* Quản lý hồ sơ cá nhân
  * Bảo trì thông tin cơ bản
  * Đổi mật khẩu
  * Thay đổi số điện thoại
  * Cập nhật ảnh đại diện
  * Xác thực hai yếu tố
* Quản lý claim của người dùng
* Dịch vụ email
  * Xác nhận email
  * Xác minh email
* Dịch vụ SMS
  * Gửi mã xác minh
* Tích hợp WeChat Mini Program
* Hỗ trợ hệ thống tệp ảo

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpAccountApplicationModule),
    typeof(AbpAccountApplicationContractsModule),
    typeof(AbpAccountTemplatesModule),
    typeof(AbpIdentityDomainModule),
    typeof(AbpWeChatMiniProgramModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ ứng dụng

### AccountAppService

Triển khai giao diện `IAccountAppService`, cung cấp:
* Đăng ký người dùng (số điện thoại, WeChat Mini Program)
* Đặt lại mật khẩu
* Gửi mã xác minh

### MyProfileAppService

Triển khai giao diện `IMyProfileAppService`, cung cấp:
* Quản lý hồ sơ cá nhân
* Đổi mật khẩu
* Thay đổi số điện thoại
* Cập nhật ảnh đại diện
* Quản lý xác thực hai yếu tố

### MyClaimAppService

Triển khai giao diện `IMyClaimAppService`, cung cấp:
* Quản lý claim của người dùng

## Dịch vụ email

Cung cấp các dịch vụ email sau:
* `IAccountEmailConfirmSender` - Dịch vụ xác nhận email
* `IAccountEmailVerifySender` - Dịch vụ xác minh email
* `AccountEmailSender` - Triển khai gửi email

## Dịch vụ SMS

Cung cấp các dịch vụ SMS sau:
* `IAccountSmsSecurityCodeSender` - Dịch vụ gửi mã xác minh SMS
* `AccountSmsSecurityCodeSender` - Triển khai gửi mã xác minh SMS

## Cấu hình URL

Mô-đun đã cấu hình sẵn các URL sau:
* EmailConfirm - URL xác nhận email, mặc định là "Account/EmailConfirm"
