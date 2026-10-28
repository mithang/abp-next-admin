# LINGYUN.Abp.TextTemplating.EntityFrameworkCore

## Mô tả mô-đun

Mô-đun EntityFrameworkCore mẫu văn bản, cung cấp triển khai truy cập dữ liệu cho mẫu văn bản.

### Mô-đun cơ sở

* LINGYUN.Abp.TextTemplating.Domain
* Volo.Abp.EntityFrameworkCore

### Định nghĩa chức năng

* Triển khai giao diện kho lưu trữ mẫu văn bản
  * EfCoreTextTemplateDefinitionRepository - Triển khai kho lưu trữ định nghĩa mẫu
  * EfCoreTextTemplateContentRepository - Triển khai kho lưu trữ nội dung mẫu
* Cung cấp ngữ cảnh cơ sở dữ liệu và cấu hình
  * ITextTemplatingDbContext - Giao diện ngữ cảnh cơ sở dữ liệu mẫu văn bản
  * TextTemplatingDbContext - Ngữ cảnh cơ sở dữ liệu mẫu văn bản
  * TextTemplatingDbContextModelCreatingExtensions - Mở rộng cấu hình mô hình cơ sở dữ liệu

### Bảng cơ sở dữ liệu

* AbpTextTemplateDefinitions - Bảng định nghĩa mẫu
  * Id - Khóa chính
  * Name - Tên mẫu
  * DisplayName - Tên hiển thị
  * IsLayout - Có phải mẫu bố cục hay không
  * Layout - Tên bố cục
  * IsInlineLocalized - Có bản địa hóa nội tuyến hay không
  * DefaultCultureName - Tên văn hóa mặc định
  * LocalizationResourceName - Tên tài nguyên bản địa hóa
  * RenderEngine - Công cụ kết xuất
  * IsStatic - Có phải mẫu tĩnh hay không
* AbpTextTemplateContents - Bảng nội dung mẫu
  * Id - Khóa chính
  * Name - Tên mẫu
  * CultureName - Tên văn hóa
  * Content - Nội dung mẫu

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingEntityFrameworkCoreModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Cấu hình ngữ cảnh cơ sở dữ liệu

```csharp
public class YourDbContext : AbpDbContext<YourDbContext>, ITextTemplatingDbContext
{
    public DbSet<TextTemplateDefinition> TextTemplateDefinitions { get; set; }
    public DbSet<TextTemplateContent> TextTemplateContents { get; set; }

    public YourDbContext(DbContextOptions<YourDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ConfigureTextTemplating();
    }
}
```

[Xem bản tiếng Anh](README.EN.md)
