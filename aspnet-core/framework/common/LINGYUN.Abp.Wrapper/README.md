# LINGYUN.Abp.Wrapper

Mô-đun wrapper, dùng để đóng gói thống nhất kết quả trả về của API và xử lý ngoại lệ.

## Tính năng

* Đóng gói thống nhất kết quả trả về
* Cơ chế xử lý ngoại lệ linh hoạt
* Hỗ trợ nhiều chính sách bỏ qua
* Xử lý kết quả rỗng có thể cấu hình
* Bộ xử lý ngoại lệ tùy chỉnh

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.Wrapper
```

## Cấu hình và sử dụng

```csharp
[DependsOn(typeof(AbpWrapperModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpWrapperOptions>(options =>
        {
            // Bật wrapper
            options.IsEnabled = true;
            
            // Tùy chỉnh mã lỗi của ngoại lệ chưa được xử lý
            options.CodeWithUnhandled = "500";
            
            // Bỏ qua URL có tiền tố cụ thể
            options.IgnorePrefixUrls.Add("/api/health");
            
            // Thêm bộ xử lý ngoại lệ tùy chỉnh
            options.AddHandler<CustomException>(new CustomExceptionHandler());
        });
    }
}
```

## Giải thích các mục cấu hình

*	AbpWrapperOptions.IsEnabled						Có đóng gói kết quả trả về hay không, mặc định: false  
*	AbpWrapperOptions.CodeWithUnhandled				Mã lỗi trả về khi xuất hiện ngoại lệ chưa được xử lý, mặc định 500  
*	AbpWrapperOptions.CodeWithSuccess				Mã trả về khi xử lý thành công, mặc định 0  
*	AbpWrapperOptions.ErrorWithEmptyResult			Khi yêu cầu tài nguyên, nếu tài nguyên rỗng thì có trả về thông báo lỗi hay không, mặc định false    
*	AbpWrapperOptions.HttpStatusCode				Mã phản hồi Http sau khi đóng gói, mặc định: 200
*	AbpWrapperOptions.CodeWithEmptyResult			Mã lỗi trả về khi trả về đối tượng rỗng, mặc định: 404  
*	AbpWrapperOptions.MessageWithEmptyResult		Thông báo lỗi trả về khi trả về đối tượng rỗng, mặc định: Not Found  

*	AbpWrapperOptions.IgnorePrefixUrls				Chỉ định những địa chỉ bắt đầu bằng Url nào không cần xử lý  
*	AbpWrapperOptions.IgnoreNamespaces				Chỉ định những namespace bắt đầu bằng nào không cần xử lý  
*	AbpWrapperOptions.IgnoreControllers				Chỉ định những controller nào không cần xử lý  
*	AbpWrapperOptions.IgnoreReturnTypes				Chỉ định những kiểu kết quả trả về nào không cần xử lý  
*	AbpWrapperOptions.IgnoreExceptions				Chỉ định những kiểu ngoại lệ nào không cần xử lý  
*	AbpWrapperOptions.IgnoredInterfaces				Chỉ định những giao diện nào không cần xử lý (mặc định giao diện triển khai **IWrapDisabled** sẽ không được xử lý)  


## Ví dụ sử dụng

### 1. Sử dụng cơ bản

```csharp
public class TestController : AbpController
{
    public async Task<WrapResult<string>> GetAsync()
    {
        return new WrapResult<string>("0", "Hello World");
    }
}
```

### 2. Bỏ qua đóng gói

```csharp
[IgnoreWrapResult]
public class HealthController : AbpController
{
    public async Task<string> GetAsync()
    {
        return "OK";
    }
}
```

### 3. Xử lý ngoại lệ tùy chỉnh

```csharp
public class CustomExceptionHandler : IExceptionWrapHandler
{
    public void Wrap(ExceptionWrapContext context)
    {
        context.WithCode("CUSTOM_ERROR")
               .WithMessage("Đã xảy ra ngoại lệ tùy chỉnh")
               .WithDetails(context.Exception.Message);
    }
}
```

## Liên kết

* [English document](./README.EN.md)
