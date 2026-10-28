# LINGYUN.Abp.Elasticsearch

Tiếng Việt | [English](./README.EN.md)

Tích hợp Abp Elasticsearch, cung cấp giao diện truy cập IElasticClient duy nhất toàn cục

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpElasticsearchModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa giao diện

*   [IIndexMappingProvider](./LINGYUN/Abp/Elasticsearch/IIndexMappingProvider.cs)  Lấy thuộc tính ánh xạ chỉ mục  
*   [IExpressionQueryTranslator](./LINGYUN/Abp/Elasticsearch/IExpressionQueryTranslator.cs)  Cây biểu thức dịch sang lớp truy vấn ES  
*   [IExpressionQueryService](./LINGYUN/Abp/Elasticsearch/IExpressionQueryService.cs)  Truy vấn dữ liệu cây biểu thức  
*   [IElasticsearchClientFactory](./LINGYUN/Abp/Elasticsearch/IElasticsearchClientFactory.cs)  Quản lý máy khách ES  

## Mục cấu hình

*	AbpElasticsearchOptions.FieldCamelCase      Trường có sử dụng định dạng camelCase hay không, mặc định là false
*	AbpElasticsearchOptions.NodeUris            Điểm cuối ES, nhiều điểm cuối phân tách bằng , hoặc ;
*	AbpElasticsearchOptions.TypeName            Tên tài liệu, mặc định là _doc
*	AbpElasticsearchOptions.ConnectionLimit     Số kết nối tối đa, xem chi tiết trong tài liệu NEST
*	AbpElasticsearchOptions.UserName            Người dùng kết nối, xem chi tiết trong tài liệu NEST
*	AbpElasticsearchOptions.Password            Mật khẩu người dùng, xem chi tiết trong tài liệu NEST
*	AbpElasticsearchOptions.ConnectionTimeout   Thời gian chờ kết nối, xem chi tiết trong tài liệu NEST

## appsettings.json

```json
{
  "Elasticsearch": {
    "NodeUris": "http://localhost:9200"
  }
}