namespace LINGYUN.Abp.Notifications.WeChat.MiniProgram;

/// <summary>
/// TODO: Cải tiến sau này, tích hợp mục cấu hình vào <see cref="LINGYUN.Abp.WeChat.MiniProgram.AbpWeChatMiniProgramOptions"/>
/// </summary>
public class AbpNotificationsWeChatMiniProgramOptions
{
    /// <summary>
    /// Mẫu Mini Program mặc định
    /// </summary>
    public string DefaultTemplateId { get; set; } = default!;
    /// <summary>
    /// Loại Mini Program chuyển hướng mặc định
    /// </summary>
    public string DefaultState { get; set; } = "developer";
    /// <summary>
    /// Ngôn ngữ Mini Program mặc định
    /// </summary>
    public string DefaultLanguage { get; set; } = "zh_CN";
}
