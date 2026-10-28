# LINGYUN.Abp.Localization.CultureMap

## Mô tả mô-đun

Mô-đun này dùng để giải quyết vấn đề bản địa hóa vùng miền khi tồn tại nhiều định dạng. Nó cho phép bạn ánh xạ các mã định danh vùng miền ở định dạng khác nhau về định dạng chuẩn.

Dự án tham khảo: [Owl.Abp.CultureMap](https://github.com/maliming/Owl.Abp.CultureMap)

## Tính năng

* Hỗ trợ ánh xạ mã định danh vùng miền ở nhiều định dạng về định dạng chuẩn
* Hỗ trợ ánh xạ độc lập cho vùng miền (Culture) và vùng miền giao diện (UICulture)
* Tích hợp với tính năng bản địa hóa theo yêu cầu của ABP
* Hỗ trợ quy tắc ánh xạ vùng miền tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Localization.CultureMap
```

## Mô-đun cơ sở

* Volo.Abp.AspNetCore

## Hướng dẫn cấu hình

Mô-đun cung cấp các tùy chọn cấu hình sau:

* CulturesMaps: danh sách ánh xạ vùng miền
* UiCulturesMaps: danh sách ánh xạ vùng miền giao diện

Mỗi mục ánh xạ bao gồm:
* TargetCulture: mã định danh vùng miền đích
* SourceCultures: danh sách mã định danh vùng miền nguồn

## Cách sử dụng

1. Thêm phụ thuộc mô-đun:

```csharp
[DependsOn(
    typeof(AbpLocalizationCultureMapModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpLocalizationCultureMapOptions>(options =>
        {
            var zhHansCultureMapInfo = new CultureMapInfo
            {
                TargetCulture = "zh-Hans",
                SourceCultures = new string[] { "zh", "zh_CN", "zh-CN" }
            };

            options.CulturesMaps.Add(zhHansCultureMapInfo);
            options.UiCulturesMaps.Add(zhHansCultureMapInfo);
        });
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();

        app.UseMapRequestLocalization();
    }
}
```

## Trường hợp sử dụng thường gặp

1. Thống nhất mã định danh vùng miền tiếng Trung giản thể:
```csharp
options.CulturesMaps.Add(new CultureMapInfo
{
    TargetCulture = "zh-Hans",
    SourceCultures = new string[] { "zh", "zh_CN", "zh-CN" }
});
```

2. Thống nhất mã định danh vùng miền tiếng Trung phồn thể:
```csharp
options.CulturesMaps.Add(new CultureMapInfo
{
    TargetCulture = "zh-Hant",
    SourceCultures = new string[] { "zh_TW", "zh-TW", "zh_HK", "zh-HK" }
});
```

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Tài liệu bản địa hóa ABP](https://docs.abp.io/zh-Hans/abp/latest/Localization)

## Nhật ký cập nhật 
