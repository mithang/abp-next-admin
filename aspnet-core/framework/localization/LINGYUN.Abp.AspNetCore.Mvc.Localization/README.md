# LINGYUN.Abp.AspNetCore.Mvc.Localization

Mô-đun quản lý bản địa hóa của khung ABP, cung cấp giao diện Web API cho tài nguyên bản địa hóa.

## Tính năng

* Cung cấp giao diện API quản lý văn bản bản địa hóa
* Hỗ trợ truy vấn và so sánh tài nguyên đa ngôn ngữ
* Hỗ trợ lọc theo tên tài nguyên và tên ngôn ngữ (culture)
* Hỗ trợ tích hợp tài nguyên bản địa hóa bên ngoài
* Hỗ trợ so sánh sự khác biệt của tài nguyên bản địa hóa

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.AspNetCore.Mvc.Localization
```

## Phụ thuộc mô-đun

```csharp
[DependsOn(typeof(AbpAspNetCoreMvcLocalizationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Giao diện API

### Quản lý ngôn ngữ

* GET /api/localization/languages - Lấy tất cả ngôn ngữ khả dụng
* GET /api/localization/languages/{cultureName} - Lấy thông tin ngôn ngữ được chỉ định

### Quản lý tài nguyên

* GET /api/localization/resources - Lấy tất cả tài nguyên bản địa hóa
* GET /api/localization/resources/{name} - Lấy tài nguyên bản địa hóa được chỉ định

### Quản lý văn bản

* GET /api/localization/texts - Lấy danh sách văn bản bản địa hóa
* GET /api/localization/texts/by-key - Lấy văn bản bản địa hóa theo khóa
* GET /api/localization/texts/differences - Lấy sự khác biệt văn bản giữa các ngôn ngữ

## Cách dùng cơ bản

1. Cấu hình tài nguyên bản địa hóa
```csharp
Configure<AbpLocalizationOptions>(options =>
{
    options.Resources
        .Get<YourLocalizationResource>()
        .AddVirtualJson("/Your/Resource/Path");
});
```

2. Tiêm và sử dụng dịch vụ
```csharp
public class YourService
{
    private readonly ITextAppService _textAppService;
    
    public YourService(ITextAppService textAppService)
    {
        _textAppService = textAppService;
    }
    
    public async Task GetLocalizedText(string key, string cultureName)
    {
        var text = await _textAppService.GetByCultureKeyAsync(new GetTextByKeyInput
        {
            Key = key,
            CultureName = cultureName,
            ResourceName = "YourResourceName"
        });
        // Use the localized text
    }
}
```

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Tài liệu bản địa hóa ABP](https://docs.abp.io/zh-Hans/abp/latest/Localization)
