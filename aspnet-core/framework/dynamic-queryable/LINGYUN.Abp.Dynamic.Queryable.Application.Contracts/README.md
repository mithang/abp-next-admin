# LINGYUN.Abp.Dynamic.Queryable.Application.Contracts

Module hợp đồng dịch vụ ứng dụng truy vấn động, định nghĩa các interface và DTO liên quan đến truy vấn động.

## Tính năng

* Định nghĩa interface dịch vụ ứng dụng truy vấn động `IDynamicQueryableAppService<TEntityDto>`
* Cung cấp các định nghĩa DTO liên quan đến truy vấn động
* Hỗ trợ định nghĩa tùy chọn tham số và toán tử so sánh

## Cấu hình sử dụng

1. Cài đặt gói NuGet `LINGYUN.Abp.Dynamic.Queryable.Application.Contracts`

2. Thêm `[DependsOn(typeof(AbpDynamicQueryableApplicationContractsModule))]` vào lớp module của bạn

### Mô tả interface

```csharp
public interface IDynamicQueryableAppService<TEntityDto>
{
    // Lấy danh sách các trường khả dụng
    Task<ListResultDto<DynamicParamterDto>> GetAvailableFieldsAsync();

    // Truy vấn dữ liệu theo điều kiện động
    Task<PagedResultDto<TEntityDto>> SearchAsync(GetListByDynamicQueryableInput dynamicInput);
}
```

### Mô tả DTO

* `DynamicParamterDto` - DTO tham số động
  * `Name` - Tên trường
  * `Type` - Kiểu trường
  * `Description` - Mô tả trường
  * `JavaScriptType` - Kiểu JavaScript
  * `AvailableComparator` - Các toán tử so sánh khả dụng
  * `Options` - Tùy chọn tham số (dùng cho kiểu enum)

* `ParamterOptionDto` - DTO tùy chọn tham số
  * `Key` - Khóa tùy chọn
  * `Value` - Giá trị tùy chọn

* `GetListByDynamicQueryableInput` - DTO đầu vào truy vấn động
  * `SkipCount` - Số bản ghi bỏ qua
  * `MaxResultCount` - Số bản ghi tối đa trả về
  * `Queryable` - Điều kiện truy vấn

## Liên kết liên quan

* [LINGYUN.Linq.Dynamic.Queryable](../LINGYUN.Linq.Dynamic.Queryable/README.md)
* [LINGYUN.Abp.Dynamic.Queryable.Application](../LINGYUN.Abp.Dynamic.Queryable.Application/README.md)
