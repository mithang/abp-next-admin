using System.ComponentModel;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Cách thành viên rời nhóm
/// </summary>
[Description("Cách thành viên rời nhóm")]
public enum ExternalChatMemberQuitScene
{
    /// <summary>
    /// Tự rời nhóm
    /// </summary>
    [XmlEnum("0")]
    [Description("Tự rời nhóm")]
    UserSelf = 0,
    /// <summary>
    /// Chủ nhóm/quản trị viên nhóm xóa khỏi nhóm
    /// </summary>
    [XmlEnum("1")]
    [Description("Chủ nhóm/quản trị viên nhóm xóa khỏi nhóm")]
    Admin = 1
}
