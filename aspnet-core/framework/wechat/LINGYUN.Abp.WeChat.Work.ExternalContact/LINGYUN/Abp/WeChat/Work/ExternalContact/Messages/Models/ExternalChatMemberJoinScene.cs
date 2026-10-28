using System.ComponentModel;
using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Messages.Models;
/// <summary>
/// Cách thành viên tham gia nhóm
/// </summary>
[Description("Cách thành viên tham gia nhóm")]
public enum ExternalChatMemberJoinScene
{
    /// <summary>
    /// Được thành viên mời tham gia nhóm
    /// </summary>
    [XmlEnum("0")]
    [Description("Được thành viên mời tham gia nhóm")]
    MemberInvitation = 0,
    /// <summary>
    /// Tham gia nhóm bằng cách quét mã QR của nhóm
    /// </summary>
    [XmlEnum("3")]
    [Description("Tham gia nhóm bằng cách quét mã QR của nhóm")]
    ScanQrCode = 3
}
