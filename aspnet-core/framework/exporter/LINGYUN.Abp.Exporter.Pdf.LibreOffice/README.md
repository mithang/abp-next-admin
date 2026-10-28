# LINGYUN.Abp.Exporter.Pdf.LibreOffice

> LibreOffice is Free and Open Source Software. Development is open to new talent and new ideas, and our software is tested and used daily by a large and devoted user community.  

Mô-đun này sử dụng dòng lệnh `LibreOffice` cục bộ để chuyển đổi Excel sang Pdf; trước khi tham chiếu mô-đun này, hãy đảm bảo đã cài đặt `LibreOffice`; nếu chưa cài đặt tại thư mục mặc định, hãy chỉ định thư mục cài đặt thủ công trước khi sử dụng.

## Cấu hình và sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterPdfLibreOfficeModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            // Chỉ định thư mục cài đặt thủ công
            LibreOfficeCommands.WindowsCliDir = "path\\to\\libreoffice";
            LibreOfficeCommands.UnixCliDir = "path/to/libreoffice";
        }
    }
```


