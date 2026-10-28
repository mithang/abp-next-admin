using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.OA.Messages.Models;
/// <summary>
/// Sự kiện đặt phòng họp
/// </summary>
/// <remarks>
/// Khi người dùng đặt phòng họp trong WeChat Work, sự kiện này sẽ được gọi lại cho ứng dụng hệ thống phòng họp.
/// </remarks>
[EventName("book_meeting_room")]
public class BookMeetingRoomEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Id phòng họp
    /// </summary>
    [XmlElement("MeetingRoomId")]
    public int MeetingRoomId { get; set; }
    /// <summary>
    /// Id đặt phòng, có thể truy vấn tình trạng đặt cuộc họp cụ thể theo ID này
    /// </summary>
    [XmlElement("BookingId")]
    public string BookingId { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<BookMeetingRoomEvent>(this);
    }
}
