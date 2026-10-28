# LINGYUN.Abp.Elasticsearch.EsqlQuery

[IExpressionQueryService](../LINGYUN.Abp.Elasticsearch/LINGYUN/Abp/Elasticsearch/IExpressionQueryService.cs) là tích hợp truy vấn ES|QL.  

**Lưu ý**: 
* Khi dùng phương án truy vấn ES|QL thì không thể phân trang sâu; khi số lượng bản ghi vượt quá 10000 vẫn tồn tại giới hạn phân trang của ES.  
Nếu cần hỗ trợ phân trang sâu, hãy dùng phương án `search_after` mặc định của  [ExpressionQueryService](../LINGYUN.Abp.Elasticsearch/LINGYUN/Abp/Elasticsearch/ExpressionQueryService.cs)

* Do ES|QL không hỗ trợ `Skip` nên tạm thời chưa hỗ trợ truy vấn phân trang  

* Các phương thức tập hợp trên kiểu lồng nhau chưa vượt qua kiểm thử, vui lòng không dùng điều kiện lọc của tập hợp  


## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpElasticsearchEsqlQueryModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```
