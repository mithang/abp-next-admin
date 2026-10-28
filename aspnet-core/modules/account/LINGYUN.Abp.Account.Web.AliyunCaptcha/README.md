# LINGYUN.Abp.Account.Web.AliyunCaptcha

Mô-đun tích hợp thành phần mã xác minh Alibaba Cloud, có thể sử dụng khả năng mã xác minh của Alibaba Cloud  

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAccountWebAliyunCaptchaModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Lưu ý

` Vui lòng cấu hình các tham số liên quan đến Alibaba Cloud trong dự án khởi động hoặc cài đặt hệ thống, nếu không thành phần mã xác minh trên trang đăng nhập sẽ không tải được  

*	Abp.Aliyun.Authorization.RegionId      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.AccessKeyId      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.AccessKeySecret      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.UseSecurityTokenService      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.RamRoleArn      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.RoleSessionName      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.DurationSeconds      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Authorization.Policy      Cấu hình liên quan đến kiểm soát truy cập Alibaba Cloud, tham khảo cụ thể mô-đun AbpAliyunModule
*	Abp.Aliyun.Captcha.SceneId     Định danh duy nhất của kịch bản mã xác minh, cần mã hóa
*	Abp.Aliyun.Captcha.Prefix     Định danh lấy từ console, cần mã hóa
*	Abp.Aliyun.Captcha.UseEncryptedSceneId    Sử dụng định danh kịch bản mã xác minh đã mã hóa
*	Abp.Aliyun.Captcha.EKey    ekey lấy từ console, cần mã hóa
*	Abp.Aliyun.Captcha.EncryptedExpireTimeSec   Thời gian hết hạn của bản mã, đơn vị giây, phạm vi 1~86400

Cấu hình mẫu:

```json
{
  "Settings": {
    "Abp.Aliyun.Authorization.RegionId": "XXXXXXXXXXXXXX",
    "Abp.Aliyun.Authorization.AccessKeyId": "XXXXXXXXXXXXXX",
    "Abp.Aliyun.Authorization.AccessKeySecret": "XXXXXXXXXXXXXX",
    "Abp.Aliyun.Authorization.UseSecurityTokenService": true,
    "Abp.Aliyun.Authorization.RamRoleArn": "XXXXXXXXXXXXXX",
    "Abp.Aliyun.Authorization.RoleSessionName": "XXXXXXXXXXXXXX",
    "Abp.Aliyun.Authorization.DurationSeconds": 3600,
    "Abp.Aliyun.Authorization.Policy": null,
    "Abp.Aliyun.Captcha.SceneId": "YYYYYYYYYYYYY",
    "Abp.Aliyun.Captcha.Prefix": "YYYYYYYYYYYYY",
    "Abp.Aliyun.Captcha.UseEncryptedSceneId": true,
    "Abp.Aliyun.Captcha.EKey": "YYYYYYYYYYYYY",
    "Abp.Aliyun.Captcha.EncryptedExpireTimeSec": 300
  }
}
```
