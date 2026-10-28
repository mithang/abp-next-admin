# LINGYUN.Abp.Elsa.Activities.IM

Mô-đun tích hợp hoạt động nhắn tin tức thời cho quy trình làm việc Elsa

## Tính năng

* Cung cấp hoạt động **SendMessage** để gửi tin nhắn tức thời
  * Hỗ trợ gửi tin nhắn người dùng và tin nhắn nhóm
  * Tích hợp giao diện `IMessageSender` của khung ABP
  * Hỗ trợ đa tenant

## Cấu hình sử dụng

```csharp
[DependsOn(
    typeof(AbpElsaActivitiesIMModule)
    )]
public class YouProjectModule : AbpModule
{
}
```

## appsettings.json

```json
{
    "Elsa": {
        "IM": true    // Bật hoạt động nhắn tin tức thời
    }
}
```

## Tham số hoạt động

* **Content**: Nội dung tin nhắn
* **FormUser**: ID người dùng gửi
* **FormUserName**: Tên người dùng gửi
* **To**: ID người dùng nhận (tin nhắn người dùng)
* **GroupId**: ID nhóm nhận (tin nhắn nhóm)

## Tham số đầu ra

* **MessageId**: ID tin nhắn đã gửi

[English](./README.EN.md)
