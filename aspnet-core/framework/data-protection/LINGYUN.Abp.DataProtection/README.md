# LINGYUN.Abp.DataProtection

Mô-đun triển khai quyền dữ liệu, cung cấp phần triển khai cốt lõi của quyền dữ liệu.

## Tính năng

* Bộ chặn quyền dữ liệu - tự động chặn các phương thức được đánh dấu bằng đặc tính quyền dữ liệu
* Dịch vụ xác thực quyền dữ liệu - cung cấp chức năng xác thực quyền dữ liệu
* Bộ lưu trữ tài nguyên quyền dữ liệu - cung cấp triển khai lưu trữ trong bộ nhớ cho tài nguyên quyền dữ liệu

## Mục cấu hình

```csharp
public class AbpDataProtectionOptions
{
    /// <summary>
    /// Có bật quyền dữ liệu hay không
    /// Mặc định: true
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Danh sách nhà cung cấp chủ thể quyền dữ liệu
    /// </summary>
    public IList<IDataAccessSubjectContributor> SubjectContributors { get; }

    /// <summary>
    /// Từ điển nhà cung cấp từ khóa quyền dữ liệu
    /// </summary>
    public IDictionary<string, IDataAccessKeywordContributor> KeywordContributors { get; }

    /// <summary>
    /// Từ điển nhà cung cấp thao tác quyền dữ liệu
    /// </summary>
    public IDictionary<DataAccessFilterOperate, IDataAccessOperateContributor> OperateContributors { get; }

    /// <summary>
    /// Danh sách thuộc tính kiểm toán bị bỏ qua
    /// Mặc định bao gồm:Id, LastModifierId, LastModificationTime, CreatorId, CreationTime, 
    /// IsDeleted, DeleterId, DeletionTime, TenantId, EntityVersion, 
    /// ConcurrencyStamp, ExtraProperties
    /// </summary>
    public IList<string> IgnoreAuditedProperties { get; }
}
```

## Cách sử dụng

1. Cấu hình mô-đun

```csharp
[DependsOn(typeof(AbpDataProtectionModule))]
public class YourModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpDataProtectionOptions>(options =>
        {
            // Cấu hình tùy chọn quyền dữ liệu
            options.IsEnabled = true;
            
            // Thêm nhà cung cấp chủ thể tùy chỉnh
            options.SubjectContributors.Add(new YourSubjectContributor());
            
            // Thêm nhà cung cấp từ khóa tùy chỉnh
            options.KeywordContributors.Add("your-keyword", new YourKeywordContributor());
            
            // Thêm nhà cung cấp thao tác tùy chỉnh
            options.OperateContributors.Add(DataAccessFilterOperate.Equal, new YourOperateContributor());
            
            // Thêm thuộc tính kiểm toán bị bỏ qua
            options.IgnoreAuditedProperties.Add("YourProperty");
        });
    }
}
```

2. Sử dụng đặc tính quyền dữ liệu

```csharp
// Kiểm soát quyền dữ liệu ở cấp lớp
[DataProtected]
public class YourService
{
    // Kiểm soát quyền dữ liệu ở cấp phương thức
    [DataProtected]
    public virtual Task<YourEntity> GetAsync(Guid id)
    {
        // ...
    }

    // Tắt kiểm soát quyền dữ liệu
    [DisableDataProtected]
    public virtual Task<YourEntity> GetWithoutProtectionAsync(Guid id)
    {
        // ...
    }
}
```

## Liên kết liên quan

* [English document](./README.EN.md)
