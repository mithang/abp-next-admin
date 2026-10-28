# LINGYUN.Abp.LocalizationManagement.EntityFrameworkCore

Triển khai tích hợp Entity Framework Core của module quản lý bản địa hóa, cung cấp chức năng truy cập dữ liệu và lưu trữ bền vững.

## Tính năng

* Triển khai ánh xạ cơ sở dữ liệu cho quản lý bản địa hóa
* Hỗ trợ tiền tố bảng và Schema tùy chỉnh
* Cung cấp triển khai EF Core cho giao diện kho lưu trữ (repository)
* Hỗ trợ thao tác cơ sở dữ liệu cho ngôn ngữ, tài nguyên và văn bản

## Tham chiếu module

```csharp
[DependsOn(typeof(AbpLocalizationManagementEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAbpDbContext<YourDbContext>(options =>
    {
        options.AddRepository<Language, EfCoreLanguageRepository>();
        options.AddRepository<Resource, EfCoreResourceRepository>();
        options.AddRepository<Text, EfCoreTextRepository>();
    });

    Configure<AbpDbContextOptions>(options =>
    {
        options.UseMySQL(); // hoặc cơ sở dữ liệu khác
    });
}
```

Tùy chọn cấu hình bảng cơ sở dữ liệu:
```csharp
public class LocalizationModelBuilderConfigurationOptions : AbpModelBuilderConfigurationOptions
{
    public LocalizationModelBuilderConfigurationOptions(
       string tablePrefix = "",
       string schema = null)
       : base(tablePrefix, schema)
    {
    }
}
```

## Bảng cơ sở dữ liệu

* Languages - Bảng ngôn ngữ
* Resources - Bảng tài nguyên
* Texts - Bảng văn bản

## Thông tin thêm

* [English documentation](./README.EN.md)
