# LINGYUN.Abp.IdGenerator

## Giới thiệu

`LINGYUN.Abp.IdGenerator` là một mô-đun trình tạo ID phân tán, chủ yếu triển khai thuật toán Snowflake để tạo ID duy nhất phân tán.

## Tính năng

* Trình tạo ID thuật toán Snowflake (`SnowflakeIdGenerator`)
  * Hỗ trợ tùy chỉnh ID máy làm việc và ID trung tâm dữ liệu
  * Hỗ trợ tùy chỉnh số bit của số thứ tự
  * Hỗ trợ xử lý quay ngược thời gian
  * Cung cấp khả năng tạo ID duy nhất trong môi trường phân tán

## Mục cấu hình

### SnowflakeIdOptions

* `WorkerIdBits` (Mặc định: 5) - Số bit của ID máy làm việc
* `DatacenterIdBits` (Mặc định: 5) - Số bit của ID trung tâm dữ liệu
* `Sequence` (Mặc định: 0) - Giá trị bắt đầu của số thứ tự
* `SequenceBits` (Mặc định: 12) - Số bit của số thứ tự
* `UsePreviousInTimeRollback` (Mặc định: true) - Có sử dụng dấu thời gian trước đó khi thời gian bị quay ngược hay không
* `WorkerId` - ID máy làm việc, nếu không chỉ định thì lấy từ biến môi trường WORKERID hoặc tạo ngẫu nhiên
* `DatacenterId` - ID trung tâm dữ liệu, nếu không chỉ định thì lấy từ biến môi trường DATACENTERID hoặc tạo ngẫu nhiên

## Cài đặt

```bash
dotnet add package LINGYUN.Abp.IdGenerator
```

## Sử dụng

1. Thêm `[DependsOn(typeof(AbpIdGeneratorModule))]` vào lớp mô-đun của bạn.

```csharp
[DependsOn(typeof(AbpIdGeneratorModule))]
public class YourModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<SnowflakeIdOptions>(options =>
        {
            options.WorkerId = 1;
            options.DatacenterId = 1;
        });
    }
}
```

2. Inject và sử dụng trình tạo ID:

```csharp
public class YourService
{
    private readonly IDistributedIdGenerator _idGenerator;

    public YourService(IDistributedIdGenerator idGenerator)
    {
        _idGenerator = idGenerator;
    }

    public long CreateId()
    {
        return _idGenerator.Create();
    }
}
```

## Liên kết

* [English document](./README.EN.md)
