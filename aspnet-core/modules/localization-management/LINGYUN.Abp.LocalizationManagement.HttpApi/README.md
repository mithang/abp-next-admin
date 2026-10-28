# LINGYUN.Abp.LocalizationManagement.HttpApi

Mô-đun HTTP API quản lý bản địa hóa, cung cấp giao diện API theo phong cách RESTful.

## Tính năng

* Cung cấp giao diện HTTP API quản lý bản địa hóa
* Hỗ trợ thao tác REST trên ngôn ngữ, tài nguyên, văn bản
* Tích hợp tính năng API động của ABP
* Hỗ trợ kiểm soát phiên bản API
* Hỗ trợ tạo tài liệu Swagger

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpLocalizationManagementHttpApiModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Bộ điều khiển API

* `LanguageController`: Bộ điều khiển API quản lý ngôn ngữ
* `ResourceController`: Bộ điều khiển API quản lý tài nguyên
* `TextController`: Bộ điều khiển API quản lý văn bản

## Mục cấu hình

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
    {
        options.AddAssemblyResource(
            typeof(LocalizationManagementResource),
            typeof(AbpLocalizationManagementApplicationContractsModule).Assembly);
    });

    PreConfigure<IMvcBuilder>(mvcBuilder =>
    {
        mvcBuilder.AddApplicationPartIfNotExists(typeof(AbpLocalizationManagementApplicationContractsModule).Assembly);
    });
}
```

## Tuyến API

* `/api/localization-management/languages` - API liên quan đến quản lý ngôn ngữ
* `/api/localization-management/resources` - API liên quan đến quản lý tài nguyên
* `/api/localization-management/texts` - API liên quan đến quản lý văn bản

## Thông tin thêm

* [English documentation](./README.EN.md)
