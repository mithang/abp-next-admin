# LINGYUN.Abp.FeatureManagement.HttpApi

Mô-đun HTTP API quản lý tính năng, cung cấp các giao diện REST API quản lý định nghĩa tính năng。

## Tính năng

* API quản lý định nghĩa tính năng
  * Tạo, cập nhật, xóa định nghĩa tính năng
  * Truy vấn danh sách định nghĩa tính năng
* API quản lý định nghĩa nhóm tính năng
  * Tạo, cập nhật, xóa định nghĩa nhóm tính năng
  * Truy vấn danh sách định nghĩa nhóm tính năng
* Hỗ trợ bản địa hóa
* Tích hợp mô-đun quản lý tính năng ABP

## Phụ thuộc mô-đun

```csharp
[DependsOn(
    typeof(AbpFeatureManagementApplicationContractsModule),
    typeof(VoloAbpFeatureManagementHttpApiModule))]
public class AbpFeatureManagementHttpApiModule : AbpModule
{
}
```

## Tuyến API

### Định nghĩa tính năng

* GET /api/feature-management/definitions
* GET /api/feature-management/definitions/{name}
* POST /api/feature-management/definitions
* PUT /api/feature-management/definitions/{name}
* DELETE /api/feature-management/definitions/{name}

### Định nghĩa nhóm tính năng

* GET /api/feature-management/group-definitions
* GET /api/feature-management/group-definitions/{name}
* POST /api/feature-management/group-definitions
* PUT /api/feature-management/group-definitions/{name}
* DELETE /api/feature-management/group-definitions/{name}

## Cấu hình bản địa hóa

Mô-đun sử dụng hệ thống bản địa hóa của ABP, chủ yếu dùng các tài nguyên sau:
* AbpFeatureManagementResource
* AbpValidationResource

## Thông tin thêm

* [Tài liệu ABP Web API](https://docs.abp.io/en/abp/latest/API/Auto-API-Controllers)
* [Tài liệu quản lý tính năng ABP](https://docs.abp.io/en/abp/latest/Features)

[English](README.EN.md)
