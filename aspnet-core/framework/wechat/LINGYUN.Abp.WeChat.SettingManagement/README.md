# LINGYUN.Abp.WeChat.SettingManagement

Mô-đun quản lý cài đặt WeChat, cung cấp chức năng quản lý các cấu hình liên quan đến WeChat.

## Tính năng

* Quản lý cấu hình WeChat
* Quản lý cấu hình tài khoản công khai
* Quản lý cấu hình mini program
* Quản lý cấu hình WeChat doanh nghiệp
* Tích hợp giao diện cấu hình
* Hỗ trợ đa tenant

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatSettingManagementModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cấu hình Settings

### Cấu hình tài khoản công khai

* `WeChat.Official.AppId`: AppId tài khoản công khai
* `WeChat.Official.AppSecret`: AppSecret tài khoản công khai
* `WeChat.Official.Token`: Token tin nhắn tài khoản công khai
* `WeChat.Official.EncodingAESKey`: Khóa mã hóa tin nhắn tài khoản công khai
* `WeChat.Official.IsSandBox`: Có phải môi trường sandbox hay không
* `WeChat.Official.Url`: URL máy chủ tài khoản công khai

### Cấu hình mini program

* `WeChat.MiniProgram.AppId`: AppId mini program
* `WeChat.MiniProgram.AppSecret`: AppSecret mini program
* `WeChat.MiniProgram.Token`: Token tin nhắn mini program
* `WeChat.MiniProgram.EncodingAESKey`: Khóa mã hóa tin nhắn mini program
* `WeChat.MiniProgram.IsDebug`: Có bật chế độ gỡ lỗi hay không
* `WeChat.MiniProgram.DefaultEnvironment`: Môi trường mặc định

### Cấu hình WeChat doanh nghiệp

* `WeChat.Work.CorpId`: ID doanh nghiệp
* `WeChat.Work.AgentId`: ID ứng dụng
* `WeChat.Work.Secret`: Khóa bí mật ứng dụng
* `WeChat.Work.Token`: Token tin nhắn
* `WeChat.Work.EncodingAESKey`: Khóa mã hóa tin nhắn

## Quyền

* `WeChat.Setting`: Quản lý cài đặt WeChat
* `WeChat.Setting.Official`: Quản lý cài đặt tài khoản công khai
* `WeChat.Setting.MiniProgram`: Quản lý cài đặt mini program
* `WeChat.Setting.Work`: Quản lý cài đặt WeChat doanh nghiệp

## Tài liệu thêm

* [Tài liệu mô-đun quản lý cài đặt WeChat](README.EN.md)
