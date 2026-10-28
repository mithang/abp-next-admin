using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.Common.Members.Models;
/// <summary>
/// Trạng thái tài khoản video
/// </summary>
[Description("Trạng thái tài khoản video")]
public enum WechatChannelStatus
{
    /// <summary>
    /// Đã xác nhận
    /// </summary>
    [Description("Đã xác nhận")]
    Confirmed = 0,
    /// <summary>
    /// Chờ xác nhận
    /// </summary>
    [Description("Chờ xác nhận")]
    UnConfirmed = 1,
}
