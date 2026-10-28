using System.ComponentModel;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.GroupChats.Models;
/// <summary>
/// Cách tham gia nhóm
/// </summary>
[Description("Cách tham gia nhóm")]
public enum GroupChatMemberJoinScene
{
    /// <summary>
    /// Được thành viên nhóm mời vào nhóm (mời trực tiếp vào nhóm)
    /// </summary>
    [Description("Mời trực tiếp vào nhóm")]
    DirectInvitation = 1,
    /// <summary>
    /// Được thành viên nhóm mời vào nhóm (vào nhóm qua liên kết mời)
    /// </summary>
    [Description("Vào nhóm qua liên kết mời")]
    InvitationLink = 2,
    /// <summary>
    /// Vào nhóm bằng cách quét mã QR của nhóm
    /// </summary>
    [Description("Vào nhóm bằng cách quét mã QR của nhóm")]
    ScanQrCode = 3,
}
