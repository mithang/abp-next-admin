using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sửa đổi sự kiện lịch
/// </summary>
/// <remarks>
/// Khi quản trị viên lịch sửa đổi lịch được tạo bằng API, sự kiện này sẽ được kích hoạt.
/// </remarks>
[EventName("modify_calendar")]
public class UpdateCalendarEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Id lịch
    /// </summary>
    [XmlElement("CalId")]
    public string CalId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<UpdateCalendarEvent>(this);
    }
}
