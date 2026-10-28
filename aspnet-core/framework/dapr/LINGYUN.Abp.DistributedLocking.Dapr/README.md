# LINGYUN.Abp.DistributedLocking.Dapr

Triển khai khóa phân tán ABP dựa trên API khóa phân tán Dapr. Mô-đun này cung cấp tích hợp liền mạch với dịch vụ khóa phân tán Dapr, hỗ trợ chức năng khóa phân tán xuyên dịch vụ, xuyên phiên bản.

Tài liệu tham khảo: [Dapr Distributed Lock API](https://docs.dapr.io/developing-applications/building-blocks/distributed-lock/distributed-lock-api-overview/)

## Tính năng

* Tích hợp với hệ thống khóa phân tán ABP
* Hỗ trợ tùy chỉnh định danh chủ sở hữu tài nguyên khóa
* Hỗ trợ thời gian chờ khóa có thể cấu hình
* Hỗ trợ tự động giải phóng tài nguyên khóa
* Hỗ trợ nhiều thành phần lưu trữ khóa
* Hỗ trợ thông báo sự kiện khi lấy và giải phóng khóa
* Hỗ trợ kiểm tra sức khỏe cho khóa phân tán

## Tùy chọn cấu hình

```json
{
    "DistributedLocking": {
        "Dapr": {
            "StoreName": "lockstore",  // Tên lưu trữ được định nghĩa trong thành phần Dapr
            "DefaultIdentifier": "dapr-lock-owner",  // Định danh chủ sở hữu tài nguyên khóa mặc định
            "DefaultTimeout": "00:00:30"  // Thời gian chờ khóa mặc định (30 giây)
        }
    }
}
```

## Cách dùng cơ bản

### 1. Cấu hình mô-đun

```csharp
[DependsOn(typeof(AbpDistributedLockingDaprModule))]
public class YourProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Cấu hình cơ bản
        Configure<AbpDistributedLockingDaprOptions>(options =>
        {
            options.StoreName = "redis-lock";  // Sử dụng Redis làm bộ lưu trữ khóa
            options.DefaultIdentifier = "my-service";  // Tùy chỉnh định danh chủ sở hữu khóa
            options.DefaultTimeout = TimeSpan.FromMinutes(1);  // Đặt thời gian chờ mặc định là 1 phút
        });
    }
}
```

### 2. Cách dùng cơ bản

```csharp
public class OrderService
{
    private readonly IDistributedLockProvider _lockProvider;

    public OrderService(IDistributedLockProvider lockProvider)
    {
        _lockProvider = lockProvider;
    }

    public async Task ProcessOrderAsync(string orderId)
    {
        // Thử lấy khóa
        using (var handle = await _lockProvider.TryAcquireAsync($"order:{orderId}"))
        {
            if (handle != null)
            {
                try
                {
                    // Thực thi logic nghiệp vụ cần khóa
                    await ProcessOrderInternalAsync(orderId);
                }
                catch (Exception ex)
                {
                    // Xử lý ngoại lệ
                    _logger.LogError(ex, "Đã xảy ra lỗi khi xử lý đơn hàng");
                    throw;
                }
            }
            else
            {
                throw new ConcurrencyException("Đơn hàng đang được xử lý bởi tiến trình khác");
            }
        }
    }
}
```

### 3. Cách dùng nâng cao

```csharp
public class InventoryService
{
    private readonly IDistributedLockProvider _lockProvider;
    private readonly ILogger<InventoryService> _logger;

    public InventoryService(
        IDistributedLockProvider lockProvider,
        ILogger<InventoryService> logger)
    {
        _lockProvider = lockProvider;
        _logger = logger;
    }

    public async Task UpdateInventoryAsync(string productId, int quantity)
    {
        // Cấu hình khóa tùy chỉnh
        var lockOptions = new DistributedLockOptions
        {
            Timeout = TimeSpan.FromSeconds(10),  // Thời gian chờ tùy chỉnh
            RetryDelay = TimeSpan.FromMilliseconds(100)  // Độ trễ thử lại
        };

        try
        {
            using (var handle = await _lockProvider.TryAcquireAsync(
                $"inventory:{productId}",
                lockOptions))
            {
                if (handle == null)
                {
                    _logger.LogWarning("Không thể lấy khóa tồn kho, ID sản phẩm: {ProductId}", productId);
                    throw new ConcurrencyException("Không thể lấy khóa tồn kho");
                }

                // Thực thi thao tác cập nhật tồn kho
                await UpdateInventoryInternalAsync(productId, quantity);
            }
        }
        catch (Exception ex) when (ex is not ConcurrencyException)
        {
            _logger.LogError(ex, "Đã xảy ra lỗi khi cập nhật tồn kho");
            throw;
        }
    }
}
```

## Cấu hình thành phần

### Ví dụ cấu hình bộ lưu trữ khóa Redis

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: redis-lock  # Tương ứng với cấu hình StoreName
spec:
  type: lock.redis
  version: v1
  metadata:
    - name: redisHost
      value: localhost:6379
    - name: redisPassword
      value: ""
    - name: enableTLS
      value: false
    - name: maxRetries
      value: 5
    - name: maxRetryBackoff
      value: 5s
```

### Ví dụ cấu hình bộ lưu trữ khóa Consul

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: consul-lock
spec:
  type: lock.consul
  version: v1
  metadata:
    - name: host
      value: localhost:8500
    - name: sessionTTL
      value: 10
    - name: scheme
      value: http
```

## Giao diện cốt lõi

### ILockOwnerFinder

Giao diện cung cấp định danh chủ sở hữu tài nguyên khóa.

```csharp
public interface ILockOwnerFinder
{
    string GetOwner();
}
```

Triển khai mặc định `LockOwnerFinder` sẽ:
1. Ưu tiên dùng ID người dùng hiện tại làm định danh chủ sở hữu khóa
2. Nếu người dùng chưa đăng nhập, dùng `DefaultIdentifier` đã cấu hình

### Triển khai tùy chỉnh định danh chủ sở hữu khóa

```csharp
public class CustomLockOwnerFinder : ILockOwnerFinder
{
    private readonly ICurrentTenant _currentTenant;

    public CustomLockOwnerFinder(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public string GetOwner()
    {
        // Dùng tổ hợp ID tenant và tên máy làm định danh chủ sở hữu khóa
        return $"{_currentTenant.Id ?? "host"}-{Environment.MachineName}";
    }
}

// Đăng ký triển khai tùy chỉnh
context.Services.AddTransient<ILockOwnerFinder, CustomLockOwnerFinder>();
```

## Thực tiễn tốt nhất

1. **Đặt thời gian chờ hợp lý**
   - Đặt thời gian chờ phù hợp theo thời gian thực thi dự kiến của thao tác nghiệp vụ
   - Tránh đặt thời gian chờ quá dài để ngăn deadlock

2. **Độ chi tiết khóa phù hợp**
   - Phạm vi khóa nên càng nhỏ càng tốt, chỉ khóa tài nguyên cần thiết
   - Tránh giữ khóa lâu, giải phóng kịp thời

3. **Xử lý ngoại lệ**
   - Luôn dùng khóa trong khối using
   - Xử lý đúng cách trường hợp lấy khóa thất bại
   - Ghi nhật ký các thao tác khóa quan trọng

4. **Tối ưu hiệu năng**
   - Dùng thành phần lưu trữ phù hợp
   - Cấu hình chiến lược thử lại phù hợp
   - Giám sát tình hình sử dụng khóa

## Lưu ý

* Đảm bảo Dapr Sidecar đã được cấu hình đúng và đang chạy
* Thành phần khóa phân tán cần được định nghĩa đúng trong cấu hình Dapr
* Đặt thời gian chờ khóa hợp lý, tránh deadlock
* Xử lý đúng cách trường hợp lấy khóa thất bại
* Chú ý ảnh hưởng hiệu năng trong tình huống đồng thời cao
* Nên cấu hình kiểm tra sức khỏe cho thành phần khóa
* Nên thêm ghi nhật ký cho các thao tác quan trọng

[Xem bản tiếng Anh](README.EN.md)
