# LINGYUN.Linq.Dynamic.Queryable

Thư viện cơ bản cho truy vấn động, mở rộng Linq, xây dựng cây biểu thức một cách động

## Tính năng

* Hỗ trợ xây dựng điều kiện truy vấn một cách động
* Hỗ trợ nhiều toán tử so sánh: bằng, không bằng, lớn hơn, nhỏ hơn, lớn hơn hoặc bằng, nhỏ hơn hoặc bằng, chứa, không chứa, bắt đầu bằng, không bắt đầu bằng, kết thúc bằng, không kết thúc bằng, v.v.
* Hỗ trợ chuyển đổi kiểu động và xử lý giá trị null
* Hỗ trợ truy vấn động cho kiểu enum

## Cấu hình sử dụng

Module được tham chiếu theo nhu cầu, chỉ cung cấp các extension cho Linq.

### Cách dùng cơ bản

```csharp
// Tạo tham số truy vấn động
var parameter = new DynamicParamter 
{
    Field = "Name",
    Comparison = DynamicComparison.Equal,
    Value = "test"
};

// Tạo điều kiện truy vấn
var queryable = new DynamicQueryable
{
    Paramters = new List<DynamicParamter> { parameter }
};

// Áp dụng vào Expression
Expression<Func<TEntity, bool>> condition = e => true;
condition = condition.DynamicQuery(queryable);

// Sử dụng điều kiện để truy vấn
var result = await repository.Where(condition).ToListAsync();
```

### Các toán tử so sánh được hỗ trợ

* `Equal` - Bằng
* `NotEqual` - Không bằng
* `LessThan` - Nhỏ hơn
* `LessThanOrEqual` - Nhỏ hơn hoặc bằng
* `GreaterThan` - Lớn hơn
* `GreaterThanOrEqual` - Lớn hơn hoặc bằng
* `Contains` - Chứa
* `NotContains` - Không chứa
* `StartsWith` - Bắt đầu bằng
* `NotStartsWith` - Không bắt đầu bằng
* `EndsWith` - Kết thúc bằng
* `NotEndsWith` - Không kết thúc bằng

## Liên kết liên quan

* [LINGYUN.Abp.Dynamic.Queryable.Application](../LINGYUN.Abp.Dynamic.Queryable.Application/README.md)
