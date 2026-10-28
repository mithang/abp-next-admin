using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Bộ lọc trạng thái theo dõi nhóm khách hàng
/// </summary>
[Description("Bộ lọc trạng thái theo dõi nhóm khách hàng")]
public enum StatusFilter
{
    /// <summary>
    /// Tất cả danh sách
    /// </summary>
    [Description("Tất cả danh sách")]
    All = 0,
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
    /// Hoàn tất kế thừa sau khi nghỉ việc
    /// </summary>
    [Description(" Hoàn tất kế thừa sau khi nghỉ việc")]
    ResignCompleted = 3,
}
