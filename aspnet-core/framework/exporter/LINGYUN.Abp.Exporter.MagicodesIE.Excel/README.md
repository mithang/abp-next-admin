# LINGYUN.Abp.Exporter.MagicodesIE.Excel

Triển khai [Magicodes.IE.Excel](https://github.com/dotnetcore/Magicodes.IE) của giao diện xuất dữ liệu

Import and export general library, support Dto import and export, template export, fancy export and dynamic export, support Excel, Csv, Word, Pdf and Html.

Xem chi tiết tại [Tài liệu Magicodes.IE.Excel](https://github.com/dotnetcore/Magicodes.IE/blob/master/docs/2.%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B%E4%B9%8B%E5%AF%BC%E5%87%BAExcel.md)

## Cấu hình sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterMagicodesIEExcelModule)
        )]
    public class YouProjectModule : AbpModule
    {
        Configure<AbpExporterMagicodesIEExcelOptions>(options =>
        {
            // Cấu hình xuất dữ liệu theo kiểu
            options.MapExportSetting(typeof(DemoClass), config =>
            {
                // Vị trí tiêu đề bắt đầu từ dòng thứ hai
                config.HeaderRowIndex = 2;
                // Các cấu hình khác
            });
        });
    }

    public class DemoClass
    {
        public string Name { get; set; }
        public string Remarks { get; set; }

        public DemoClass()
        {
        }
    }
```

