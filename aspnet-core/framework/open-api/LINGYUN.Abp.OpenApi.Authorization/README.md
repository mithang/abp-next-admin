# LINGYUN.Abp.OpenApi.Authorization

Mô-đun middleware xác thực và ủy quyền OpenApi, cung cấp chức năng middleware xác thực chữ ký API dựa trên AppKey/AppSecret cho ứng dụng ABP.

## Tính năng

* Cung cấp middleware xác thực OpenApi
* Hỗ trợ xác minh chữ ký yêu cầu
* Hỗ trợ chống tấn công phát lại (xác minh số ngẫu nhiên Nonce)
* Hỗ trợ xác minh dấu thời gian của yêu cầu
* Hỗ trợ xác minh danh sách trắng máy khách
* Hỗ trợ xác minh danh sách trắng địa chỉ IP
* Hỗ trợ logic xác thực tùy chỉnh
* Hỗ trợ xử lý ngoại lệ và đóng gói thông báo lỗi

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenApi.Authorization
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpOpenApiAuthorizationModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Cách dùng cơ bản

1. Bật middleware xác thực OpenApi
   ```csharp
   public void Configure(IApplicationBuilder app)
   {
       // Thêm middleware xác thực OpenApi
       app.UseOpenApiAuthorization();
   }
   ```

2. Dịch vụ xác thực tùy chỉnh (tùy chọn)
   ```csharp
   public class CustomOpenApiAuthorizationService : OpenApiAuthorizationService
   {
       public CustomOpenApiAuthorizationService(
           INonceStore nonceStore,
           IAppKeyStore appKeyStore,
           IClientChecker clientChecker,
           IIpAddressChecker ipAddressChecker,
           IWebClientInfoProvider clientInfoProvider,
           IOptionsMonitor<AbpOpenApiOptions> options,
           IOptions<AbpExceptionHandlingOptions> exceptionHandlingOptions)
           : base(nonceStore, appKeyStore, clientChecker, ipAddressChecker,
                 clientInfoProvider, options, exceptionHandlingOptions)
       {
       }

       // Ghi đè logic xác thực
       public override async Task<bool> AuthorizeAsync(HttpContext httpContext)
       {
           // Triển khai logic xác thực tùy chỉnh
           return await base.AuthorizeAsync(httpContext);
       }
   }
   ```

## Quy trình xác thực

1. Xác minh địa chỉ IP của máy khách
   * Xác minh qua giao diện `IIpAddressChecker` xem địa chỉ IP của máy khách có nằm trong phạm vi cho phép hay không

2. Xác minh thông tin đăng nhập của ứng dụng
   * Xác minh AppKey, chữ ký, số ngẫu nhiên và dấu thời gian trong tiêu đề yêu cầu
   * Lấy thông tin ứng dụng qua giao diện `IAppKeyStore`
   * Xác minh qua giao diện `IClientChecker` xem máy khách có được phép truy cập hay không
   * Xác minh tính hợp lệ và hiệu lực theo thời gian của chữ ký

## Quy tắc chữ ký

1. Các tham số yêu cầu được sắp xếp theo mã ASCII của tên tham số từ nhỏ đến lớn
2. Sử dụng mã hóa URL (UTF-8) để chuyển các tham số đã sắp xếp thành chuỗi truy vấn
3. Nối đường dẫn yêu cầu với chuỗi truy vấn rồi mã hóa MD5 để thu được chữ ký

Ví dụ:
```
Đường dẫn yêu cầu:/api/test
Tham số:
  appKey=test
  appSecret=123456
  nonce=abc
  t=1577808000000

Tính chữ ký:
1. Sắp xếp và nối tham số:appKey=test&appSecret=123456&nonce=abc&t=1577808000000
2. Nối đường dẫn yêu cầu:/api/test?appKey=test&appSecret=123456&nonce=abc&t=1577808000000
3. Mã hóa URL và mã hóa MD5 để thu được chữ ký cuối cùng
```

## Thông tin thêm

* [LINGYUN.Abp.OpenApi](../LINGYUN.Abp.OpenApi/README.md)
* [Khung ABP](https://abp.io/)
