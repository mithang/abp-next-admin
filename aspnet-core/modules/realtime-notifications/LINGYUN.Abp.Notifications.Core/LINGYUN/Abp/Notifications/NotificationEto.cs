using LINGYUN.Abp.RealTime;
using System;
using System.Collections.Generic;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;

namespace LINGYUN.Abp.Notifications;

[Serializable]
[GenericEventName(Prefix = "abp.realtime.")]
public class NotificationEto<T> : RealTimeEto<T>, IMultiTenant
{
    /// <summary>
    /// Mã định danh thông báo
    /// Tự động tính toán
    /// </summary>
    public long Id { get; set; }
    /// <summary>
    /// Tenant
    /// </summary>
    public Guid? TenantId { get; set; }
    /// <summary>
    /// Tên thông báo
    /// </summary>
    public string Name { get; set; } = default!;
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
    /// Lưu ý:<br/>
    /// Nếu đã chỉ định danh sách người dùng, trong chương trình đăng ký sự kiện nên lọc người dùng đã đăng ký thông qua tập hợp này<br/>
    /// Nếu chưa chỉ định danh sách người dùng, trong chương trình đăng ký sự kiện nên lọc tất cả người dùng đã đăng ký thông báo này
    /// </remarks>
    public List<UserIdentifier> Users { get; set; } = new List<UserIdentifier>();
    /// <summary>
    /// Danh sách nhà cung cấp thông báo do người dùng chỉ định
    /// </summary>
    /// <remarks>
    /// Lưu ý:<br/>
    /// Nếu đã chỉ định nhà cung cấp thông báo, sẽ chỉ sử dụng nhà cung cấp cụ thể đó để phát hành thông báo
    /// </remarks>
    public List<string> UseProviders { get; set; } = new List<string>();
    public NotificationEto() : base()
    {
    }

    public NotificationEto(T data) : base(data)
    {
    }
}
