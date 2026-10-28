using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.OA.MeetingRooms.Models;
/// <summary>
/// Trạng thái đặt trước
/// </summary>
[Description("Trạng thái đặt trước")]
public enum MeetingRoomScheduleStatus
{
    /// <summary>
    /// Đã đặt trước
    /// </summary>
    [Description("Đã đặt trước")]
    Reserved = 0,
    /// <summary>
    /// Đang nộp đơn
    /// </summary>
    [Description("Đang nộp đơn")]
    Applying = 2,
    /// <summary>
    /// Đang phê duyệt
    /// </summary>
    [Description("Đang phê duyệt")]
    Approvaling = 3,
}
