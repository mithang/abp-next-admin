# LINGYUN.Abp.OpenObserve

Tiếng Trung giản thể | [English](./README.EN.md)

Lớp bao bọc HTTP API client của OpenObserve, bao phủ toàn bộ các giao diện trong tài liệu tham khảo API chính thức

Tài liệu tham khảo: https://openobserve.ai/docs/reference/api/

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpOpenObserveModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Mục cấu hình

| Mục cấu hình | Mô tả | Giá trị mặc định |
| --- | --- | --- |
| `Endpoint` | Địa chỉ dịch vụ | `http://localhost:5080` |
| `Organization` | Tên tổ chức mặc định, dùng khi giao diện được gọi mà không chỉ định rõ tổ chức | `default` |
| `UserName` | Tên người dùng (cùng với Password tạo tiêu đề xác thực Basic) | - |
| `Password` | Mật khẩu | - |
| `AccessToken` | Tiêu đề ủy quyền đầy đủ, ví dụ `Basic xxx` hoặc `Bearer xxx` (mã thông báo tài khoản dịch vụ), ưu tiên hơn UserName/Password | - |
| `TimeoutSeconds` | Thời gian chờ yêu cầu (giây) | `600` |

> Mọi giao diện đều cần tiêu đề ủy quyền, phía chính thức khuyến nghị `Authorization: Basic base64(email:password)`.
> Lưu ý: **token thu thập chỉ dùng được cho giao diện thu thập**, không dùng được cho các API `_meta` / `_search` / `/mcp`, nếu không sẽ trả về `401 Unauthorized`.
> `TimeoutSeconds` mặc định là 600 giây, nhất quán với `ZO_QUERY_TIMEOUT` của giao diện tìm kiếm, tránh truy vấn dài bị HttpClient ngắt.

## appsettings.json

```json
{
  "OpenObserve": {
    "Endpoint": "http://localhost:5080",
    "Organization": "default",
    "UserName": "admin@abp.io",
    "Password": "your-password",
    "TimeoutSeconds": 600
  }
}
```

## Danh sách giao diện

### Stream

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `GetStreamsAsync` | GET | `/api/{organization}/streams` |
| `GetStreamSchemaAsync` | GET | `/api/{organization}/streams/{stream}/schema` |
| `CreateStreamSettingsAsync` | POST | `/api/{org_id}/streams/{stream_name}/settings` |
| `UpdateStreamSettingsAsync` | PUT | `/api/{org_id}/streams/{stream_name}/settings` |
| `DeleteStreamAsync` | DELETE | `/api/{org_id}/streams/{stream_name}` |
| `DeleteStreamDataByTimeRangeAsync` | DELETE | `/api/{org_id}/streams/{stream_name}/data_by_time_range` |
| `GetStreamDataByTimeRangeStatusAsync` | GET | `/api/{org_id}/streams/{stream_name}/data_by_time_range/status/{id}` |
| `DeleteStreamCacheAsync` | DELETE | `/api/{org_id}/streams/{stream_name}/cache/results` |

### Ingestion

| Phương thức | HTTP | Đường dẫn | Mô tả |
| --- | --- | --- | --- |
| `JsonRequestAsync` | POST | `/api/{organization}/{stream}/_json` | Mảng JSON |
| `JsonRecordAsync` | POST | `/api/{organization}/{stream}/_json` | Một bản ghi (bên trong được bọc thành mảng) |
| `JsonBulkAsync` | POST | `/api/{organization}/_bulk` | NDJSON, dòng hành động + dòng bản ghi, tương thích với Elasticsearch _bulk |
| `JsonMultiAsync` | POST | `/api/{organization}/{stream}/_multi` | NDJSON, mỗi dòng một bản ghi |

> `_bulk` hỗ trợ ba hành động `index` / `create` / `update`, không hỗ trợ `delete`.
> `_timestamp` trong bản ghi (micro giây, hoặc chuỗi RFC 3339/RFC 2822) có thể ghi đè thời gian thu thập mặc định; khi không truyền sẽ dùng thời gian hiện tại.
> `status[].error` trong phản hồi thu thập sẽ cho biết nguyên nhân thất bại (ví dụ `flatten value must be an object`), có thể đọc qua `JsonStatus.Error`.

### Search

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `SearchAsync` | POST | `/api/{organization}/_search` |
| `AroundAsync` | GET | `/api/{organization}/{stream}/_around` |
| `GetValuesAsync` | GET | `/api/{organization}/{stream}/_values` |

> Đơn vị khoảng thời gian là **micro giây**, bắt buộc phải cung cấp `start_time` / `end_time`, nếu không sẽ quét toàn bộ.
> Mã lỗi tìm kiếm (20001-20013) cùng `hint` / `suggestions` được mang bởi `OpenObserveSearchException`.

### Function

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `CreateFunctionAsync` | POST | `/api/{organization}/functions` |
| `UpdateFunctionAsync` | PUT | `/api/{organization}/functions/{name}` |
| `DeleteFunctionAsync` | DELETE | `/api/{organization}/functions/{name}` |
| `GetFunctionsAsync` | GET | `/api/{organization}/functions` |
| `TestFunctionAsync` | POST | `/api/{org_id}/functions/test` |

