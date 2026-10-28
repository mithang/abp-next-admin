namespace LINGYUN.Abp.IM.SignalR;

public class AbpIMSignalROptions
{
    /// <summary>
    /// Tên phương thức nhận tin nhắn phía client tùy chỉnh
    /// </summary>
    public string GetChatMessageMethod { get; set; }
    /// <summary>
    /// Tên phương thức thu hồi tin nhắn phía client tùy chỉnh
    /// </summary>
    public string ReCallChatMessageMethod { get; set; }
    /// <summary>
    /// Tên phương thức nhận khi người dùng trực tuyến
    /// </summary>
    public string UserOnlineMethod { get; set; }
    /// <summary>
    /// Tên phương thức nhận khi người dùng ngoại tuyến
    /// </summary>
    public string UserOfflineMethod { get; set; }

    public AbpIMSignalROptions()
    {
        GetChatMessageMethod = "get-chat-message";
        ReCallChatMessageMethod = "recall-chat-message";
        UserOnlineMethod = "on-user-onlined";
        UserOfflineMethod = "on-user-offlined";
    }
}
