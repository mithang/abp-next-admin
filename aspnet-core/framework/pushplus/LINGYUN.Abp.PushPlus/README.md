# LINGYUN.Abp.PushPlus

Tích hợp PushPlus  

Triển khai tài liệu API liên quan đến PushPlus, sở hữu khả năng mở của PushPlus  

Xem chi tiết trong tài liệu PushPlus: https://www.pushplus.plus/doc/guide/openApi.html#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E  

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpPushPlusModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Features

* PushPlus										Nhóm tính năng PushPlus  
* PushPlus.Message.Enable						Bật toàn cục kênh tin nhắn PushPlus  
* PushPlus.Channel.WeChat						Kênh tin nhắn tài khoản công khai WeChat	
* PushPlus.Channel.WeChat.Enable				Bật kênh tin nhắn tài khoản công khai WeChat	
* PushPlus.Channel.WeChat.SendLimit				Giới hạn số lần kênh tin nhắn tài khoản công khai WeChat	
* PushPlus.Channel.WeChat.SendLimitInterval		Chu kỳ giới hạn kênh tin nhắn tài khoản công khai WeChat (ngày)	
* PushPlus.Channel.WeWork						Kênh tin nhắn WeChat doanh nghiệp	
* PushPlus.Channel.WeWork.Enable				Bật kênh tin nhắn WeChat doanh nghiệp	
* PushPlus.Channel.WeWork.SendLimit				Giới hạn số lần kênh tin nhắn WeChat doanh nghiệp	
* PushPlus.Channel.WeWork.SendLimitInterval		Chu kỳ giới hạn kênh tin nhắn WeChat doanh nghiệp (ngày)	
* PushPlus.Channel.Webhook						Kênh tin nhắn Webhook	
* PushPlus.Channel.Webhook.Enable				Bật kênh tin nhắn Webhook	
* PushPlus.Channel.Webhook.SendLimit			Giới hạn số lần kênh tin nhắn Webhook	
* PushPlus.Channel.Webhook.SendLimitInterval	Chu kỳ giới hạn kênh tin nhắn Webhook (ngày)	
* PushPlus.Channel.Email						Kênh tin nhắn Email	
* PushPlus.Channel.Email.Enable					Bật kênh tin nhắn Email	
* PushPlus.Channel.Email.SendLimit				Giới hạn số lần kênh tin nhắn Email	
* PushPlus.Channel.Email.SendLimitInterval		Chu kỳ giới hạn kênh tin nhắn Email (ngày)	
* PushPlus.Channel.Sms							Kênh tin nhắn SMS	
* PushPlus.Channel.Sms.Enable					Bật kênh tin nhắn SMS	
* PushPlus.Channel.Sms.SendLimit				Giới hạn số lần kênh tin nhắn SMS	
* PushPlus.Channel.Sms.SendLimitInterval		Chu kỳ giới hạn kênh tin nhắn SMS (ngày)	

## Mục cấu hình

```json
{
  "PushPlus": {
    "Security": {
      "Token": "Token PushPlus của bạn",      // Token lấy từ nền tảng PushPlus
      "SecretKey": "Khóa bí mật PushPlus của bạn"     // Khóa bí mật lấy từ nền tảng PushPlus
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình thông tin xác thực PushPlus
   * Lấy Token và khóa bí mật trên nền tảng PushPlus
   * Thiết lập Token và khóa bí mật trong tệp cấu hình

2. Gửi tin nhắn
   ```csharp
   public class YourService
   {
       private readonly IPushPlusMessageSender _messageSender;

       public YourService(IPushPlusMessageSender messageSender)
       {
           _messageSender = messageSender;
       }

       public async Task SendMessageAsync()
       {
           // Gửi tin nhắn WeChat
           await _messageSender.SendWeChatAsync(
               title: "Tiêu đề tin nhắn",
               content: "Nội dung tin nhắn",
               topic: "Chủ đề tùy chọn",
               template: PushPlusMessageTemplate.Html
           );

           // Gửi tin nhắn WeChat doanh nghiệp
           await _messageSender.SendWeWorkAsync(
               title: "Tiêu đề tin nhắn",
               content: "Nội dung tin nhắn"
           );

           // Gửi email
           await _messageSender.SendEmailAsync(
               title: "Tiêu đề email",
               content: "Nội dung email"
           );

           // Gửi SMS
           await _messageSender.SendSmsAsync(
               title: "Tiêu đề SMS",
               content: "Nội dung SMS"
           );

           // Gửi tin nhắn Webhook
           await _messageSender.SendWebhookAsync(
               title: "Tiêu đề tin nhắn",
               content: "Nội dung tin nhắn",
               webhook: "Địa chỉ webhook"
           );
       }
   }
   ```

## Mẫu tin nhắn

* Html - Định dạng HTML (mặc định)
* Text - Định dạng văn bản thuần túy
* Json - Định dạng JSON
* Markdown - Định dạng Markdown

## Thông tin thêm

* [Tài liệu chính thức PushPlus](https://www.pushplus.plus/doc/guide/openApi.html)
* [Framework ABP](https://abp.io/)
