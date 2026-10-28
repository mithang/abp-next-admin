using LINGYUN.Abp.WeChat.Work.Common.Messages;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Messages.Models;
/// <summary>
/// Sự kiện thay đổi phòng ban
/// </summary>
public abstract class DepartmentUpdateEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Id phòng ban
    /// </summary>
    [XmlElement("Id")]
    public int Id { get; set; }
    /// <summary>
    /// Tên phòng ban
    /// </summary>
    [XmlElement("Name")]
    public string Name { get; set; } = default!;
    /// <summary>
    /// id phòng ban cha
    /// </summary>
    [XmlElement("ParentId", IsNullable = true)]
    public int? ParentId { get; set; }
}
