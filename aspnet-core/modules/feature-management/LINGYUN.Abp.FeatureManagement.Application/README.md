# LINGYUN.Abp.FeatureManagement.Application

Mô-đun dịch vụ ứng dụng quản lý tính năng, cung cấp triển khai dịch vụ quản lý định nghĩa tính năng.

## Tính năng

* Quản lý định nghĩa tính năng
  * Hỗ trợ tạo, cập nhật, xóa định nghĩa tính năng
  * Hỗ trợ bản địa hóa định nghĩa tính năng
  * Hỗ trợ tuần tự hóa kiểu giá trị của định nghĩa tính năng
* Quản lý định nghĩa nhóm tính năng
  * Hỗ trợ tạo, cập nhật, xóa định nghĩa nhóm tính năng
  * Hỗ trợ bản địa hóa nhóm tính năng
* Hỗ trợ lưu trữ định nghĩa tính năng tĩnh và động
* Tích hợp mô-đun quản lý tính năng ABP

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpFeatureManagementApplicationContractsModule),
    typeof(VoloAbpFeatureManagementApplicationModule))]
public class AbpFeatureManagementApplicationModule : AbpModule
{
}
```

## Định nghĩa quyền

* FeatureManagement.GroupDefinitions
  * FeatureManagement.GroupDefinitions.Create
  * FeatureManagement.GroupDefinitions.Update
  * FeatureManagement.GroupDefinitions.Delete
* FeatureManagement.Definitions
  * FeatureManagement.Definitions.Create
  * FeatureManagement.Definitions.Update
  * FeatureManagement.Definitions.Delete

## Thông tin thêm

* [Tài liệu quản lý tính năng ABP](https://docs.abp.io/en/abp/latest/Features)
* [Thực hành tốt nhất về quản lý tính năng](https://docs.abp.io/en/abp/latest/Best-Practices/Features)

[English](README.EN.md)
