# LINGYUN.Abp.Localization.Xml

## Mô tả module

Module tích hợp tài liệu XML của thành phần bản địa hóa, cung cấp hỗ trợ tài nguyên bản địa hóa dựa trên file XML. Đã tích hợp sẵn triển khai của nhà cung cấp file vật lý (PhysicalFileProvider) và nhà cung cấp file ảo (VirtualFileProvider).

## Tính năng

* Hỗ trợ đọc tài nguyên bản địa hóa từ file XML
* Hỗ trợ file XML trong hệ thống file ảo
* Hỗ trợ file XML trong hệ thống file vật lý
* Hỗ trợ tuần tự hóa và giải tuần tự hóa file XML
* Hỗ trợ file XML mã hóa UTF-8

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Localization.Xml
```

## Module cơ sở

* Volo.Abp.Localization

## Cách sử dụng

1. Thêm phụ thuộc module:

```csharp
[DependsOn(
    typeof(AbpLocalizationXmlModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<YouProjectModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<YouResource>("en")
                // Thư mục hệ thống file ảo trong dự án hiện tại
                // Chi tiết xem: https://docs.abp.io/zh-Hans/abp/latest/Virtual-File-System
                .AddVirtualXml("/LINGYUN/Abp/Localization/Xml/Resources")
                // Thông thường cấu hình trong dự án máy chủ, ghi đường dẫn tuyệt đối của file XML lưu trong dự án máy chủ
                // Chi tiết xem: https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.fileproviders.physicalfileprovider
                .AddPhysicalXml(Path.Combine(Directory.GetCurrentDirectory(), "Resources"));
        });
    }
}
```

## Định dạng file XML

Module này sử dụng kiểu [XmlLocalizationFile](./LINGYUN/Abp/Localization/Xml/XmlLocalizationFile.cs) để tuần tự hóa và giải tuần tự hóa file XML.

Định dạng file XML ví dụ:

```xml
<?xml version="1.0" encoding="utf-8"?>
<localization>
    <culture name="zh-Hans"/>
    <texts>
        <text name="Welcome">Xin chào</text>
        <text name="HelloWorld">Xin chào thế giới!</text>
        <text name="ThisFieldIsRequired">Đây là trường bắt buộc</text>
    </texts>
</localization>
```

## Phương thức mở rộng

Module cung cấp hai phương thức mở rộng để thêm tài nguyên bản địa hóa XML:

1. AddVirtualXml：thêm file XML trong hệ thống file ảo
```csharp
localizationResource.AddVirtualXml("/YourVirtualPath/Localization");
```

2. AddPhysicalXml：thêm file XML trong hệ thống file vật lý
```csharp
localizationResource.AddPhysicalXml("C:/YourPath/Localization");
```

## Thực hành tốt nhất

1. Cách dùng khuyến nghị cho file ảo:
   * Nhúng file XML vào assembly
   * Phù hợp với tài nguyên bản địa hóa mặc định, không cần sửa đổi động

2. Cách dùng khuyến nghị cho file vật lý:
   * Đặt trong thư mục cụ thể của dự án máy chủ
   * Phù hợp với tài nguyên bản địa hóa cần sửa đổi động hoặc do hệ thống bên ngoài quản lý

## Thông tin thêm

* [English Documentation](./README.EN.md)
* [Tài liệu bản địa hóa ABP](https://docs.abp.io/zh-Hans/abp/latest/Localization)
* [Hệ thống file ảo ABP](https://docs.abp.io/zh-Hans/abp/latest/Virtual-File-System)
