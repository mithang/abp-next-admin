# LINGYUN.Abp.TextTemplating.Domain.Shared

## Mô tả mô-đun

Mô-đun miền dùng chung mẫu văn bản, cung cấp các định nghĩa dùng chung liên quan đến mẫu văn bản như hằng số, liệt kê, ngoại lệ.

### Mô-đun cơ sở

* Volo.Abp.TextTemplating
* Volo.Abp.Validation

### Định nghĩa chức năng

* Cung cấp định nghĩa hằng số liên quan đến mẫu văn bản
  * TextTemplateDefinitionConsts - Hằng số liên quan đến định nghĩa mẫu
  * TextTemplateContentConsts - Hằng số liên quan đến nội dung mẫu
* Cung cấp định nghĩa mã lỗi liên quan đến mẫu văn bản
  * AbpTextTemplatingErrorCodes - Hằng số mã lỗi
* Cung cấp định nghĩa tài nguyên bản địa hóa
  * AbpTextTemplatingResource - Tài nguyên bản địa hóa

### Định nghĩa hằng số

* TextTemplateDefinitionConsts
  * MaxNameLength - Độ dài tối đa của tên mẫu (64)
  * MaxDisplayNameLength - Độ dài tối đa của tên hiển thị (128)
  * MaxLayoutLength - Độ dài tối đa của tên bố cục (256)
  * MaxDefaultCultureNameLength - Độ dài tối đa của tên văn hóa mặc định (10)
  * MaxLocalizationResourceNameLength - Độ dài tối đa của tên tài nguyên bản địa hóa (128)
  * MaxRenderEngineLength - Độ dài tối đa của tên công cụ kết xuất (64)

### Mã lỗi

* AbpTextTemplatingErrorCodes
  * TextTemplateDefinition:NameAlreadyExists - Tên mẫu đã tồn tại
  * TextTemplateDefinition:NotFound - Định nghĩa mẫu không tồn tại

### Cách sử dụng

1. Thêm phụ thuộc `AbpTextTemplatingDomainSharedModule`

```csharp
[DependsOn(typeof(AbpTextTemplatingDomainSharedModule))]
public class YouProjectModule : AbpModule
{
}
```

2. Sử dụng hằng số và mã lỗi

```csharp
public class YourService
{
    public void ValidateTemplateName(string name)
    {
        if (name.Length > TextTemplateDefinitionConsts.MaxNameLength)
        {
            throw new BusinessException(AbpTextTemplatingErrorCodes.TextTemplateDefinition.NameAlreadyExists);
        }
    }
}
```

[Xem tiếng Anh](README.EN.md)
