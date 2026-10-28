# LINGYUN.Platform.Domain.Shared

Lớp lĩnh vực chia sẻ của module quản lý nền tảng, định nghĩa các kiểu cơ bản, enum và hằng số cần thiết cho quản lý nền tảng.

## Tính năng

* Định nghĩa enum cơ sở quản lý nền tảng
* Định nghĩa hằng số quản lý nền tảng
* Định nghĩa tài nguyên bản địa hóa quản lý nền tảng
* Định nghĩa giao diện chia sẻ lĩnh vực quản lý nền tảng

## Tham chiếu module

```csharp
[DependsOn(typeof(PlatformDomainSharedModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Tham chiếu module
2. Sử dụng enum và hằng số đã định nghĩa
3. Sử dụng tài nguyên bản địa hóa

## Thêm

Để biết thêm thông tin, vui lòng tham khảo [Platform](../README.md)
