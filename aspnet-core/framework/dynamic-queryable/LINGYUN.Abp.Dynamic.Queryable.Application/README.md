# LINGYUN.Abp.Dynamic.Queryable.Application

Mô-đun dịch vụ ứng dụng truy vấn động, cung cấp triển khai chức năng truy vấn động dựa trên framework ABP.

## Tính năng

* Cung cấp lớp cơ sở dịch vụ ứng dụng truy vấn động `DynamicQueryableAppService<TEntity, TEntityDto>`
* Tự động tạo danh sách trường khả dụng, hỗ trợ bản địa hóa trường
* Hỗ trợ lọc và bỏ qua trường
* Hỗ trợ tạo danh sách tùy chọn cho kiểu enum

## Cấu hình và sử dụng

1. Cài đặt gói NuGet `LINGYUN.Abp.Dynamic.Queryable.Application`

2. Thêm `[DependsOn(typeof(AbpDynamicQueryableApplicationModule))]` vào lớp mô-đun của bạn

3. Tùy chọn cấu hình (tùy chọn)

```csharp
Configure<AbpDynamicQueryableOptions>(options =>
{
    // Thêm các trường cần bỏ qua
    options.IgnoreFields.Add("FieldName");
});
```

### Triển khai dịch vụ truy vấn động

```csharp
public class MyEntityAppService : DynamicQueryableAppService<MyEntity, MyEntityDto>
{
    private readonly IRepository<MyEntity> _repository;

    public MyEntityAppService(IRepository<MyEntity> repository)
    {
        _repository = repository;
    }

    protected override async Task<int> GetCountAsync(Expression<Func<MyEntity, bool>> condition)
    {
        return await _repository.CountAsync(condition);
    }

    protected override async Task<List<MyEntity>> GetListAsync(
        Expression<Func<MyEntity, bool>> condition,
        GetListByDynamicQueryableInput dynamicInput)
    {
        return await _repository
            .Where(condition)
            .PageBy(dynamicInput.SkipCount, dynamicInput.MaxResultCount)
            .ToListAsync();
    }

    protected override List<TEntityDto> MapToEntitiesDto(List<MyEntity> entities)
    {
        return ObjectMapper.Map<List<MyEntity>, List<MyEntityDto>>(entities);
    }

    // Tùy chỉnh các trường cần bỏ qua (tùy chọn)
    protected override IEnumerable<string> GetUserDefineIgnoreFields()
    {
        return new[] { "CustomField" };
    }
}
```

### Mô tả các mục cấu hình

* `IgnoreFields` - Danh sách các trường cần bỏ qua trong truy vấn
  * Mặc định bao gồm: các trường kiểm toán như Id, TenantId, IsDeleted, DeleterId, DeletionTime

## Liên kết liên quan

* [LINGYUN.Linq.Dynamic.Queryable](../LINGYUN.Linq.Dynamic.Queryable/README.md)
* [LINGYUN.Abp.Dynamic.Queryable.Application.Contracts](../LINGYUN.Abp.Dynamic.Queryable.Application.Contracts/README.md)
