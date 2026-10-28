# LINGYUN.Abp.IM

Mô-đun cơ sở của mô-đun nhắn tin tức thời.

## Tính năng

* Cung cấp hạ tầng nhắn tin tức thời
* Cung cấp giao diện nhà cung cấp người gửi tin nhắn
* Nhà cung cấp người gửi tin nhắn có thể mở rộng

## Cấu hình sử dụng

Cấu hình mô-đun sử dụng lớp tùy chọn `AbpIMOptions`:

```csharp
Configure<AbpIMOptions>(options =>
{
    // Thêm nhà cung cấp người gửi tin nhắn tùy chỉnh
    options.Providers.Add<CustomMessageSenderProvider>();
});
```

## Thêm

[English document](README.EN.md)
