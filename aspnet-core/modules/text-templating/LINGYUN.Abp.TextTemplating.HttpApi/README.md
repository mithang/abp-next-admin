# LINGYUN.Abp.TextTemplating.HttpApi

## Mô tả mô-đun

Mô-đun HTTP API mẫu văn bản, cung cấp giao diện API RESTful để quản lý mẫu văn bản.

### Mô-đun cơ sở

* LINGYUN.Abp.TextTemplating.Application.Contracts
* Volo.Abp.AspNetCore.Mvc

### Định nghĩa chức năng

* Cung cấp bộ điều khiển API quản lý mẫu văn bản
  * TextTemplateDefinitionController - Bộ điều khiển quản lý định nghĩa mẫu
  * TextTemplateContentController - Bộ điều khiển quản lý nội dung mẫu

### Giao diện API

* /api/text-templating/template-definitions
  * GET - Lấy danh sách định nghĩa mẫu
  * POST - Tạo định nghĩa mẫu
  * PUT - Cập nhật định nghĩa mẫu
  * DELETE - Xóa định nghĩa mẫu
  * GET /{name} - Lấy định nghĩa mẫu đã chỉ định
* /api/text-templating/template-contents
  * GET - Lấy nội dung mẫu
  * PUT - Cập nhật nội dung mẫu
  * DELETE - Xóa nội dung mẫu
  * POST /restore - Khôi phục nội dung mẫu

### Yêu cầu quyền

* AbpTextTemplating.TextTemplateDefinitions
  * Create - Tạo định nghĩa mẫu
  * Update - Cập nhật định nghĩa mẫu
  * Delete - Xóa định nghĩa mẫu
* AbpTextTemplating.TextTemplateContents
  * Update - Cập nhật nội dung mẫu
  * Delete - Xóa nội dung mẫu

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingHttpApiModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingHttpApiModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng giao diện API

```csharp
public class YourService
{
    private readonly HttpClient _httpClient;

    public YourService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task ManageTemplateAsync()
    {
        // Lấy danh sách định nghĩa mẫu
        var response = await _httpClient.GetAsync("/api/text-templating/template-definitions");
        var templates = await response.Content.ReadFromJsonAsync<ListResultDto<TextTemplateDefinitionDto>>();
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
