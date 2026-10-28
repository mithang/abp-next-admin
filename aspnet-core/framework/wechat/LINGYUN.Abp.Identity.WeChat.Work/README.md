# LINGYUN.Abp.Identity.WeChat.Work

Mô-đun tích hợp danh tính người dùng WeChat doanh nghiệp, cung cấp chức năng tích hợp người dùng WeChat doanh nghiệp với hệ thống ABP Identity.

## Tính năng

* Tích hợp danh tính người dùng WeChat doanh nghiệp
* Hỗ trợ đồng bộ thông tin người dùng WeChat doanh nghiệp sang hệ thống Identity
* Hỗ trợ đồng bộ cơ cấu tổ chức WeChat doanh nghiệp
* Hỗ trợ tự động tạo người dùng

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpIdentityWeChatWorkModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```json
{
  "Identity": {
    "WeChat": {
      "Work": {
        "CreateUserIfNotExist": true,    // Có tự động tạo khi người dùng chưa tồn tại hay không
        "UpdateUserIfExist": true,       // Có cập nhật thông tin khi người dùng đã tồn tại hay không
        "SyncOrganizationUnit": true     // Có đồng bộ cơ cấu tổ chức hay không
      }
    }
  }
}
```

## Tài liệu khác

* [Tài liệu tích hợp danh tính người dùng WeChat doanh nghiệp](README.EN.md)
