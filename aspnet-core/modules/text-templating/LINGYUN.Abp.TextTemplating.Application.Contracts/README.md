# LINGYUN.Abp.TextTemplating.Application.Contracts

## Mô tả mô-đun

Mô-đun hợp đồng dịch vụ ứng dụng mẫu văn bản, cung cấp định nghĩa giao diện và DTO liên quan đến quản lý mẫu văn bản.

### Mô-đun cơ sở

* Volo.Abp.TextTemplating
* Volo.Abp.Ddd.Application.Contracts

### Định nghĩa chức năng

* Cung cấp giao diện dịch vụ ứng dụng quản lý mẫu văn bản
  * ITextTemplateDefinitionAppService - Giao diện dịch vụ quản lý định nghĩa mẫu
  * ITextTemplateContentAppService - Giao diện dịch vụ quản lý nội dung mẫu
* Cung cấp định nghĩa DTO liên quan đến mẫu văn bản
  * TextTemplateDefinitionDto - DTO định nghĩa mẫu
  * TextTemplateContentDto - DTO nội dung mẫu
  * TextTemplateDefinitionCreateDto - DTO tạo định nghĩa mẫu
  * TextTemplateDefinitionUpdateDto - DTO cập nhật định nghĩa mẫu
  * TextTemplateContentUpdateDto - DTO cập nhật nội dung mẫu
* Cung cấp định nghĩa quyền liên quan đến quản lý mẫu văn bản

### Định nghĩa quyền

* AbpTextTemplating.TextTemplateDefinitions
  * Create - Tạo định nghĩa mẫu
  * Update - Cập nhật định nghĩa mẫu
  * Delete - Xóa định nghĩa mẫu
* AbpTextTemplating.TextTemplateContents
  * Update - Cập nhật nội dung mẫu
  * Delete - Xóa nội dung mẫu

### Giao diện dịch vụ ứng dụng

* ITextTemplateDefinitionAppService
  * GetAsync - Lấy định nghĩa mẫu
  * GetListAsync - Lấy danh sách định nghĩa mẫu
  * CreateAsync - Tạo định nghĩa mẫu
  * UpdateAsync - Cập nhật định nghĩa mẫu
  * DeleteAsync - Xóa định nghĩa mẫu
* ITextTemplateContentAppService
  * GetAsync - Lấy nội dung mẫu
  * UpdateAsync - Cập nhật nội dung mẫu
  * DeleteAsync - Xóa nội dung mẫu
  * RestoreAsync - Khôi phục nội dung mẫu

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingApplicationContractsModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tiêm và sử dụng giao diện dịch vụ mẫu

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

[Xem tài liệu tiếng Anh](README.EN.md)
