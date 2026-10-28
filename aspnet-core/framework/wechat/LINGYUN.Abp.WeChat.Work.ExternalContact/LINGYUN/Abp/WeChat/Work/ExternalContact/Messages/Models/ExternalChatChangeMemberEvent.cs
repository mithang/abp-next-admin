using System.Collections.Generic;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Đẩy sự kiện thay đổi thành viên nhóm khách hàng
/// </summary>
public abstract class ExternalChatChangeMemberEvent : ExternalChatUpdateEvent
{
    /// <summary>
    /// Số lượng thành viên thay đổi
    /// </summary>
    [XmlElement("MemChangeCnt")]
    public int MemChangeCnt { get; set; }
    /// <summary>
    /// Danh sách thành viên thay đổi
    /// </summary>
    [XmlElement("MemChangeList")]
    public List<ExternalChatChangeMember> MemChangeList { get; set; } = new List<ExternalChatChangeMember>();
    /// <summary>
    /// Số phiên bản thành viên nhóm trước khi thay đổi
    /// </summary>
    [XmlElement("LastMemVer")]
    public string LastMemVer { get; set; } = default!;
    /// <summary>
    /// Số phiên bản thành viên nhóm sau khi thay đổi
    /// </summary>
    [XmlElement("CurMemVer")]
    public string CurMemVer { get; set; } = default!;
}

public class ExternalChatChangeMember
{
    /// <summary>
    /// Id thành viên
    /// </summary>
    [XmlElement("Item")]
    public string UserId { get; set; } = default!;
}
