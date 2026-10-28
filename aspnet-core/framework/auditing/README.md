# Mô-đun kiểm toán LINGYUN.Abp

## Tổng quan mô-đun

Mô-đun kiểm toán cung cấp chức năng ghi nhật ký và kiểm toán toàn diện, hỗ trợ nhiều phương thức lưu trữ và các tùy chọn kiểm toán có thể cấu hình cao.

## Tính năng

### Tính năng cốt lõi

- Hạ tầng nhật ký kiểm toán
- Định nghĩa giao diện kho lưu trữ nhật ký kiểm toán
- Định nghĩa giao diện trình quản lý nhật ký kiểm toán
- Hỗ trợ bỏ qua việc ghi nhật ký kiểm toán cho các kiểu cụ thể

### Hỗ trợ lưu trữ

- Triển khai EntityFrameworkCore  
- Triển khai Elasticsearch  
- Triển khai OpenObserve  

> Lưu ý: Giới hạn của thư viện Elastic, tương thích với 8.x; phiên bản 9.x, nếu cần dùng phiên bản 10.x, hãy chuyển **Elastic.Clients.Elasticsearch** sang phiên bản 9.x 
> Tham khảo: https://www.nuget.org/packages/Elastic.Clients.Elasticsearch#readme-body-tab  

## Tham chiếu mô-đun

### Mô-đun cốt lõi

