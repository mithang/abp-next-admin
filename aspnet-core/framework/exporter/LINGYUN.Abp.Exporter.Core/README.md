# LINGYUN.Abp.Exporter.Core

Lớp lõi xuất/nhập dữ liệu

## Cấu hình sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterCoreModule)
        )]
    public class YouProjectModule : AbpModule
    {

    }
```

> Xuất dữ liệu
```csharp
    public class ExportDemoClass
    {
        private readonly IExporterProvider _exporterProvider;

        public ExportDemoClass(IExporterProvider exporterProvider)
        {
            _exporterProvider = exporterProvider;
        }

        public async virtual Task<IRemoteStreamContent> ExportAsync()
        {
            var dataItems = new object[]
            {
                new
                {
                    Name = "name1",
                    Remakrs = "remarks1"
                }
            };

            var stream = await _exporterProvider.ExportAsync(dataItems);

            return new RemoteStreamContent(stream, "demo.xlsx");
        }
    }
```

> Nhập dữ liệu
```csharp
    public class ImportDemoClass
    {
        private readonly IImporterProvider _importerProvider;

        public ImportDemoClass(IImporterProvider importerProvider)
        {
            _importerProvider = importerProvider;
        }

        public async virtual Task ImportAsync(Stream stream)
        {
            var demos = await _importerProvider.ImportAsync<DemoClass>(stream);

            // Các thao tác khác
        }
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
