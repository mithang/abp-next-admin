# LINGYUN.Abp.Identity.Domain

Mô-đun lĩnh vực xác thực danh tính, cung cấp triển khai chức năng cốt lõi liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun Volo.Abp.Identity.AbpIdentityDomainModule
* Cung cấp chức năng quản lý phiên danh tính
* Cung cấp chức năng dọn dẹp phiên danh tính
* Hỗ trợ sự kiện phân tán

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityDomainModule),
    typeof(Volo.Abp.Identity.AbpIdentityDomainModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

### IdentitySessionCleanupOptions

```json
{
  "Identity": {
    "Session": {
      "Cleanup": {
        "IsEnabled": false,           // Có bật dọn dẹp phiên hay không, mặc định: false
        "CleanupPeriod": 3600000,    // Khoảng thời gian dọn dẹp phiên (mili giây), mặc định: 1 giờ
        "InactiveTimeSpan": "30.00:00:00" // Thời gian giữ phiên không hoạt động, mặc định: 30 ngày
      }
    }
  }
}
```

### IdentitySessionSignInOptions

```json
{
  "Identity": {
    "Session": {
      "SignIn": {
        "AuthenticationSchemes": ["Identity.Application"], // Phương án xác thực danh tính dùng để xử lý
        "SignInSessionEnabled": false,     // Có bật phiên đăng nhập SignInManager hay không, mặc định: false
        "SignOutSessionEnabled": false     // Có bật phiên đăng xuất SignInManager hay không, mặc định: false
      }
    }
  }
}
```

## Cách dùng cơ bản

1. Cấu hình quản lý phiên danh tính
```csharp
Configure<IdentitySessionSignInOptions>(options =>
{
    options.SignInSessionEnabled = true;    // Bật phiên đăng nhập
    options.SignOutSessionEnabled = true;   // Bật phiên đăng xuất
});
```

2. Cấu hình dọn dẹp phiên
```csharp
Configure<IdentitySessionCleanupOptions>(options =>
{
    options.IsCleanupEnabled = true;    // Bật dọn dẹp phiên
    options.CleanupPeriod = 3600000;    // Đặt khoảng thời gian dọn dẹp là 1 giờ
    options.InactiveTimeSpan = TimeSpan.FromDays(7);  // Đặt thời gian giữ phiên không hoạt động là 7 ngày
});
```

## Thêm thông tin

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
