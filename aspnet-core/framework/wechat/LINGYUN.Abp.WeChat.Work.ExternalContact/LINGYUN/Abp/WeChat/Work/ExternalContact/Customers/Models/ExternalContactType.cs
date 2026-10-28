using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Loại liên hệ bên ngoài
/// </summary>
[Description("Loại liên hệ bên ngoài")]
public enum ExternalContactType
{
    /// <summary>
    /// Người dùng WeChat
    /// </summary>
    [Description("Người dùng WeChat")]
    WeChat = 1,
    /// <summary>
    /// Người dùng WeChat Work
    /// </summary>
    [Description("Người dùng WeChat Work")]
    WeChatWork = 2,
}