> Ngôn ngữ hàm do `transType` trong thân yêu cầu quyết định (`FunctionTransType.Vrl` / `JavaScript`), không có tham số truy vấn `type`.
> `TestFunctionAsync` không xuất hiện trong tài liệu API, mà đến từ mã nguồn triển khai.

### User

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `CreateUserAsync` | POST | `/api/{organization}/users` |
| `UpdateUserAsync` | PUT | `/api/{organization}/users/{user_email}` |
| `AddUserToOrganizationAsync` | POST | `/api/{organization}/users/{user_email}` |
| `RemoveUserFromOrganizationAsync` | DELETE | `/api/{organization}/users/{user_email}` |
| `GetUsersAsync` | GET | `/api/{organization}/users` |

### Metrics và Cluster

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `GetMetricsAsync` | GET | `/metrics` (định dạng văn bản Prometheus, cần `ZO_PROMETHEUS_ENABLE=true`) |
| `GetClusterInfoAsync` | GET | `/api/{org_id}/cluster/info` |

### Dashboard

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `AddDashboardPanelAsync` | POST | `/api/{org_id}/dashboards/{dashboard_id}/panels` |
| `UpdateDashboardPanelAsync` | PUT | `/api/{org_id}/dashboards/{dashboard_id}/panels/{panel_id}` |
| `DeleteDashboardPanelAsync` | DELETE | `/api/{org_id}/dashboards/{dashboard_id}/panels/{panel_id}` |

> Thao tác bảng chỉ hỗ trợ dashboard v8, và tham số `hash` là bắt buộc (kiểm soát đồng thời lạc quan), khi không khớp sẽ trả về 409.

### Report

| Phương thức | HTTP | Đường dẫn |
| --- | --- | --- |
| `GetReportsAsync` | GET | `/api/v2/{org_id}/reports` |
| `CreateReportAsync` | POST | `/api/v2/{org_id}/reports` |
| `GetReportAsync` | GET | `/api/v2/{org_id}/reports/{report_id}` |
| `UpdateReportAsync` | PUT | `/api/v2/{org_id}/reports/{report_id}` |
| `DeleteReportAsync` | DELETE | `/api/v2/{org_id}/reports/{report_id}` |
| `BulkDeleteReportsAsync` | DELETE | `/api/v2/{org_id}/reports/bulk` |
| `MoveReportsAsync` | PATCH | `/api/v2/{org_id}/reports/move` |
| `EnableReportAsync` | PATCH | `/api/v2/{org_id}/reports/{report_id}/enable` |
| `TriggerReportAsync` | PUT | `/api/v2/{org_id}/reports/{report_id}/trigger` |

> Giao diện báo cáo dùng tiền tố `/api/v2`, khác với các giao diện khác.

## Phong cách gọi

* **Chỉ cần truyền tham số nghiệp vụ**, không cần tự lắp ráp mô hình `*Request` (thân yêu cầu do client tự lắp ráp bên trong), ví dụ:

```csharp
var client = ServiceProvider.GetRequiredService<OpenObserveClient>();

// Tạo người dùng mới
await client.CreateUserAsync("user@abp.io", "complex#pass", firstName: "ming", role: "admin");

// Ghi một dữ liệu kiểm toán
await client.JsonRecordAsync("default", "audit-log", new { action = "Login", user = "admin" });

// Tìm kiếm
var result = await client.SearchAsync<JsonNode>(
    new SearchQuery("SELECT * FROM audit-log", DateTime.UtcNow.AddHours(-1), DateTime.UtcNow, size: 20));
```

* Mọi tuần tự hóa/giải tuần tự hóa đều thống nhất thực hiện qua **`IOpenObserveSerializer`**, triển khai mặc định `DefaultOpenObserveSerializer` dựa trên `IJsonSerializer` của ABP:
  * Tuân theo `AbpSystemTextJsonSerializerOptions` trong cấu hình host (bộ chuyển đổi, định dạng ngày, bộ mã hóa, v.v.); ABP mặc định đặt bộ mã hóa thành `UnsafeRelaxedJsonEscaping`, tiếng Trung và dấu ngoặc kép sẽ không bị thoát thành `\uXXXX`;
  * Tên trường lấy theo `JsonPropertyName` trên mô hình (lưu ý giá trị mặc định `camelCase` của `IJsonSerializer.Serialize` chỉ ảnh hưởng đến các thuộc tính chưa gắn attribute);
  * "Bỏ qua trường null khi tuần tự hóa" đặc thù của OpenObserve được triển khai qua **bộ trang trí tuần tự hóa cấp kiểu** của ABP
    (`AbpSystemTextJsonSerializerModifiersOptions.Modifiers`: `List<Action<JsonTypeInfo>>` → `OpenObserveIgnoreNullPropertiesModifier`),
    chỉ tác dụng lên không gian tên `LINGYUN.Abp.OpenObserve.Models`: khi tham số tùy chọn không được truyền sẽ không sinh ra trường `null` (ví dụ trường mật khẩu người dùng, tài liệu yêu cầu "khi không sửa đổi thì đừng truyền giá trị");
  * Lưu ý: giao diện `IJsonSerializer` (ABP 10.x) chỉ có `Serialize(object, camelCase, indented)` / `Deserialize<T>(string, camelCase)` /
    `Deserialize(Type, string, camelCase)`, **không chấp nhận `JsonSerializerOptions` tùy chỉnh**; khi cần tùy chỉnh tuần tự hóa theo kiểu thì nên dùng bộ trang trí nêu trên, ví dụ:

