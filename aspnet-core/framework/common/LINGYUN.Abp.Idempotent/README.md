# LINGYUN.Abp.Idempotent

Module kiểm tra tính lũy đẳng (idempotency) của API, dùng để ngăn việc gửi trùng lặp API và đảm bảo các lần gọi API là lũy đẳng.

## Tính năng

* Tự động kiểm tra tính lũy đẳng
* Hỗ trợ tạo khóa lũy đẳng tùy chỉnh
* Cấu hình thời gian chờ linh hoạt
* Hỗ trợ khóa phân tán
* Hỗ trợ thông báo lỗi đa ngôn ngữ
* Hỗ trợ bỏ qua API hoặc phương thức cụ thể

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Idempotent
```

## Cấu hình sử dụng

```csharp
[DependsOn(typeof(AbpIdempotentModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpIdempotentOptions>(options =>
        {
            // Bật kiểm tra lũy đẳng trên toàn cục
            options.IsEnabled = true;
            // Mặc định mỗi API có thời gian chờ 5 giây
            options.DefaultTimeout = 5000;
            // Tên token lũy đẳng, truyền qua HttpHeader
            options.IdempotentTokenName = "X-With-Idempotent-Token";
            // Mã phản hồi Http khi kiểm tra lũy đẳng thất bại
            options.HttpStatusCode = 429;
        });
    }
}
```

## Giải thích các mục cấu hình

* `IsEnabled` - Có bật kiểm tra lũy đẳng hay không, mặc định: false
* `DefaultTimeout` - Thời gian chờ kiểm tra lũy đẳng mặc định (mili giây), mặc định: 5000
* `IdempotentTokenName` - Tên HTTP header của token lũy đẳng, mặc định: X-With-Idempotent-Token
* `HttpStatusCode` - Mã trạng thái HTTP khi kiểm tra lũy đẳng thất bại, mặc định: 429 (Too Many Requests)

## Ví dụ sử dụng

### 1. Sử dụng cơ bản

```csharp
[Idempotent]
public class OrderAppService : ApplicationService
{
    public async Task<OrderDto> CreateAsync(CreateOrderDto input)
    {
        // Phương thức sẽ tự động thực hiện kiểm tra lũy đẳng
        return await _orderRepository.CreateAsync(input);
    }
}
```

### 2. Khóa lũy đẳng tùy chỉnh

```csharp
[Idempotent(
    iodempotentKey: "custom-key", 
    timeout: 10000,
    keyMap: new[] { "orderId", "userId" })]
public async Task<OrderDto> UpdateAsync(UpdateOrderDto input)
{
    return await _orderRepository.UpdateAsync(input);
}
```

### 3. Bỏ qua kiểm tra lũy đẳng

```csharp
[IgnoreIdempotent]
public async Task<OrderDto> QueryAsync(string orderId)
{
    return await _orderRepository.GetAsync(orderId);
}
```

## Lưu ý

1. Mặc định bật kiểm tra lũy đẳng cho tất cả các service kế thừa `ICreateAppService`, `IUpdateAppService` và `IDeleteAppService`
2. Có thể dùng đặc tính `[IgnoreIdempotent]` để bỏ qua kiểm tra lũy đẳng cho phương thức cụ thể
3. Kiểm tra lũy đẳng được triển khai dựa trên khóa phân tán, đảm bảo tính đúng đắn trong môi trường phân tán
4. Nên bật kiểm tra lũy đẳng trên tất cả các API thay đổi dữ liệu

## Liên kết

* [English document](./README.EN.md)
