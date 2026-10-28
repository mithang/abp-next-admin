using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Kịch bản thêm qua kênh Video
/// </summary>
[Description("Kịch bản thêm qua kênh Video")]
public enum FollowUserWechatChannelSource
{
    /// <summary>
    /// Không xác định
    /// </summary>
    [Description("Không xác định")]
    None = 0,
    /// <summary>
    /// Trang chủ kênh Video
    /// </summary>
    [Description("Trang chủ kênh Video")]
    Home = 1,
    /// <summary>
    /// Phòng phát trực tiếp kênh Video
    /// </summary>
    [Description("Phòng phát trực tiếp kênh Video")]
    LiveRoom = 2,
    /// <summary>
    /// Dịch vụ thu thập thông tin khách hàng tiềm năng của kênh Video
    /// </summary>
    [Description("Dịch vụ thu thập thông tin khách hàng tiềm năng của kênh Video")]
    RetentionService = 3
}
