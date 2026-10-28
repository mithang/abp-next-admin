# LINGYUN.Abp.OpenApi.IdentityServer

Mô-đun tích hợp OpenApi IdentityServer, cung cấp triển khai lưu trữ AppKey/AppSecret dựa trên IdentityServer.

## Tính năng

* Lưu trữ AppKey/AppSecret dựa trên IdentityServer
* Tự động ánh xạ AppKey thành định danh máy khách IdentityServer
* Tự động ánh xạ AppSecret thành khóa máy khách
* Hỗ trợ cấu hình thời hạn hiệu lực chữ ký
* Hỗ trợ cấu hình tên máy khách
* Tự động tạo và cập nhật thông tin máy khách

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.OpenApi.IdentityServer
```

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpOpenApiIdentityServerModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Nguyên lý hoạt động

1. Ánh xạ AppKey
   * AppKey sẽ được ánh xạ thành ClientId của IdentityServer
   * Truy vấn và quản lý máy khách thông qua giao diện `IClientRepository`

2. Ánh xạ AppSecret
   * AppSecret sẽ được ánh xạ thành khóa máy khách (Client Secret)
   * Khóa sẽ được lưu trữ với AppSecret làm định danh

3. Thời hạn hiệu lực chữ ký
   * SignLifetime sẽ được lưu trữ dưới dạng thuộc tính tùy chỉnh của máy khách
   * Tên thuộc tính là "SignLifetime", giá trị là số giây hiệu lực

## Cách sử dụng cơ bản

1. Lưu trữ thông tin đăng nhập của ứng dụng
   ```csharp
   public class YourService
   {
       private readonly IAppKeyStore _appKeyStore;

       public YourService(IAppKeyStore appKeyStore)
       {
           _appKeyStore = appKeyStore;
       }

       public async Task CreateAppAsync()
       {
           var descriptor = new AppDescriptor(
               appName: "Ứng dụng kiểm thử",
               appKey: "your-app-key",
               appSecret: "your-app-secret",
               signLifeTime: 300  // Thời hạn hiệu lực 5 phút
           );

           await _appKeyStore.StoreAsync(descriptor);
       }
   }
   ```

2. Truy vấn thông tin đăng nhập của ứng dụng
   ```csharp
   public class YourService
   {
       private readonly IAppKeyStore _appKeyStore;

       public YourService(IAppKeyStore appKeyStore)
       {
           _appKeyStore = appKeyStore;
       }

       public async Task<AppDescriptor> GetAppAsync(string appKey)
       {
           return await _appKeyStore.FindAsync(appKey);
       }
   }
   ```

## Thông tin thêm

* [LINGYUN.Abp.OpenApi](../LINGYUN.Abp.OpenApi/README.md)
* [LINGYUN.Abp.OpenApi.Authorization](../LINGYUN.Abp.OpenApi.Authorization/README.md)
* [IdentityServer](https://identityserver4.readthedocs.io/)
