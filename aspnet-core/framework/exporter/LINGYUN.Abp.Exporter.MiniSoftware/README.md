# LINGYUN.Abp.Exporter.MiniSoftware

Triển khai [MiniExcel](https://github.com/mini-software/MiniExcel) cho API xuất dữ liệu

MiniExcel là công cụ .NET đơn giản, hiệu quả, tránh OOM để truy vấn, ghi và điền dữ liệu Excel.

Hiện nay hầu hết các framework phổ biến đều cần tải toàn bộ dữ liệu vào bộ nhớ để thao tác thuận tiện, nhưng điều này gây ra vấn đề tiêu tốn bộ nhớ; MiniExcel thử viết logic thuật toán tầng thấp theo góc độ Stream, giúp mức chiếm dụng vốn hơn 1000 MB giảm xuống còn vài MB, tránh tình trạng thiếu bộ nhớ.

Chi tiết vui lòng tham khảo [tài liệu MiniExcel](https://github.com/mini-software/MiniExcel/blob/master/README.md)

## Cấu hình sử dụng


```csharp

    [DependsOn(
        typeof(AbpExporterMiniExcelModule)
        )]
    public class YouProjectModule : AbpModule
    {
        Configure<AbpExporterMiniExcelOptions>(options =>
        {
            // Xuất dữ liệu theo loại cấu hình
            options.MapExportSetting(typeof(DemoClass), config =>
            {
                config.DynamicColumns = new[]
                {
                    // Bỏ qua trường Name
                    new DynamicExcelColumn(nameof(DemoClass.Name)){ Ignore = true },
                    // Các cấu hình khác
                };
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

