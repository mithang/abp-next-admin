# LINGYUN.Abp.Identity.WxPusher

Triển khai module Identity của giao diện IWxPusherUserStore, lấy danh sách topic đang theo dõi thông qua Claims của người dùng  

[English](./README.EN.md)

## Tính năng

* Tích hợp giao diện lưu trữ người dùng WxPusher
* Quản lý UID và Topic của WxPusher thông qua Claims của người dùng
* Hỗ trợ lấy hàng loạt UID đã liên kết của người dùng
* Hỗ trợ lấy hàng loạt Topic người dùng đã đăng ký

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Identity.WxPusher
```

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpIdentityWxPusherModule))]
public class YouProjectModule : AbpModule
{
    // other
}
```

## Cách sử dụng

Module này triển khai giao diện `IWxPusherUserStore`, lưu trữ thông tin liên quan đến WxPusher thông qua Claims của người dùng:

* `AbpWxPusherClaimTypes.Uid`: Lưu trữ UID WxPusher đã liên kết của người dùng
* `AbpWxPusherClaimTypes.Topic`: Lưu trữ ID Topic người dùng đã đăng ký

### Lấy UID đã liên kết của người dùng

```csharp
public class YourService
{
    private readonly IWxPusherUserStore _wxPusherUserStore;

    public YourService(IWxPusherUserStore wxPusherUserStore)
    {
        _wxPusherUserStore = wxPusherUserStore;
    }

    public async Task DoSomethingAsync(IEnumerable<Guid> userIds)
    {
        var uids = await _wxPusherUserStore.GetBindUidsAsync(userIds);
        // Dùng các uids đã lấy được để đẩy thông báo và các thao tác khác
    }
}
```

### Lấy Topic người dùng đã đăng ký

```csharp
public class YourService
{
    private readonly IWxPusherUserStore _wxPusherUserStore;

    public YourService(IWxPusherUserStore wxPusherUserStore)
    {
        _wxPusherUserStore = wxPusherUserStore;
    }

    public async Task DoSomethingAsync(IEnumerable<Guid> userIds)
    {
        var topics = await _wxPusherUserStore.GetSubscribeTopicsAsync(userIds);
        // Dùng các topics đã lấy được để đẩy thông báo và các thao tác khác
    }
}
```

## Vị trí mã nguồn

[LINGYUN.Abp.Identity.WxPusher](https://github.com/colinin/abp-next-admin/tree/master/aspnet-core/framework/wx-pusher/LINGYUN.Abp.Identity.WxPusher)
