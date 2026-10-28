# LINGYUN.Abp.Account.Web.TencentCaptcha

Mô-đun tích hợp thành phần mã xác minh Tencent Cloud TianYu, có thể sử dụng khả năng mã xác minh của Tencent Cloud  

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAccountWebTencentCaptchaModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Lưu ý

` Vui lòng cấu hình các tham số liên quan của Tencent Cloud khi khởi động dự án hoặc trong cài đặt hệ thống, nếu không thành phần mã xác minh trên trang đăng nhập sẽ không tải được  

*	Abp.TencentCloud.SecretId      SecretId tài khoản Tencent Cloud, cần mã hóa
*	Abp.TencentCloud.SecretKey            SecretKey tài khoản Tencent Cloud, cần mã hóa
*	Abp.TencentCloud.Captcha.CaptchaAppId     ID nghiệp vụ mã xác minh, cần mã hóa
*	Abp.TencentCloud.Captcha.AppSecretKey     Khóa bí mật gốc (25 ký tự), cần mã hóa
*	Abp.TencentCloud.Captcha.CaptchaAppIdEncryptedType    Phương thức mã hóa, không phân biệt chữ hoa/thường: "cbc", "gcm", khi không chỉ định thì thành phần trình xác minh phía frontend không mã hóa
*	Abp.TencentCloud.Captcha.CaptchaAppIdEncryptedExpireTime   Thời gian hết hạn (giây), tối đa 86400 giây, tức 24 giờ

Ví dụ cấu hình:

```json
{
  "Settings": {
    "Abp.TencentCloud.SecretId": "XXXXXXXXXXXXXX",
    "Abp.TencentCloud.SecretKey": "YYYYYYYYYYYYY",
    "Abp.TencentCloud.Captcha.CaptchaAppId": "XXXXXXXXXXXX",
    "Abp.TencentCloud.Captcha.AppSecretKey": "XXXXXXXXXXXXX",
    "Abp.TencentCloud.Captcha.CaptchaAppIdEncryptedType": "gcm",
    "Abp.TencentCloud.Captcha.CaptchaAppIdEncryptedExpireTime": 300
  }
}
```
