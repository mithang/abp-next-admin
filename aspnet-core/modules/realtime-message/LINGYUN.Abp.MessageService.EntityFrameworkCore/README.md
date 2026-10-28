# LINGYUN.Abp.MessageService.EntityFrameworkCore

Mô-đun triển khai EntityFrameworkCore của dịch vụ tin nhắn.

## Tính năng

* Triển khai tầng truy cập dữ liệu của dịch vụ tin nhắn
* Cung cấp triển khai kho lưu trữ mặc định
* Triển khai kho lưu trữ cho các thực thể sau:
  * ChatGroup - Nhóm trò chuyện
  * UserChatGroup - Nhóm trò chuyện của người dùng
  * UserChatCard - Thẻ trò chuyện của người dùng
  * UserChatSetting - Cài đặt trò chuyện của người dùng
  * UserChatFriend - Bạn trò chuyện của người dùng

## Mô-đun phụ thuộc

* [LINGYUN.Abp.MessageService.Domain](../LINGYUN.Abp.MessageService.Domain/README.md)
* `AbpEntityFrameworkCoreModule`

## Cấu hình và sử dụng

1. Trước tiên, bạn cần cài đặt LINGYUN.Abp.MessageService.EntityFrameworkCore vào dự án của bạn:

```bash
dotnet add package LINGYUN.Abp.MessageService.EntityFrameworkCore
```

2. Thêm `AbpMessageServiceEntityFrameworkCoreModule` vào danh sách phụ thuộc của mô-đun của bạn:

```csharp
[DependsOn(typeof(AbpMessageServiceEntityFrameworkCoreModule))]
public class YourModule : AbpModule
{
}
```

3. Thêm các DbSet liên quan đến dịch vụ tin nhắn vào DbContext của bạn:

```csharp
public class YourDbContext : AbpDbContext<YourDbContext>, IMessageServiceDbContext
{
    public DbSet<ChatGroup> ChatGroups { get; set; }
    public DbSet<UserChatGroup> UserChatGroups { get; set; }
    public DbSet<UserChatCard> UserChatCards { get; set; }
    public DbSet<UserChatSetting> UserChatSettings { get; set; }
    public DbSet<UserChatFriend> UserChatFriends { get; set; }
    
    public YourDbContext(DbContextOptions<YourDbContext> options) 
        : base(options)
    {
    }
}
```

## Thêm nữa

[English document](README.EN.md)
