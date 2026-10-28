namespace LINGYUN.Abp.EventBus.CAP;

/// <summary>
/// Mục cấu hình dọn dẹp thông điệp hết hạn
/// </summary>
public class AbpCAPEventBusOptions
{
    /// <summary>
    /// Thông báo khi xử lý thông điệp đã phát hành thất bại
    /// default: false
    /// </summary>
    public bool NotifyFailedCallback { get; set; } = false;
}
