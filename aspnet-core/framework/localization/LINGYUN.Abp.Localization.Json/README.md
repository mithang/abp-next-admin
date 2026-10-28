# LINGYUN.Abp.Localization.Json

## Mô tả mô-đun

Tích hợp hệ thống tệp cục bộ Json của thành phần bản địa hóa  

Thành phần này dựa trên PhysicalFileProvider  

### Mô-đun cơ sở  

### Mô-đun nâng cao  

### Định nghĩa quyền  

### Định nghĩa tính năng  

### Định nghĩa cấu hình  

### Cách sử dụng


```csharp

    [DependsOn(
       typeof(AbpLocalizationJsonModule))]
    public class YouProjectModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<YouResource>("en")
                    // Thông thường cấu hình trong dự án máy chủ, ghi đường dẫn tuyệt đối của tệp json được lưu trữ trong dự án máy chủ (bị giới hạn bởi PhysicalFileProvider)
                    // Định dạng tệp json giữ nhất quán với định dạng json mặc định của Abp
                    // Xem chi tiết tại: https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.fileproviders.physicalfileprovider?view=dotnet-plat-ext-5.0
                    .AddPhysicalJson(Path.Combine(Directory.GetCurrentDirectory(), "Resources"));
            });

            // Tương đương với phương thức sau
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                // Ánh xạ hệ thống tệp cục bộ thành hệ thống tệp ảo
                options.FileSets.AddPhysical(Path.Combine(Directory.GetCurrentDirectory(), "Resources"));
            });

            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<YouResource>("en")
                    .AddVirtualJson("/Resources"); // Đường dẫn tệp ảo bản địa hóa json
            });
        }
    }

```

```json

{
  "culture": "en",
  "texts": {
    "Hello China": "Hello China!"
  }
}

```

### Nhật ký cập nhật 
