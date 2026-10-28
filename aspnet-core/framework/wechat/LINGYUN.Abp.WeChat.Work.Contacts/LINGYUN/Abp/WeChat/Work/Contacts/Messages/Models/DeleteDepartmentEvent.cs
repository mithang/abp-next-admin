using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện xóa phòng ban
/// </summary>
[EventName("delete_party")]
public class DeleteDepartmentEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// ID phòng ban
    /// </summary>
    [XmlElement("Id")]
    public string Id { get; set; } = default!;

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<DeleteDepartmentEvent>(this);
    }
}
