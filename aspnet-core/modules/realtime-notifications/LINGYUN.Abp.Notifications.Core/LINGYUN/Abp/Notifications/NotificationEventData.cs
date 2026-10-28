using System;
using System.Collections.Generic;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.Notifications;

public class NotificationEventData : IMultiTenant
{
    /// <summary>
    /// Tenant
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Tên thông báo
    /// </summary>
    public string Name { get; set; } = default!;
    /// <summary>
    /// Dùng để định danh một ứng dụng
    /// </summary>
    /// <remarks>
    /// Lưu ý: có thể dùng nó để xác định ranh giới riêng của ứng dụng
    /// </remarks>
    public string Application { get; set; }
    /// <summary>
    /// Dữ liệu
    /// </summary>
    public NotificationData Data { get; set; } = default!;
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    public DateTime CreationTime { get; set; }
    /// <summary>
    /// Mức độ khẩn cấp
    /// </summary>
    public NotificationSeverity Severity { get; set; }
    /// <summary>
    /// Tập hợp thông tin người dùng nhận được chỉ định
    /// </summary>
    /// <remarks>
    /// Chú ý:<br/>
    /// Nếu đã chỉ định danh sách người dùng, cần lọc người dùng đã đăng ký thông qua tập hợp này trong trình xử lý đăng ký sự kiện<br/>
    /// Nếu chưa chỉ định danh sách người dùng, cần lọc tất cả người dùng đã đăng ký thông báo này trong trình xử lý đăng ký sự kiện
    /// </remarks>
    public List<UserIdentifier> Users { get; set; }
    public NotificationEventData()
    {
        Application = "Abp";

        Users = new List<UserIdentifier>();
    }
}
