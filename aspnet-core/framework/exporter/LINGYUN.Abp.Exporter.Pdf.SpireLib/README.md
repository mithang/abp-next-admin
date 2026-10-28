# LINGYUN.Abp.Exporter.Pdf.SpireLib

> Spire.XLS for .NET là một thành phần .NET Excel chuyên nghiệp, có thể dùng trong nhiều framework .NET khác nhau, bao gồm .NET Core, .NET 5.0, .NET 6.0, .NET 7.0, .NET Standard, Xamarin, Mono Android, ASP.NET và Windows Forms cùng các ứng dụng .NET liên quan. Spire.XLS for .NET cung cấp một API mô hình đối tượng Excel, giúp nhà phát triển nhanh chóng hoàn thành các thao tác lập trình Excel trên nền tảng .NET, như tạo tài liệu Excel mới từ mẫu, chỉnh sửa tài liệu Excel hiện có và chuyển đổi tài liệu Excel。  

Mô-đun này dùng [Spire.XLS](https://www.e-iceblue.cn/spirexls/spire-xls-for-net-program-guide-content.html) để chuyển Excel thành Pdf, vui lòng cấu hình giấy phép trước khi sử dụng.  

## Cấu hình sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterPdfModule)
        )]
    public class YouProjectModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            // Cấu hình giấy phép
            Spire.Xls.License.LicenseProvider.SetLicense("xxx");
        }
    }
```


