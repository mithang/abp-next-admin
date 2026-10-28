namespace LINGYUN.Abp.Notifications.SignalR;

public class AbpNotificationsSignalROptions
{
    /// <summary>
    /// Tên phương thức tùy chỉnh để client đăng ký nhận thông báo
    /// </summary>
    public string MethodName { get; set; }

    public AbpNotificationsSignalROptions()
    {
        MethodName = "get-notification";
    }
}
