# LINGYUN.Abp.Settings

## Mô tả mô-đun

Mô-đun mở rộng quản lý cài đặt ABP, cung cấp thêm các chức năng quản lý cài đặt.

### Mô-đun cơ sở  

* Volo.Abp.Settings

### Định nghĩa chức năng

* Mở rộng giao diện ISettingProvider, cung cấp thêm nhiều phương thức lấy cài đặt tiện lợi
  * GetOrDefaultAsync - Lấy giá trị cài đặt, nếu rỗng thì trả về giá trị mặc định

### Định nghĩa cấu hình

Không có mục cấu hình đặc biệt

### Cách sử dụng

1. Thêm phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpSettingsModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng phương thức mở rộng

```csharp
public class YourService
{
    private readonly ISettingProvider _settingProvider;
    private readonly IServiceProvider _serviceProvider;

    public YourService(
        ISettingProvider settingProvider,
        IServiceProvider serviceProvider)
    {
        _settingProvider = settingProvider;
        _serviceProvider = serviceProvider;
    }

    public async Task<string> GetSettingValueAsync(string name)
    {
        // Lấy giá trị cài đặt, nếu rỗng thì trả về giá trị mặc định
        return await _settingProvider.GetOrDefaultAsync(name, _serviceProvider);
    }
}
```

[Quay lại mục lục](../../../README.md)