```csharp
Configure<AbpSystemTextJsonSerializerModifiersOptions>(options =>
{
    options.Modifiers.Add(jsonTypeInfo =>
    {
        if (jsonTypeInfo.Type == typeof(MyType))
        {
            foreach (var property in jsonTypeInfo.Properties)
            {
                property.ShouldSerialize = (_, value) => value != null;
            }
        }
    });
});
```

* Nếu cần thay thế toàn bộ cách tuần tự hóa, hãy triển khai `IOpenObserveSerializer` và thêm `[Dependency(ReplaceServices = true)]` để ghi đè triển khai mặc định.
* Tham số tên tổ chức có thể bỏ qua, mặc định lấy `AbpOpenObserveOptions.Organization`; giao diện thông tin cụm mặc định dùng tổ chức `_meta` (giới hạn phía máy chủ).
* Mô hình dữ liệu được tổ chức theo **một kiểu một tệp**, cấu trúc thư mục nhất quán với `Models/Search`.

## Kiểm thử đơn vị

Dự án kiểm thử: `aspnet-core/tests/LINGYUN.Abp.OpenObserve.Tests` (đã tham gia giải pháp `LINGYUN.MicroService.All`)

```bash
dotnet test aspnet-core/tests/LINGYUN.Abp.OpenObserve.Tests/LINGYUN.Abp.OpenObserve.Tests.csproj
```

Kiểm thử chặn yêu cầu qua `HttpMessageHandler`, kiểm tra **phương thức HTTP / đường dẫn / tham số truy vấn / thân yêu cầu** của từng giao diện, cũng như giải tuần tự hóa phản hồi và kiểu ngoại lệ, không phát sinh yêu cầu mạng thực.

## Xử lý ngoại lệ

| Ngoại lệ | Mô tả |
| --- | --- |
| `OpenObserveException` | Lớp cơ sở của ngoại lệ nghiệp vụ, mang `Code` / `StatusCode` / `Error` / `ResponseBody` |
| `OpenObserveRequestException` | Thân phản hồi không thể phân tích thành cấu trúc lỗi chuẩn của OpenObserve |
| `OpenObserveSearchException` | Lỗi nghiệp vụ của giao diện tìm kiếm (gồm mã lỗi, `hint`, `suggestions`) |
| `OpenObserveIngestionException` | Lỗi nghiệp vụ của giao diện thu thập (gồm tên luồng dữ liệu) |

## Khác biệt giữa tài liệu và triển khai

Những điểm tài liệu và triển khai không nhất quán phát hiện trong quá trình triển khai, mã nguồn lấy **hành vi thực tế có thể dùng được** làm chuẩn:

1. **Cluster**: tài liệu là `GET /api/{org_id}/cluster_info`, triển khai là `GET /api/{org_id}/cluster/info`, mặc định dùng cái sau, có thể điều chỉnh bằng cách ghi đè `CreateClusterInfoRequestUri`.
2. **Metrics**: phần chính của tài liệu là `GET /metrics`, nhưng ví dụ lại viết thành `PUT`, thực tế chỉ đăng ký GET.
3. **Phản hồi danh sách Function**: bảng trường của tài liệu dùng `stream_name` / `order` / `num_args` / `trans_type`, triển khai trả về camelCase (`numArgs` / `transType` / `streams[]`), mô hình lấy triển khai làm chuẩn và giữ các trường chưa khai báo bằng thuộc tính mở rộng.
4. **Trường `order` của hàm**: ví dụ tài liệu có chứa, triển khai hiện tại không chấp nhận (chỉ `streams[].order` có hiệu lực).
5. **Dashboard**: tài liệu chỉ mô tả giao diện cấp bảng, việc thêm/xóa/sửa/tra cứu/di chuyển/thư mục của bản thân dashboard chưa được đưa ra trong tài liệu (thuyết minh chính thức xem OpenAPI/Swagger tích hợp sẵn trong phiên bản).
6. **Content-Type của Ingestion**: tài liệu chưa khai báo, `_json` dùng `application/json`, `_bulk` / `_multi` dùng `application/x-ndjson`.
7. **`sort_by` của tìm kiếm**: không phải là trường của `_search` (chỉ tìm kiếm đa luồng hỗ trợ), để sắp xếp hãy dùng SQL `ORDER BY`.
8. **`use_cache` / `clear_cache`**: giá trị trong chuỗi truy vấn sẽ ghi đè thân yêu cầu, mặc định `use_cache=true`.
