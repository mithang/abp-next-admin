using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sự kiện sửa đổi lịch trình
/// </summary>
/// <remarks>
/// Sau khi ứng dụng tạo lịch trình qua API, khi quản trị viên lịch trình sửa đổi lịch trình, sự kiện này sẽ được kích hoạt.
/// </remarks>
[EventName("modify_schedule")]
public class UpdateScheduleEvent : WeChatWorkEventMessage
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
        return new WeChatWorkEventMessageEto<UpdateScheduleEvent>(this);
    }
}
