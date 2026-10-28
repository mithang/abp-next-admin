# LINGYUN.Abp.Identity.HttpApi

Mô-đun HTTP API xác thực danh tính, cung cấp giao diện HTTP API liên quan đến xác thực danh tính.

## Tính năng

* Mở rộng mô-đun Volo.Abp.Identity.AbpIdentityHttpApiModule
* Cung cấp giao diện HTTP API liên quan đến xác thực danh tính
* Hỗ trợ chú thích dữ liệu MVC của tài nguyên bản địa hóa
* Tự động đăng ký thành phần ứng dụng MVC

## Tham chiếu mô-đun

```csharp
[DependsOn(
    typeof(AbpIdentityHttpApiModule),
    typeof(AbpIdentityApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Bộ điều khiển API

* IdentityUserController - API quản lý người dùng
* IdentityRoleController - API quản lý vai trò
* IdentityClaimTypeController - API quản lý loại khai báo
* IdentitySecurityLogController - API nhật ký bảo mật
* IdentitySettingsController - API cài đặt xác thực danh tính
* ProfileController - API hồ sơ người dùng

## Tuyến API

* `/api/identity/users` - Tuyến API quản lý người dùng
* `/api/identity/roles` - Tuyến API quản lý vai trò
* `/api/identity/claim-types` - Tuyến API quản lý loại khai báo
* `/api/identity/security-logs` - Tuyến API nhật ký bảo mật
* `/api/identity/settings` - Tuyến API cài đặt xác thực danh tính
* `/api/identity/my-profile` - Tuyến API hồ sơ người dùng

## Cách dùng cơ bản

1. Cấu hình bản địa hóa
```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
    {
        options.AddAssemblyResource(typeof(IdentityResource), typeof(AbpIdentityApplicationContractsModule).Assembly);
    });
}
```

2. Sử dụng API
```csharp
// Lấy danh sách người dùng
GET /api/identity/users

// Lấy người dùng chỉ định
GET /api/identity/users/{id}

// Tạo người dùng
POST /api/identity/users
{
    "userName": "admin",
    "email": "admin@abp.io",
    "password": "1q2w3E*"
}

// Cập nhật người dùng
PUT /api/identity/users/{id}
{
    "userName": "admin",
    "email": "admin@abp.io"
}

// Xóa người dùng
DELETE /api/identity/users/{id}
```

## Thông tin thêm

* [Tài liệu xác thực danh tính ABP](https://docs.abp.io/en/abp/latest/Identity)
* [Tài liệu HTTP API ABP](https://docs.abp.io/en/abp/latest/API/HTTP-API)
