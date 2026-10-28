# LINGYUN.Abp.Sms.Aliyun

Bản triển khai Alibaba Cloud cho giao diện gửi SMS **ISmsSender** của framework ABP

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpAliyunSmsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
## Mô tả các mục cấu hình

*	AliyunSettingNames.Sms.Domain						Tùy chọn, tên miền dịch vụ SMS của Alibaba Cloud, mặc định dysmsapi.aliyuncs.com  
*	AliyunSettingNames.Sms.ActionName					Bắt buộc, tên phương thức gọi, mặc định SendSms
*	AliyunSettingNames.Sms.Version						Bắt buộc, số phiên bản mặc định, mặc định 2017-05-25
*	AliyunSettingNames.Sms.DefaultSignName				Tùy chọn, chữ ký mặc định, chữ ký SMS mặc định được dùng khi người dùng gọi mà không truyền chữ ký  
*	AliyunSettingNames.Sms.DefaultTemplateCode			Tùy chọn, mã mẫu SMS mặc định, mẫu SMS mặc định được dùng khi người dùng gọi mà không truyền mẫu SMS
*	AliyunSettingNames.Sms.DefaultPhoneNumber			Tùy chọn, số gửi mặc định, số người nhận mặc định được dùng khi người dùng gọi mà không truyền số người nhận  
*	AliyunSettingNames.Sms.VisableErrorToClient			Tùy chọn, hiển thị lỗi cho client, khi gọi giao diện SMS xảy ra lỗi thì có trả chi tiết lỗi về cho client hay không, mặc định false  

## Khác

Do yếu tố mạng, trong điều kiện đồng thời cao có thể xuất hiện ngoại lệ ngoài dự kiến, cân nhắc sử dụng bộ nhớ đệm cấp hai
