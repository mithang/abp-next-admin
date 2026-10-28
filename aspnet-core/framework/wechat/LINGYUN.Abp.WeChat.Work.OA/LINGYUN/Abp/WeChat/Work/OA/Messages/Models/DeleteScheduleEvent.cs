using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sự kiện xóa lịch trình
/// </summary>
/// <remarks>
/// Khi quản trị viên lịch trình xóa lịch trình trên lịch đã tạo qua API, sự kiện này sẽ được kích hoạt.
/// </remarks>
[EventName("delete_schedule")]
public class DeleteScheduleEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// ID lịch
    /// </summary>
    [XmlElement("CalId")]
    public string? CalId { get; set; }
    /// <summary>
    /// ID lịch trình
    /// </summary>
    [XmlElement("ScheduleId")]
    public string ScheduleId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<DeleteScheduleEvent>(this);
    }
}