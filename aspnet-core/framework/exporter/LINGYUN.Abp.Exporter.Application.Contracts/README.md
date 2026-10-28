# LINGYUN.Abp.Exporter.Application.Contracts

Tầng hợp đồng giao diện xuất/nhập dữ liệu, định nghĩa các giao diện dịch vụ xuất/nhập dữ liệu dùng chung

## Cấu hình và sử dụng


> Cấu hình phụ thuộc mô-đun
```csharp

[DependsOn(
    typeof(AbpExporterApplicationContractsModule)
    )]
public class YouProjectModule : AbpModule
{

}
```

> Định nghĩa kiểu xuất
```csharp
public class DemoClassDto
{
    public string Name { get; set; }
    public string Remarks { get; set; }

    public DemoClassDto()
    {
    }
}
```

> Định nghĩa kiểu nhập
```csharp
public class DemoClassImportInput
{
    [Required]
    public IRemoteStreamContent Content { get; set; }   

    public DemoClassImportInput()
    {
    }
}
```

> Định nghĩa kiểu lọc dữ liệu
```csharp
public class DemoClassExportListInput
{
    public string Filter { get; set; }

    [Required]
    public string FileName { get; set; }

    public DemoClassExportListInput()
    {
    }
}
```

> Xuất dữ liệu
```csharp
    public class ExportDemoClassExportAppService : IExporterAppService<DemoClassDto, DemoClassExportListInput>
    {
        private readonly IExporterProvider _exporterProvider;

        public ExportDemoClassExportAppService(IExporterProvider exporterProvider)
        {
            _exporterProvider = exporterProvider;
        }

        public async virtual Task<IRemoteStreamContent> ExportAsync(DemoClassExportListInput input)
        {
            var dtos = truy vấn danh sách dữ liệu qua giao diện kho lưu trữ;

            var stream = await _exporterProvider.ExportAsync(dtos);

            return new RemoteStreamContent(stream, input.FileName);
        }
    }
```

> Nhập dữ liệu
```csharp
    public class ExportDemoClassImportAppService : IImporterAppService<DemoClassImportInput>
    {
        private readonly IImporterProvider _importerProvider;

        public ExportDemoClassImportAppService(IImporterProvider importerProvider)
        {
            _importerProvider = importerProvider;
        }

        public async virtual Task ImportAsync(DemoClassImportInput input)
        {
            var stream = input.Content.GetStream();

            var demos = await _importerProvider.ImportAsync<DemoClass>(stream);

            // Các thao tác khác
        }
    }
```
