# LINGYUN.Abp.Exporter.Pdf

Mô-đun xuất Pdf

## Cấu hình sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterPdfModule)
        )]
    public class YouProjectModule : AbpModule
    {

    }
```

> Xuất dữ liệu
```csharp
    public class ExportDemoClass
    {
        private readonly IExcelToPdfProvider _exporterProvider;

        public ExportDemoClass(IExcelToPdfProvider exporterProvider)
        {
            _exporterProvider = exporterProvider;
        }

        public async virtual Task<IRemoteStreamContent> ExportAsync(Stream excelStream)
        {
            var stream = await _exporterProvider.ParseAsync(excelStream);

            return new RemoteStreamContent(stream, "demo.pdf");
        }
    }
```

