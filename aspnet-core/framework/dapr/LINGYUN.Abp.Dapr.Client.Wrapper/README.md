# LINGYUN.Abp.Dapr.Client.Wrapper

Gọi giữa các service Dapr, giải nén (unwrap) kết quả phản hồi đã được đóng gói

## Tính năng

* Tự động đóng gói/giải nén kết quả phản hồi
* Tích hợp với hệ thống đóng gói của ABP
* Xử lý lỗi tùy chỉnh cho phản hồi đã đóng gói
* Hỗ trợ cấu hình mã thành công/lỗi
* Ánh xạ mã trạng thái HTTP
* Hỗ trợ định dạng đóng gói phản hồi tùy chỉnh
* Tùy chọn kiểm soát đóng gói linh hoạt

## Cấu hình sử dụng

Mô-đun được tham chiếu theo nhu cầu

```csharp
[DependsOn(typeof(AbpDaprClientModule))]
public class AbpDaprClientWrapperModule : AbpModule
{
}
```

## Tùy chọn cấu hình

Mô-đun được cấu hình bằng `AbpWrapperOptions` từ gói `LINGYUN.Abp.Wrapper`:

```json
{
    "Wrapper": {
        "IsEnabled": true,  // Bật/tắt đóng gói phản hồi
        "CodeWithSuccess": "0",  // Mã thành công trong phản hồi đã đóng gói
        "HttpStatusCode": 200,  // Mã trạng thái HTTP mặc định của phản hồi đã đóng gói
        "WrapOnError": true,  // Có đóng gói phản hồi lỗi hay không
        "WrapOnSuccess": true  // Có đóng gói phản hồi thành công hay không
    }
}
```

## Ví dụ triển khai

1. Định nghĩa service

```csharp
public interface IProductService
{
    Task<ProductDto> GetAsync(string id);
    Task<List<ProductDto>> GetListAsync();
    Task<ProductDto> CreateAsync(CreateProductDto input);
}
```

2. Triển khai service

```csharp
public class ProductService : IProductService
{
    private readonly DaprClient _daprClient;

    public ProductService(DaprClient daprClient)
    {
        _daprClient = daprClient;
    }

    public async Task<ProductDto> GetAsync(string id)
    {
        // Lời gọi sẽ tự động xử lý việc đóng gói phản hồi
        return await _daprClient.InvokeMethodAsync<ProductDto>(
            "product-service",  // ID service đích
            $"api/products/{id}",  // Đường dẫn phương thức
            HttpMethod.Get
        );
    }

    public async Task<List<ProductDto>> GetListAsync()
    {
        return await _daprClient.InvokeMethodAsync<List<ProductDto>>(
            "product-service", 
            "api/products",
            HttpMethod.Get
        );
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        return await _daprClient.InvokeMethodAsync<ProductDto>(
            "product-service",
            "api/products",
            HttpMethod.Post,
            input
        );
    }
}
```

## Định dạng phản hồi

Khi bật đóng gói, phản hồi sẽ có định dạng sau:

```json
{
    "code": "0",  // Mã phản hồi, mặc định "0" nghĩa là thành công
    "message": "Success",  // Thông điệp phản hồi
    "details": null,  // Chi tiết bổ sung (tùy chọn)
    "result": {  // Dữ liệu phản hồi thực tế
        // ... Nội dung phản hồi
    }
}
```

## Xử lý lỗi

Mô-đun tự động xử lý phản hồi lỗi:
* Đối với phản hồi đã đóng gói (kèm header `AbpWrapResult`):
  * Giải nén phản hồi và kiểm tra mã
  * Nếu mã không khớp với `CodeWithSuccess`, ném ra `AbpRemoteCallException`
  * Bao gồm thông điệp lỗi, chi tiết và mã trong ngoại lệ
  * Hỗ trợ ánh xạ mã lỗi tùy chỉnh
* Đối với phản hồi chưa đóng gói:
  * Chuyển tiếp phản hồi gốc
  * Sử dụng xử lý lỗi HTTP tiêu chuẩn
  * Giữ nguyên thông tin lỗi gốc

### Ví dụ phản hồi lỗi

```json
{
    "code": "ERROR_001",
    "message": "Không tìm thấy sản phẩm",
    "details": "Không tồn tại sản phẩm có ID '123'",
    "result": null
}
```

## Cách dùng nâng cao

### 1. Kiểm soát việc đóng gói phản hồi

Có thể kiểm soát việc đóng gói phản hồi của từng request riêng lẻ qua header HTTP:

```csharp
// Thêm vào header của request
var headers = new Dictionary<string, string>
{
    { "X-Abp-Wrap-Result", "true" },  // Bắt buộc bật đóng gói
    // hoặc
    { "X-Abp-Dont-Wrap-Result", "true" }  // Bắt buộc tắt đóng gói
};

await _daprClient.InvokeMethodAsync<ProductDto>(
    "product-service",
    "api/products",
    HttpMethod.Get,
    null,
    headers
);
```

### 2. Xử lý lỗi tùy chỉnh

```csharp
public class CustomErrorHandler : IAbpWrapperErrorHandler
{
    public Task HandleAsync(AbpWrapperErrorContext context)
    {
        // Logic xử lý lỗi tùy chỉnh
        if (context.Response.Code == "CUSTOM_ERROR")
        {
            // Xử lý đặc biệt
        }
        return Task.CompletedTask;
    }
}
```

## Lưu ý

* Việc đóng gói phản hồi có thể được kiểm soát bằng các cách sau:
  * Cài đặt toàn cục trong file cấu hình
  * Header HTTP kiểm soát từng request riêng lẻ
  * Kiểm soát động trong code
* Phản hồi lỗi giữ nguyên cấu trúc lỗi gốc ở mức tối đa có thể
* Mô-đun tích hợp với hệ thống xử lý lỗi service từ xa của ABP
* Nên thống nhất sử dụng đóng gói phản hồi trong kiến trúc microservice
* Định dạng đóng gói có thể tùy chỉnh bằng cách kế thừa `IAbpWrapperResponseBuilder`

[Xem bản tiếng Anh](README.EN.md)
