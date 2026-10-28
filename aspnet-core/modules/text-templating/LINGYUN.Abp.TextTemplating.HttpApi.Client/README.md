# LINGYUN.Abp.TextTemplating.HttpApi.Client

## Mô tả mô-đun

Mô-đun máy khách HTTP API mẫu văn bản, cung cấp triển khai proxy máy khách HTTP cho quản lý mẫu văn bản.

### Mô-đun cơ sở

* LINGYUN.Abp.TextTemplating.Application.Contracts
* Volo.Abp.Http.Client

### Định nghĩa chức năng

* Cung cấp proxy máy khách HTTP cho quản lý mẫu văn bản
  * TextTemplateDefinitionClientProxy - Proxy máy khách quản lý định nghĩa mẫu
  * TextTemplateContentClientProxy - Proxy máy khách quản lý nội dung mẫu
* Triển khai các giao diện dịch vụ ứng dụng sau
  * ITextTemplateDefinitionAppService
  * ITextTemplateContentAppService

### Mục cấu hình

* AbpTextTemplatingRemoteServiceConsts
  * RemoteServiceName - Tên dịch vụ từ xa (mặc định: "AbpTextTemplating")

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingHttpApiClientModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingHttpApiClientModule))]
public class YouProjectModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Cấu hình dịch vụ từ xa
        Configure<AbpRemoteServiceOptions>(options =>
        {
            options.RemoteServices.Default.BaseUrl = "http://localhost:44315/";
        });
    }
}
```

2. Tiêm và sử dụng proxy máy khách

```csharp
public class YourService
{
    private readonly ITextTemplateDefinitionAppService _templateDefinitionAppService;

    public YourService(ITextTemplateDefinitionAppService templateDefinitionAppService)
    {
        _templateDefinitionAppService = templateDefinitionAppService;
    }

    public async Task ManageTemplateAsync()
    {
        // Lấy danh sách định nghĩa mẫu
        var templates = await _templateDefinitionAppService.GetListAsync(
            new TextTemplateDefinitionGetListInput());
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
