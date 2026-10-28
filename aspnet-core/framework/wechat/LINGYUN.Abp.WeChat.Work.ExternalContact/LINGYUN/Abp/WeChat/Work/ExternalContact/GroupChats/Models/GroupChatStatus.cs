using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Trạng thái theo dõi nhóm khách hàng
/// </summary>
[Description("Trạng thái theo dõi nhóm khách hàng")]
public enum GroupChatStatus
{
    /// <summary>
    /// Người theo dõi bình thường
    /// </summary>
    [Description("Người theo dõi bình thường")]
    Normal = 0,
    /// <summary>
    /// Người theo dõi đã nghỉ việc
    /// </summary>
    [Description("Người theo dõi đã nghỉ việc")]
    Leaves = 1,
    /// <summary>
    /// Đang kế thừa sau khi nghỉ việc
    /// </summary>
    [Description("Đang kế thừa sau khi nghỉ việc")]
    Resiging = 2,
    /// <summary>
    ///Đã hoàn tất kế thừa sau khi nghỉ việc
    /// </summary>
    [Description("Đã hoàn tất kế thừa sau khi nghỉ việc")]
    ResignCompleted = 3,
}