```csharp
[DependsOn(typeof(AbpAuditLoggingModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Mô-đun EntityFrameworkCore

```csharp
[DependsOn(typeof(AbpAuditLoggingEntityFrameworkCoreModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Mô-đun Elasticsearch

```csharp
[DependsOn(typeof(AbpAuditLoggingElasticsearchModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

### Mô-đun OpenObserve

```csharp
[DependsOn(typeof(AbpAuditLoggingOpenObserveModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Tùy chọn cấu hình

### Cấu hình nhật ký kiểm toán

```json
{
  "Auditing": {
    "IsEnabled": true, // Có bật nhật ký kiểm toán hay không
    "HideErrors": true, // Có ẩn thông tin lỗi hay không
    "IsEnabledForAnonymousUsers": true, // Có bật nhật ký kiểm toán cho người dùng ẩn danh hay không
    "IsEnabledForGetRequests": false, // Có bật nhật ký kiểm toán cho yêu cầu GET hay không
    "ApplicationName": null // Tên ứng dụng
  },
  // Cấu hình tăng cường nhật ký kiểm toán
  "AuditLogging": {
    "IsAuditLogEnabled": true, // Có bật ghi nhật ký kiểm toán hay không
    "UseAuditLogQueue": true, // Sử dụng hàng đợi nhật ký kiểm toán, nếu không bật hàng đợi thì ghi trực tiếp vào cơ sở lưu trữ bền vững
    "MaxAuditLogQueueSize": 10000, // Kích thước tối đa của hàng đợi nhật ký kiểm toán, mặc định là 10000
    "BatchAuditLogSize": 100, // Kích thước hàng đợi nhật ký kiểm toán xử lý trong một lần, sau khi ghi đồng thời 100 bản ghi trong hàng đợi sẽ ghi ngay vào cơ sở lưu trữ bền vững
    "IsSecurityLogEnabled": true, // Có bật ghi nhật ký bảo mật hay không
    "UseSecurityLogQueue": true, // Sử dụng hàng đợi nhật ký bảo mật, nếu không bật hàng đợi thì ghi trực tiếp vào cơ sở lưu trữ bền vững
    "MaxSecurityLogQueueSize": 10000, // Kích thước tối đa của hàng đợi nhật ký bảo mật, mặc định là 10000
    "BatchSecurityLogSize": 100 // Kích thước hàng đợi nhật ký bảo mật xử lý trong một lần, sau khi ghi đồng thời 100 bản ghi trong hàng đợi sẽ ghi ngay vào cơ sở lưu trữ bền vững
  }
}
```

### Cấu hình Elasticsearch

```json
{
  "AuditLogging": {
    "Elasticsearch": {
      "IndexPrefix": "auditlogging", // Tiền tố chỉ mục
      "ThrowIfIndexInitFailed": true // Ném ngoại lệ khi khởi tạo chỉ mục thất bại, mặc định là: true, sau khi khởi tạo chỉ mục thất bại ứng dụng sẽ dừng chạy
    }
  }
}
```

### Cấu hình OpenObserve

```json
{
  "OpenObserve": {
    "Endpoint": "http://localhost:5080", // Địa chỉ dịch vụ OpenObserve
    "Organization": "default", // Tên tổ chức
    "AccessToken": "Basic XXXXXXXXXXX" // Tiêu đề ủy quyền, hoặc dùng UserName/Password
  },
  "AuditLogging": {
    "OpenObserve": {
      "Organization": null, // Tổ chức sở hữu luồng dữ liệu, khi để trống sẽ dùng OpenObserve:Organization
      "AuditLogStream": "audit_log", // Luồng dữ liệu chính của nhật ký kiểm toán (gốc)
      "SecurityLogStream": "security_log", // Luồng dữ liệu nhật ký bảo mật
      "WriteEntityChanges": true, // Có làm phẳng các thay đổi thực thể và ghi vào {AuditLogStream}_entity_changes hay không
      "WriteActions": true, // Có làm phẳng các thao tác và ghi vào {AuditLogStream}_actions hay không
      "DefaultQueryDays": 365, // Khoảng truy vấn mặc định (ngày) khi không chỉ định phạm vi thời gian
      "UseLogTimeAsTimestamp": true, // Có dùng thời gian nghiệp vụ của nhật ký để ghi đè _timestamp hay không
      "TimestampAllowedUptoHours": 5 // Số giờ lùi tối đa khi ghi đè _timestamp, cần khớp với ZO_INGEST_ALLOWED_UPTO ở phía máy chủ
    }
  }
}
```

> Tên luồng dữ liệu con được tính từ `AuditLogStream` (thay đổi thực thể = `{AuditLogStream}_entity_changes`, thao tác = `{AuditLogStream}_actions`), không cần cấu hình riêng.

## Cấu hình chuỗi kết nối cơ sở dữ liệu

```json
{
  "ConnectionStrings": {
    "AbpIdentity": "Server=127.0.0.1;Database=Identity;User Id=root;Password=*",
    "AbpAuditLogging": "Server=127.0.0.1;Database=AuditLogging;User Id=root;Password=*"
  }
}
```

## Tính năng nâng cao

### Bỏ qua các kiểu cụ thể

Theo mặc định, mô-đun sẽ bỏ qua nhật ký kiểm toán của các kiểu sau:

- CancellationToken
- CancellationTokenSource

Bạn có thể thêm các kiểu cần bỏ qua khác thông qua cấu hình:

```csharp
Configure<AbpAuditingOptions>(options =>
{
    options.IgnoredTypes.AddIfNotContains(typeof(YourType));
});
```

## Lưu ý đặc biệt

- Triển khai Elasticsearch hỗ trợ đa tenant, sẽ tự động chuyển đổi chỉ mục theo tenant
- Triển khai EntityFrameworkCore chủ yếu đóng vai trò cầu nối, việc triển khai cụ thể do mô-đun chính thức của Abp quản lý
- Triển khai OpenObserve cũng cách ly luồng dữ liệu theo tenant, luồng dữ liệu của tenant có dạng `audit_log_{tenantId:N}`: ghi theo tenant của chính nhật ký, truy vấn theo tenant hiện tại, quy tắc đặt tên có thể ghi đè qua `IOpenObserveStreamNameNormalizer`
- OpenObserve là bộ nhớ chỉ thêm (append-only) và không hỗ trợ SQL `DELETE`/`UPDATE`, do đó `IAuditLogManager.DeleteAsync`/`DeleteManyAsync` sẽ ném ngoại lệ nghiệp vụ `AuditLoggingOpenObserve:010001` ("Cơ sở nhật ký hiện tại không hỗ trợ xóa bản ghi!"), việc dọn dẹp dữ liệu hãy cấu hình chính sách lưu giữ ở phía OpenObserve hoặc dùng giao diện xóa theo phạm vi thời gian của nó
- OpenObserve sẽ lưu mảng lồng nhau dưới dạng cột chuỗi JSON (tên cột chính là tên trường), do đó các thay đổi thực thể và thao tác được làm phẳng và ghi vào các luồng dữ liệu độc lập; điều kiện `Actions.*` của thao tác dùng truy vấn hai đoạn (trước tiên khớp `auditlogid` trong luồng dữ liệu thao tác, sau đó lọc lại trong luồng dữ liệu chính theo `id in (...)`)
- Luồng dữ liệu được OpenObserve tự động tạo khi ghi lần đầu, mô-đun không thăm dò, không tạo, không sửa đổi cài đặt luồng dữ liệu; khi truy vấn luồng dữ liệu chưa được tạo sẽ trả về kết quả rỗng và ghi nhật ký cảnh báo
