# LINGYUN.Abp.Identity.WeChat

Mô-đun tích hợp danh tính người dùng WeChat, cung cấp chức năng tích hợp người dùng WeChat với hệ thống ABP Identity.

## Tính năng

* Tích hợp danh tính người dùng WeChat
* Hỗ trợ đồng bộ thông tin người dùng WeChat sang hệ thống Identity
* Hỗ trợ cơ chế UnionId của WeChat
* Hỗ trợ tự động tạo người dùng

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpIdentityWeChatModule))]
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
      "CreateUserIfNotExist": true,  // Có tự động tạo khi người dùng không tồn tại hay không
      "UpdateUserIfExist": true      // Có cập nhật thông tin khi người dùng đã tồn tại hay không
    }
  }
}
```

## Tài liệu khác

* [Tài liệu tích hợp danh tính người dùng WeChat](README.EN.md)
