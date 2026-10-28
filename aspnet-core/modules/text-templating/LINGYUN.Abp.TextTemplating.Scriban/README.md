# LINGYUN.Abp.TextTemplating.Scriban

## Mô tả mô-đun

Mô-đun engine Scriban cho mẫu văn bản, cung cấp triển khai kết xuất mẫu dựa trên cú pháp Scriban.

### Mô-đun cơ sở

* Volo.Abp.TextTemplating.Scriban
* LINGYUN.Abp.TextTemplating.Domain

### Định nghĩa tính năng

* Cung cấp engine kết xuất mẫu Scriban
  * ScribanTemplateRenderingEngine - Triển khai engine kết xuất mẫu Scriban
* Hỗ trợ các tính năng sau
  * Viết mẫu bằng cú pháp Scriban
  * Hỗ trợ model binding
  * Hỗ trợ mẫu bố cục
  * Hỗ trợ câu lệnh điều kiện và vòng lặp
  * Hỗ trợ hàm và bộ lọc tùy chỉnh
  * Hỗ trợ thao tác và định dạng chuỗi
  * Hỗ trợ thao tác mảng và đối tượng

### Cách sử dụng

1. Thêm dependency `AbpTextTemplatingScribanModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingScribanModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tạo và sử dụng mẫu Scriban

```csharp
// Tạo định nghĩa mẫu
var template = new TextTemplateDefinition(
    Guid.NewGuid(),
    "Welcome",
    "Welcome Email Template",
    renderEngine: "Scriban");

// Ví dụ nội dung mẫu
<!DOCTYPE html>
<html>
<body>
    <h1>Welcome {{ user.name }}!</h1>
    <p>Thank you for joining us.</p>
    {{ if is_first_time }}
        <p>Here are some tips to get started...</p>
    {{ end }}
    <ul>
    {{ for item in items }}
        <li>{{ item.name }}: {{ item.description }}</li>
    {{ end }}
    </ul>
</body>
</html>

// Sử dụng mẫu
public class YourService
{
    private readonly ITemplateRenderer _templateRenderer;

    public YourService(ITemplateRenderer templateRenderer)
    {
        _templateRenderer = templateRenderer;
    }

    public async Task<string> RenderWelcomeEmailAsync(
        string userName, 
        bool isFirstTime,
        List<Item> items)
    {
        var model = new Dictionary<string, object>
        {
            ["user"] = new { name = userName },
            ["is_first_time"] = isFirstTime,
            ["items"] = items
        };

        return await _templateRenderer.RenderAsync(
            "Welcome",
            model
        );
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
