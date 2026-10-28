# LINGYUN.Abp.FeatureManagement.Application.Contracts

Mô-đun hợp đồng dịch vụ ứng dụng quản lý tính năng, định nghĩa các giao diện, DTO và quyền cần thiết cho quản lý tính năng.

## Tính năng

* Giao diện quản lý định nghĩa tính năng
  * IFeatureDefinitionAppService
  * Hỗ trợ các thao tác CRUD trên định nghĩa tính năng
* Giao diện quản lý định nghĩa nhóm tính năng
  * IFeatureGroupDefinitionAppService
  * Hỗ trợ các thao tác CRUD trên định nghĩa nhóm tính năng
* Định nghĩa DTO đầy đủ
  * FeatureDefinitionDto
  * FeatureGroupDefinitionDto
  * DTO tạo, cập nhật và truy vấn
* Định nghĩa quyền
  * Quyền quản lý định nghĩa tính năng
  * Quyền quản lý định nghĩa nhóm tính năng

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpFeatureManagementDomainSharedModule),
    typeof(VoloAbpFeatureManagementApplicationContractsModule))]
public class AbpFeatureManagementApplicationContractsModule : AbpModule
{
}
```

## Hằng số quyền

```csharp
public static class FeatureManagementPermissionNames
{
    public const string GroupName = "FeatureManagement";

    public static class GroupDefinition
    {
        public const string Default = GroupName + ".GroupDefinitions";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }

    public static class Definition
    {
        public const string Default = GroupName + ".Definitions";
        public const string Create = Default + ".Create";
        public const string Update = Default + ".Update";
        public const string Delete = Default + ".Delete";
    }
}
```

## Mã lỗi

* Error:100001 - Định nghĩa tính năng đã tồn tại
* Error:100002 - Định nghĩa nhóm tính năng đã tồn tại
* Error:100003 - Không thể xóa định nghĩa tính năng tĩnh
* Error:100004 - Không thể xóa định nghĩa nhóm tính năng tĩnh

## Thông tin thêm

* [Tài liệu quản lý tính năng ABP](https://docs.abp.io/en/abp/latest/Features)
* [Tài liệu dịch vụ ứng dụng ABP](https://docs.abp.io/en/abp/latest/Application-Services)

[English](README.EN.md)
