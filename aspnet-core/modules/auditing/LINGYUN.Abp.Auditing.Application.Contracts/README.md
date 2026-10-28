# LINGYUN.Abp.Auditing.Application.Contracts

Mô-đun hợp đồng tầng ứng dụng nhật ký kiểm toán, định nghĩa giao diện dịch vụ ứng dụng nhật ký kiểm toán và đối tượng truyền dữ liệu.

[English](./README.EN.md)

## Tính năng

* Định nghĩa giao diện dịch vụ ứng dụng nhật ký kiểm toán
* Định nghĩa đối tượng truyền dữ liệu (DTO) nhật ký kiểm toán
* Định nghĩa quyền nhật ký kiểm toán
* Định nghĩa tham số truy vấn nhật ký kiểm toán

## Tham chiếu mô-đun

```csharp
[DependsOn(typeof(AbpAuditingApplicationContractsModule))]
public class YouProjectModule : AbpModule
{
  // other
}
```

## Định nghĩa quyền

* AuditLogging.AuditLogs - Quản lý nhật ký kiểm toán
  - AuditLogging.AuditLogs.Delete - Xóa nhật ký kiểm toán
  - AuditLogging.SecurityLogs - Quản lý nhật ký bảo mật
  - AuditLogging.SecurityLogs.Delete - Xóa nhật ký bảo mật

## Giao diện dịch vụ

* IAuditLogAppService
  ```csharp
  public interface IAuditLogAppService : IApplicationService
  {
      Task<AuditLogDto> GetAsync(Guid id);
      Task<PagedResultDto<AuditLogDto>> GetListAsync(GetAuditLogsInput input);
      Task DeleteAsync(Guid id);
      Task DeleteManyAsync(DeleteManyAuditLogsInput input);
  }
  ```

* ISecurityLogAppService
  ```csharp
  public interface ISecurityLogAppService : IApplicationService
  {
      Task<SecurityLogDto> GetAsync(Guid id);
      Task<PagedResultDto<SecurityLogDto>> GetListAsync(GetSecurityLogsInput input);
      Task DeleteAsync(Guid id);
      Task DeleteManyAsync(DeleteManySecurityLogsInput input);
  }
  ```

## Đối tượng truyền dữ liệu

* AuditLogDto - DTO nhật ký kiểm toán
* SecurityLogDto - DTO nhật ký bảo mật
* GetAuditLogsInput - Tham số đầu vào lấy nhật ký kiểm toán
* GetSecurityLogsInput - Tham số đầu vào lấy nhật ký bảo mật
* DeleteManyAuditLogsInput - Tham số đầu vào xóa hàng loạt nhật ký kiểm toán
* DeleteManySecurityLogsInput - Tham số đầu vào xóa hàng loạt nhật ký bảo mật
