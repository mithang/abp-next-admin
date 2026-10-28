# LINGYUN.Abp.IdentityServer.SmsValidator

Mô-đun xác minh SMS của IdentityServer, cung cấp chức năng xác thực danh tính dựa trên số điện thoại và mã xác minh SMS.

## Tính năng

* Xác minh SMS
  * `SmsTokenGrantValidator` - Trình xác thực ủy quyền xác minh SMS
    * Hỗ trợ xác minh số điện thoại
    * Hỗ trợ xác minh mã SMS
    * Bảo vệ chống tấn công brute-force
    * Kiểm tra khóa người dùng
    * Ghi nhật ký bảo mật
    * Thông báo sự kiện

* Quy trình xác thực
  1. Người dùng dùng số điện thoại và mã xác minh SMS để gửi yêu cầu đăng nhập
  2. Xác minh tính hợp lệ của số điện thoại và mã xác minh
  3. Xác minh trạng thái người dùng (có bị khóa hay không)
  4. Sau khi xác minh thành công sẽ tạo mã truy cập
  5. Ghi nhật ký bảo mật và sự kiện

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerSmsModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `AbpIdentityServerDomainModule` - Mô-đun miền ABP IdentityServer

## Cấu hình và sử dụng

### Cấu hình xác minh SMS

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<IIdentityServerBuilder>(builder =>
    {
        builder.AddExtensionGrantValidator<SmsTokenGrantValidator>();
    });
}
```

### Tham số yêu cầu xác thực

* `grant_type`: "phone_verify" (bắt buộc)
* `phone_number`: Số điện thoại (bắt buộc)
* `phone_verify_code`: Mã xác minh SMS (bắt buộc)
* `scope`: Phạm vi yêu cầu (tùy chọn)

### Phản hồi xác thực

* Xác thực thành công:
```json
{
    "access_token": "Mã truy cập",
    "expires_in": Thời hạn hiệu lực,
    "token_type": "Bearer",
    "refresh_token": "Mã làm mới"
}
```

* Xác thực thất bại:
```json
{
    "error": "invalid_grant",
    "error_description": "Mô tả lỗi"
}
```

### Loại lỗi

* `invalid_grant`: Xác thực ủy quyền thất bại
  * Số điện thoại chưa đăng ký
  * Mã xác minh không hợp lệ
  * Người dùng bị khóa
  * Thiếu tham số

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu ABP Identity](https://docs.abp.io/en/abp/latest/Modules/Identity)

[Xem tài liệu tiếng Anh](README.EN.md)
