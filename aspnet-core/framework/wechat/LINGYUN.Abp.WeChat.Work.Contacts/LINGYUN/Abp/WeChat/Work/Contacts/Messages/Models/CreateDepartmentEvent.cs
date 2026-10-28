using LINGYUN.Abp.WeChat.Common.Messages;
using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện thêm phòng ban
/// </summary>
[EventName("create_party")]
public class CreateDepartmentEvent : DepartmentUpdateEvent
{
    /// <summary>
    /// Thứ tự sắp xếp phòng ban
    /// </summary>
    [XmlElement("Order", IsNullable = true)]
    public int? Order { get; set; }
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<CreateDepartmentEvent>(this);
    }
}
