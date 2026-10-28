# LINGYUN.Abp.TextTemplating.Razor

## Mô tả mô-đun

Mô-đun engine Razor cho mẫu văn bản, cung cấp triển khai kết xuất mẫu dựa trên cú pháp Razor.

### Mô-đun cơ sở

* Volo.Abp.TextTemplating.Razor
* LINGYUN.Abp.TextTemplating.Domain

### Định nghĩa tính năng

* Cung cấp engine kết xuất mẫu Razor
  * RazorTemplateRenderingEngine - Triển khai engine kết xuất mẫu Razor
* Hỗ trợ các tính năng sau
  * Viết mẫu bằng cú pháp Razor
  * Hỗ trợ model binding và view kiểu mạnh
  * Hỗ trợ mẫu bố cục
  * Hỗ trợ partial view
  * Hỗ trợ mã hóa và giải mã HTML
  * Hỗ trợ câu lệnh điều kiện và vòng lặp
  * Hỗ trợ biểu thức C#

### Cách sử dụng

1. Thêm dependency `AbpTextTemplatingRazorModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingRazorModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Tạo và sử dụng mẫu Razor

```csharp
// Tạo định nghĩa mẫu
var template = new TextTemplateDefinition(
    Guid.NewGuid(),
    "Welcome",
    "Welcome Email Template",
    renderEngine: "Razor");

// Ví dụ nội dung mẫu
@model WelcomeEmailModel

<!DOCTYPE html>
<html>
<body>
    <h1>Welcome @Model.UserName!</h1>
    <p>Thank you for joining us.</p>
    @if (Model.IsFirstTime)
    {
        <p>Here are some tips to get started...</p>
    }
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

    public async Task<string> RenderWelcomeEmailAsync(string userName, bool isFirstTime)
    {
        var model = new WelcomeEmailModel
        {
            UserName = userName,
            IsFirstTime = isFirstTime
        };

        return await _templateRenderer.RenderAsync(
            "Welcome",
            model
        );
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
