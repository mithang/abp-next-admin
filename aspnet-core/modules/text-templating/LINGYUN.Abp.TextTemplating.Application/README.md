# LINGYUN.Abp.TextTemplating.Application

## Mô tả mô-đun

Mô-đun dịch vụ ứng dụng mẫu văn bản, thực hiện chức năng quản lý và vận hành mẫu văn bản.

### Mô-đun cơ sở

* LINGYUN.Abp.TextTemplating.Application.Contracts
* Volo.Abp.TextTemplating
* Volo.Abp.Ddd.Application

### Định nghĩa chức năng

* Cung cấp dịch vụ quản lý định nghĩa mẫu văn bản
  * TextTemplateDefinitionAppService - Dịch vụ quản lý định nghĩa mẫu
  * TextTemplateContentAppService - Dịch vụ quản lý nội dung mẫu
* Triển khai các giao diện dịch vụ ứng dụng sau
  * ITextTemplateDefinitionAppService
  * ITextTemplateContentAppService

### Dịch vụ ứng dụng

* TextTemplateDefinitionAppService
  * GetAsync - Lấy định nghĩa mẫu
  * GetListAsync - Lấy danh sách định nghĩa mẫu
  * CreateAsync - Tạo định nghĩa mẫu
  * UpdateAsync - Cập nhật định nghĩa mẫu
  * DeleteAsync - Xóa định nghĩa mẫu
* TextTemplateContentAppService
  * GetAsync - Lấy nội dung mẫu
  * UpdateAsync - Cập nhật nội dung mẫu
  * DeleteAsync - Xóa nội dung mẫu
  * RestoreAsync - Khôi phục nội dung mẫu

### Quyền

* AbpTextTemplating.TextTemplateDefinitions
  * Create - Tạo định nghĩa mẫu
  * Update - Cập nhật định nghĩa mẫu
  * Delete - Xóa định nghĩa mẫu
* AbpTextTemplating.TextTemplateContents
  * Update - Cập nhật nội dung mẫu
  * Delete - Xóa nội dung mẫu

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingApplicationModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingApplicationModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tiêm và sử dụng dịch vụ mẫu

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
        // Tạo định nghĩa mẫu
        var template = await _templateDefinitionAppService.CreateAsync(
            new TextTemplateDefinitionCreateDto
            {
                Name = "TemplateName",
                DisplayName = "Template Display Name",
                RenderEngine = "Razor"
            });
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
