# LINGYUN.Abp.Dynamic.Queryable.HttpApi

Mô-đun HTTP API truy vấn động, cung cấp triển khai HTTP API truy vấn động dựa trên framework ABP.

## Tính năng

* Cung cấp lớp cơ sở controller truy vấn động `DynamicQueryableControllerBase<TEntity, TEntityDto>`
* Tự động tạo endpoint REST API
* Hỗ trợ truyền tham số truy vấn động qua HTTP

## Cấu hình và sử dụng

1. Cài đặt gói NuGet `LINGYUN.Abp.Dynamic.Queryable.HttpApi`

2. Thêm `[DependsOn(typeof(AbpDynamicQueryableHttpApiModule))]` vào lớp mô-đun của bạn

### Triển khai controller truy vấn động

```csharp
[Route("api/my-entity")]
public class MyEntityController : DynamicQueryableControllerBase<MyEntity, MyEntityDto>
{
    public MyEntityController(IDynamicQueryableAppService<MyEntityDto> dynamicQueryableAppService)
        : base(dynamicQueryableAppService)
    {
    }
}
```

### Endpoint API

* GET `/api/my-entity/available-fields` - Lấy danh sách trường khả dụng
* POST `/api/my-entity/search` - Truy vấn dữ liệu theo điều kiện động

### Ví dụ truy vấn

```json
POST /api/my-entity/search
{
    "maxResultCount": 10,
    "skipCount": 0,
    "queryable": {
        "paramters": [
            {
                "field": "Name",
                "comparison": "Equal",
                "value": "test"
            }
        ]
    }
}
```

## Liên kết liên quan

* [LINGYUN.Linq.Dynamic.Queryable](../LINGYUN.Linq.Dynamic.Queryable/README.md)
* [LINGYUN.Abp.Dynamic.Queryable.Application](../LINGYUN.Abp.Dynamic.Queryable.Application/README.md)
* [LINGYUN.Abp.Dynamic.Queryable.Application.Contracts](../LINGYUN.Abp.Dynamic.Queryable.Application.Contracts/README.md)
