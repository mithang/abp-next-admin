# LINGYUN.Abp.TextTemplating.Domain

## Mô tả module

Module lĩnh vực mẫu văn bản, cung cấp chức năng cốt lõi quản lý định nghĩa và nội dung mẫu văn bản.

### Module cơ sở

* Volo.Abp.TextTemplating
* Volo.Abp.Ddd.Domain

### Định nghĩa chức năng

* Cung cấp thực thể lĩnh vực của định nghĩa mẫu văn bản
  * TextTemplateDefinition - Thực thể định nghĩa mẫu văn bản
  * TextTemplateContent - Thực thể nội dung mẫu văn bản
* Cung cấp giao diện kho lưu trữ của định nghĩa mẫu văn bản
  * ITextTemplateDefinitionRepository - Giao diện kho lưu trữ định nghĩa mẫu văn bản
  * ITextTemplateContentRepository - Giao diện kho lưu trữ nội dung mẫu văn bản
* Cung cấp dịch vụ lĩnh vực quản lý mẫu văn bản
  * TextTemplateManager - Trình quản lý mẫu văn bản
  * IStaticTemplateDefinitionStore - Kho lưu trữ định nghĩa mẫu tĩnh
  * IDynamicTemplateDefinitionStore - Kho lưu trữ định nghĩa mẫu động

### Dịch vụ lĩnh vực

* TextTemplateManager
  * Quản lý việc tạo, cập nhật, xóa mẫu văn bản
  * Xử lý liên kết giữa định nghĩa mẫu và nội dung
  * Hỗ trợ quản lý định nghĩa mẫu tĩnh và động

### Thuộc tính thực thể

* TextTemplateDefinition
  * Name - Tên mẫu
  * DisplayName - Tên hiển thị
  * IsLayout - Có phải mẫu bố cục hay không
  * Layout - Tên bố cục
  * IsInlineLocalized - Có bản địa hóa nội tuyến hay không
  * DefaultCultureName - Tên văn hóa mặc định
  * LocalizationResourceName - Tên tài nguyên bản địa hóa
  * RenderEngine - Công cụ kết xuất
  * IsStatic - Có phải mẫu tĩnh hay không

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingDomainModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingDomainModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng trình quản lý mẫu văn bản

```csharp
public class YourService
{
    private readonly TextTemplateManager _templateManager;

    public YourService(TextTemplateManager templateManager)
    {
        _templateManager = templateManager;
    }

    public async Task ManageTemplateAsync()
    {
        // Tạo định nghĩa mẫu
        var template = new TextTemplateDefinition(
            Guid.NewGuid(),
            "TemplateName",
            "Template Display Name",
            renderEngine: "Razor");

        await _templateManager.CreateAsync(template);
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
