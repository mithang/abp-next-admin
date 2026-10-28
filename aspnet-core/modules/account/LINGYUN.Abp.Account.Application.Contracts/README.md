# LINGYUN.Abp.Account.Application.Contracts

Hợp đồng dịch vụ ứng dụng của mô-đun tài khoản ABP, cung cấp định nghĩa giao diện liên quan đến quản lý tài khoản.

[English](./README.EN.md)

## Tính năng

* Đăng ký tài khoản bằng số điện thoại
* Đăng ký tài khoản bằng WeChat Mini Program
* Đặt lại mật khẩu bằng số điện thoại
* Chức năng mã xác minh qua điện thoại (đăng ký, đăng nhập, đặt lại mật khẩu)
* Đăng nhập bằng mã xác minh qua email
* Quản lý hồ sơ cá nhân người dùng
* Quản lý phiên người dùng
* Xác thực hai yếu tố
* Quản lý khai báo người dùng

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAccountApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Dịch vụ giao diện

### IAccountAppService

Giao diện dịch vụ quản lý tài khoản, cung cấp các chức năng sau:
* Đăng ký bằng số điện thoại
* Đăng ký bằng WeChat Mini Program
* Đặt lại mật khẩu bằng số điện thoại
* Gửi mã xác minh qua điện thoại (đăng ký, đăng nhập, đặt lại mật khẩu)
* Gửi mã xác minh qua email (đăng nhập)

### IMyProfileAppService

Giao diện dịch vụ quản lý hồ sơ cá nhân, cung cấp các chức năng sau:
* Lấy/cập nhật hồ sơ cá nhân
* Đổi mật khẩu
* Đổi số điện thoại
* Đổi ảnh đại diện
* Quản lý xác thực hai yếu tố
* Lấy/xác minh trình xác thực
* Lấy mã khôi phục

### IMyClaimAppService

Giao diện dịch vụ quản lý khai báo người dùng, cung cấp các chức năng sau:
* Lấy khai báo người dùng
* Cập nhật khai báo người dùng

## Bản địa hóa

Mô-đun hỗ trợ đa ngôn ngữ, tệp tài nguyên nằm tại:
* `/LINGYUN/Abp/Account/Localization/Resources`
