# LINGYUN.Abp.AuditLogging.OpenObserve

[English](./README.EN.md) | Tiếng Trung giản thể

## Giới thiệu

Ghi nhật ký kiểm toán, nhật ký bảo mật vào [OpenObserve](https://openobserve.ai/) và truy vấn qua SQL của OpenObserve,
có thể dùng làm triển khai thay thế cho `LINGYUN.Abp.AuditLogging.Elasticsearch` (`IAuditLogWriter` / `ISecurityLogWriter` /
`IAuditLogManager` / `ISecurityLogManager` / `IEntityChangeStore` đều bị thay thế).

## Cấu hình

`OpenObserve` là cấu hình kết nối (do `LINGYUN.Abp.OpenObserve` cung cấp), đoạn cấu hình liên quan đến kiểm toán là `AuditLogging:OpenObserve`:

```json
{
  "OpenObserve": {
    "Endpoint": "http://localhost:5080",
    "Organization": "default",
    "AccessToken": "Basic YWRtaW5AYWJwLmlvOnd3MVo1TCU2"
  },
  "AuditLogging": {
    "OpenObserve": {
      "Organization": null,
      "AuditLogStream": "audit_log",
      "SecurityLogStream": "security_log",
      "WriteEntityChanges": true,
      "WriteActions": true,
      "DefaultQueryDays": 365,
      "UseLogTimeAsTimestamp": true,
      "TimestampAllowedUptoHours": 5
    }
  }
}
```

| Mục cấu hình | Giá trị mặc định | Giải thích |
| --- | --- | --- |
| `Organization` | Rỗng | Tổ chức sở hữu luồng dữ liệu, khi rỗng sẽ dùng `OpenObserve:Organization` |
| `AuditLogStream` | `audit_log` | Luồng dữ liệu chính của nhật ký kiểm toán (gốc), các luồng dữ liệu con được tính từ nó |
| `SecurityLogStream` | `security_log` | Luồng dữ liệu nhật ký bảo mật |
| `WriteEntityChanges` | `true` | Có ghi phẳng các thay đổi thực thể hay không (khi tắt, `IEntityChangeStore` sẽ không tra được dữ liệu) |
| `WriteActions` | `true` | Có ghi phẳng các thao tác hay không (khi tắt, điều kiện `Actions.*` sẽ không khớp được) |
| `DefaultQueryDays` | `365` | Khoảng truy vấn mặc định khi không chỉ định phạm vi thời gian (ngày) |
| `UseLogTimeAsTimestamp` | `true` | Có dùng thời gian nghiệp vụ của nhật ký để ghi đè `_timestamp` hay không (xem lưu ý 2) |
| `TimestampAllowedUptoHours` | `5` | Số giờ hồi tố tối đa cho phép ghi đè `_timestamp`, cần nhất quán với `ZO_INGEST_ALLOWED_UPTO` phía máy chủ |

> Tên luồng dữ liệu con **được tính từ `AuditLogStream`** (`AbpAuditLoggingOpenObserveOptions.GetEntityChangeStream()` /
> `GetActionStream()`), không cấu hình riêng: thay đổi thực thể = `{AuditLogStream}_entity_changes`, thao tác = `{AuditLogStream}_actions`
> (mặc định là `audit_log_entity_changes`, `audit_log_actions`).

## Cách sử dụng

```csharp
[DependsOn(typeof(AbpAuditLoggingOpenObserveModule))]
public class MyModule : AbpModule
{
}
```

Mô-đun **không xử lý gì đối với luồng dữ liệu** (không thăm dò, không tạo, không sửa đổi cài đặt): OpenObserve sẽ tự động tạo luồng dữ liệu khi ghi lần đầu,
chính sách lưu giữ và các cài đặt luồng dữ liệu khác vui lòng cấu hình phía OpenObserve (hoặc tự gọi `UpdateStreamSettingsAsync`).

## Đa thuê bao (Multi-tenant)

Luồng dữ liệu được tách biệt theo thuê bao (nhất quán với triển khai Elasticsearch, tham khảo `IIndexNameNormalizer` của nó): luồng dữ liệu thuê bao có dạng
`audit_log_{tenantId:N}` (thay đổi thực thể / thao tác lần lượt là `audit_log_entity_changes_{tenantId:N}`, `audit_log_actions_{tenantId:N}`),
máy chủ (không chỉ định thuê bao) dùng tên cơ sở.

* **Ghi**: Chọn luồng dữ liệu theo **`TenantId` của chính nhật ký** (việc ghi nhật ký kiểm toán diễn ra trong hàng đợi nền, thuê bao hiện tại có thể đã không còn là thuê bao tạo ra nhật ký),
  việc ghi hàng loạt được nhóm theo thuê bao;
* **Truy vấn**: Chọn luồng dữ liệu theo **thuê bao hiện tại** (`ICurrentTenant`), do đó các thuê bao tách biệt với nhau một cách tự nhiên;
* Quy tắc đặt tên có thể ghi đè qua `IStreamNameNormalizer` (mặc định là `StreamNameNormalizer`);
  thực nghiệm cho thấy OpenObserve sẽ chuẩn hóa `-` trong tên luồng thành `_`, do đó dấu phân tách mặc định dùng `_`;
* Mô-đun không xử lý gì đối với luồng dữ liệu: luồng dữ liệu được OpenObserve tự động tạo khi ghi lần đầu,
  cài đặt như chính sách lưu giữ vui lòng cấu hình phía OpenObserve.

## Cấu trúc luồng dữ liệu

Phía nhật ký kiểm toán có tổng cộng ba luồng dữ liệu (hai tên sau được tính từ `AuditLogStream`):

| Luồng dữ liệu | Nội dung |
| --- | --- |
| `audit_log` | Tiêu đề nhật ký kiểm toán |
| `audit_log_entity_changes` | Các thay đổi thực thể đã ghi phẳng |
| `audit_log_actions` | Các thao tác đã ghi phẳng (`parameters` có thể rất lớn, do đó lưu riêng) |

```sql
select * from audit_log where httpmethod = 'POST' and url like '%/api/identity%' order by executiontime desc
```

Các trường của luồng dữ liệu thay đổi thực thể:

| Cột | Giải thích |
| --- | --- |
| `id` / `auditlogid` | Id thay đổi thực thể / Id nhật ký kiểm toán sở hữu |
| `tenantid` / `entitytenantid` | Thuê bao |
| `changetime` / `changetype` | Thời gian thay đổi / `Created`, `Updated`, `Deleted` |
| `entityid` / `entitytypefullname` | Định danh thực thể |
| `userid` / `username` | Người thao tác (dư thừa từ nhật ký kiểm toán, khỏi cần join) |
| `propertychanges` | Chi tiết thay đổi thuộc tính (chuỗi JSON) |
| `_timestamp` | Thời gian tài liệu (mặc định bị `changetime` ghi đè) |

Các trường của luồng dữ liệu thao tác:

| Cột | Giải thích |
| --- | --- |
| `id` / `auditlogid` | Id thao tác / Id nhật ký kiểm toán sở hữu |
| `servicename` / `methodname` | Dịch vụ và phương thức |
| `parameters` | Tham số thao tác (có thể rất lớn, dùng `like` hoặc `str_match` để truy xuất) |
| `executiontime` / `executionduration` | Thời gian thực thi / thời gian tốn |
| `userid` / `username` | Người thao tác (dư thừa từ nhật ký kiểm toán) |
| `_timestamp` | Thời gian tài liệu (mặc định bị `executiontime` ghi đè) |

Điều kiện `Actions.*` dùng **truy vấn hai đoạn**:

```sql
-- 1) Trước tiên khớp trong luồng dữ liệu thao tác
select distinct auditlogid from audit_log_actions where parameters like '%từ khóa%'
-- 2) Sau đó quay lại luồng dữ liệu chính lọc theo id
select * from audit_log where id in (...)
```

## Lưu ý

1. **Tên cột luồng dữ liệu đều viết thường**: OpenObserve sẽ viết thường hóa tên trường (`httpMethod` → `httpmethod`),
   do đó điều kiện SQL dùng tên cột viết thường, xem `MapedFields` trong các trình quản lý;
2. **`_timestamp` bị ghi đè theo thời gian nghiệp vụ**: Khi ghi, dùng `AuditLog.ExecutionTime` / `SecurityLog.CreationTime`
   (thay đổi thực thể dùng `ChangeTime`, thao tác dùng `ExecutionTime`) để ghi đè `_timestamp` (`UseLogTimeAsTimestamp`, mặc định bật),
   như vậy `start_time` / `end_time` của truy vấn mới tương ứng với thời gian nghiệp vụ. Nhưng OpenObserve mặc định chỉ chấp nhận
   dữ liệu trong vòng `ZO_INGEST_ALLOWED_UPTO` (mặc định 5) giờ, **bản ghi ngoài cửa sổ sẽ bị máy chủ loại bỏ trực tiếp**
   (`Too old data … Data discarded`), do đó nhật ký ngoài `TimestampAllowedUptoHours` sẽ không còn ghi đè
   `_timestamp` (chuyển sang dùng thời gian ghi phía máy chủ); nếu cần ghi nhật ký sớm hơn, hãy tăng biến môi trường phía máy chủ và đồng bộ cấu hình này;
3. **Lọc thời gian**: Truy vấn mặc định dùng cửa sổ rộng (`DefaultQueryDays`), lọc thời gian nghiệp vụ hoàn thành qua so sánh chuỗi ISO 8601 của các cột `executiontime` /
   `creationtime` / `changetime` (phương án dự phòng khi việc ghi đè chịu giới hạn cửa sổ 5 giờ);
4. **Không hỗ trợ xóa bản ghi**: OpenObserve là append-only, vừa không hỗ trợ SQL `DELETE` (`DELETE not supported for Base table`)
   vừa không hỗ trợ `UPDATE` tại chỗ, do đó `IAuditLogManager.DeleteAsync` / `DeleteManyAsync` (nhật ký bảo mật cũng vậy) sẽ ném trực tiếp ngoại lệ nghiệp vụ
   `AuditLoggingOpenObserveErrorCodes.DeleteNotSupported` (mã lỗi `AuditLoggingOpenObserve:010001`,
   văn bản bản địa hóa: **Cơ sở hạ tầng nhật ký hiện tại không hỗ trợ xóa bản ghi!**). Việc dọn dữ liệu vui lòng cấu hình chính sách lưu giữ phía OpenObserve, hoặc dùng giao diện xóa theo phạm vi thời gian của nó;
5. **Thao tác và thay đổi thực thể ghi vào luồng dữ liệu độc lập**: Tài liệu chính không còn lưu mảng lồng nhau `actions` / `entitychanges` (OpenObserve chỉ có thể lưu chúng
   thành cột chuỗi JSON, không thể truy xuất có cấu trúc). `x => x.Actions.Any(a => a.Parameters.Contains("..."))` đi theo truy vấn hai đoạn;
   khi `includeDetails`, chi tiết được lắp ráp từ hai luồng dữ liệu con theo `auditlogid in (…)`. Khi `parameters` rất lớn nên đổi sang
   `str_match(parameters, 'giá trị')` và cấu hình `full_text_search_keys` cho luồng dữ liệu con, tránh quét toàn cột bằng `like`.
   Chi tiết thay đổi thực thể (`propertychanges`) cũng được lưu dưới dạng chuỗi JSON: logic chuyển đổi tập trung tại `OpenObserveEntityChangeConverter`,
   quá trình tuần tự hóa hoàn thành qua `IAuditLoggingOpenObserveSerializer` (triển khai mặc định ủy thác cho `IJsonSerializer` của ABP,
   bản thân thực thể không trực tiếp dùng `JsonSerializer`); khi cần tùy chỉnh hành vi JSON cho loại cụ thể, dùng
   `AbpSystemTextJsonSerializerModifiersOptions` để đăng ký bộ sửa đổi;
   khi luồng dữ liệu chưa được tạo (chưa từng ghi dữ liệu) thì truy vấn xử lý như kết quả rỗng, không báo lỗi;
6. **Truy vấn chuỗi là khớp mờ**: Các tham số như `url` / `userName` / `applicationName` dùng `like '%giá trị%'`,
   `correlationId` / `clientId` / `clientIpAddress` / `httpMethod` / `action` là khớp chính xác;
7. **Ánh xạ trường**: Tên thành viên biểu thức (PascalCase) được ánh xạ thành tên cột luồng dữ liệu viết thường;
   gói `LINGYUN.Abp.OpenObserve` cung cấp `ExpressionParser` (hỗ trợ biểu thức `Any(thành viên tập hợp)`) và
   `OpenObserveSqlBuilder` để tái sử dụng cho việc xây dựng điều kiện SQL.

## Dự án liên quan

* [LINGYUN.Abp.AuditLogging](../LINGYUN.Abp.AuditLogging/README.md)
* [LINGYUN.Abp.OpenObserve](../../open-observe/LINGYUN.Abp.OpenObserve/README.md)
* [LINGYUN.Abp.Logging.Serilog.OpenObserve](../../logging/LINGYUN.Abp.Logging.Serilog.OpenObserve/README.md)
