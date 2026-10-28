# LINGYUN.Abp.WeChat.Work.HttpApi

Mô-đun HTTP API WeChat doanh nghiệp, cung cấp triển khai giao diện HTTP API cho việc phát triển ứng dụng WeChat doanh nghiệp.

## Tính năng

* API quản lý danh bạ
* API quản lý ứng dụng
* API đẩy tin nhắn
* API liên hệ khách hàng
* API xác thực danh tính
* API thanh toán doanh nghiệp
* API hóa đơn điện tử
* Giao diện callback WeChat doanh nghiệp

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpWeChatWorkHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện API

### Quản lý danh bạ

* POST /api/wechat/work/contact/department/create
* POST /api/wechat/work/contact/department/update
* DELETE /api/wechat/work/contact/department/{id}
* POST /api/wechat/work/contact/user/create
* POST /api/wechat/work/contact/user/update
* DELETE /api/wechat/work/contact/user/{id}

### Quản lý ứng dụng

* GET /api/wechat/work/agent/{agentId}
* POST /api/wechat/work/agent/set
* GET /api/wechat/work/agent/list
* POST /api/wechat/work/agent/workbench/template

### Đẩy tin nhắn

* POST /api/wechat/work/message/text
* POST /api/wechat/work/message/image
* POST /api/wechat/work/message/voice
* POST /api/wechat/work/message/video
* POST /api/wechat/work/message/file
* POST /api/wechat/work/message/textcard
* POST /api/wechat/work/message/news
* POST /api/wechat/work/message/templatecard

### Giao diện callback

* POST /api/wechat/work/callback/{corpId}

## Quyền

* `WeChatWork.Contact`: quản lý danh bạ
* `WeChatWork.Agent`: quản lý ứng dụng
* `WeChatWork.Message`: quản lý tin nhắn
* `WeChatWork.Customer`: quản lý khách hàng
* `WeChatWork.Payment`: thanh toán doanh nghiệp
* `WeChatWork.Invoice`: hóa đơn điện tử

## Tài liệu thêm

* [Tài liệu mô-đun HTTP API WeChat doanh nghiệp](README.EN.md)
