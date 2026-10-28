# LINGYUN.Abp.MultiTenancy.Editions

Mô-đun quản lý phiên bản đa tenant, cung cấp hỗ trợ chức năng cơ bản cho phiên bản tenant (Edition).

## Tính năng

- Quản lý phiên bản
  - Hỗ trợ gán các phiên bản khác nhau cho tenant
  - Thông tin phiên bản bao gồm ID và tên hiển thị
  - Hỗ trợ lưu trữ và truy xuất thông tin phiên bản
- Công tắc tính năng toàn cục
  - Hỗ trợ điều khiển tính năng phiên bản bằng công tắc tính năng toàn cục
  - Có thể cấu hình linh hoạt việc bật/tắt tính năng phiên bản
- Tích hợp xác thực danh tính
  - Tự động thêm thông tin phiên bản vào Claims của người dùng
  - Hỗ trợ lấy thông tin phiên bản của tenant hiện tại trong ứng dụng
- Khả năng mở rộng
  - Cung cấp giao diện IEditionStore để tùy chỉnh bộ nhớ phiên bản
  - Hỗ trợ nhà cung cấp cấu hình phiên bản tùy chỉnh

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpMultiTenancyEditionsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mô tả cấu hình

### 1. Cấu hình tính năng toàn cục

```csharp
GlobalFeatureManager.Instance.Modules.Editions(editions =>
{
    // Cấu hình các tính năng toàn cục liên quan đến phiên bản tại đây
});
```

### 2. Triển khai bộ nhớ phiên bản

```csharp
public class YourEditionStore : IEditionStore
{
    public async Task<EditionInfo> FindByTenantAsync(Guid tenantId)
    {
        // Triển khai logic lấy thông tin phiên bản tenant từ bộ nhớ
        return new EditionInfo(
            id: Guid.NewGuid(),
            displayName: "Standard Edition"
        );
    }
}
```

### 3. Lấy thông tin phiên bản

```csharp
public class YourService
{
    private readonly IEditionConfigurationProvider _editionProvider;

    public YourService(IEditionConfigurationProvider editionProvider)
    {
        _editionProvider = editionProvider;
    }

    public async Task<EditionConfiguration> GetEditionAsync(Guid? tenantId)
    {
        return await _editionProvider.GetAsync(tenantId);
    }
}
```

## Sử dụng thông tin phiên bản trong Claims

Khi bật tính năng phiên bản, mô-đun sẽ tự động thêm thông tin phiên bản vào Claims của người dùng:

```csharp
public class YourController
{
    public async Task<IActionResult> GetEditionInfo()
    {
        var editionId = User.FindFirstValue(AbpClaimTypes.EditionId);
        // Sử dụng ID phiên bản để thực hiện các thao tác liên quan
    }
}
```

## Lưu ý

1. Cần đảm bảo đã bật công tắc tính năng toàn cục trước khi sử dụng tính năng phiên bản.
2. Việc triển khai bộ nhớ phiên bản cần cân nhắc vấn đề hiệu năng và truy cập đồng thời.
3. Thay đổi thông tin phiên bản có thể ảnh hưởng đến quyền truy cập tính năng của tenant.
4. Thông tin phiên bản trong Claims sẽ tự động cập nhật khi người dùng xác thực.

## Tài liệu khác

- [English Documentation](README.EN.md)
