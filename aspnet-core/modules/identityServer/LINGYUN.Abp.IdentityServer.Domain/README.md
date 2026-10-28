# LINGYUN.Abp.IdentityServer.Domain

Mô-đun miền IdentityServer, mở rộng chức năng tầng miền của IdentityServer4.

## Tính năng

* Mở rộng dịch vụ sự kiện
  * Triển khai dịch vụ sự kiện tùy chỉnh - `AbpEventService`
  * Trình xử lý sự kiện có thể cấu hình - `IAbpIdentityServerEventServiceHandler`
  * Trình xử lý sự kiện mặc định - `AbpIdentityServerEventServiceHandler`
    * Hỗ trợ ghi sự kiện thất bại
    * Hỗ trợ ghi sự kiện thông tin
    * Hỗ trợ ghi sự kiện thành công
    * Hỗ trợ ghi sự kiện lỗi
  * Cơ chế đăng ký trình xử lý sự kiện
    * Cấu hình trình xử lý sự kiện qua `AbpIdentityServerEventOptions`

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityServerDomainModule)
)]
public class YourModule : AbpModule
{
    // ...
}
```

## Mô-đun phụ thuộc

* `Volo.Abp.IdentityServer.AbpIdentityServerDomainModule` - Mô-đun miền ABP IdentityServer

## Cấu hình và sử dụng

### Cấu hình trình xử lý sự kiện

```csharp
Configure<AbpIdentityServerEventOptions>(options =>
{
    // Thêm trình xử lý sự kiện tùy chỉnh
    options.EventServiceHandlers.Add<YourEventServiceHandler>();
});
```

### Triển khai trình xử lý sự kiện

```csharp
public class YourEventServiceHandler : IAbpIdentityServerEventServiceHandler
{
    public virtual bool CanRaiseEventType(EventTypes evtType)
    {
        // Triển khai logic phán đoán loại sự kiện
        return true;
    }

    public virtual Task RaiseAsync(Event evt)
    {
        // Triển khai logic xử lý sự kiện
        return Task.CompletedTask;
    }
}
```

Tài liệu liên quan:
* [Tài liệu IdentityServer4](https://identityserver4.readthedocs.io/)
* [Tài liệu ABP IdentityServer](https://docs.abp.io/en/abp/latest/Modules/IdentityServer)

[Xem tài liệu tiếng Anh](README.EN.md)
