using System;

namespace LINGYUN.Abp.Notifications.WeChat.Work;

/// <summary>
/// Khóa dữ liệu thông báo WeChat Work
/// </summary>
/// <remarks>
/// Tên khóa giữ nhất quán với cách triển khai trước đây (tiền tố <c>wx-work:</c>), đảm bảo các producer đã triển khai không bị ảnh hưởng.
/// </remarks>
public static class WeChatWorkNotificationDataKeys
{
    public const string Prefix = "wx-work:";

    /// <summary>
    /// Chỉ định thành viên nhận tin nhắn
    /// </summary>
    public const string ToUser = Prefix + "to_user";
    /// <summary>
    /// Chỉ định phòng ban nhận tin nhắn
    /// </summary>
    public const string ToParty = Prefix + "to_party";
    /// <summary>
    /// Chỉ định nhãn nhận tin nhắn
    /// </summary>
    public const string ToTag = Prefix + "to_tag";
    /// <summary>
    /// Định danh ứng dụng
    /// </summary>
    public const string AgentId = Prefix + "agent_id";
    /// <summary>
    /// Có phải tin nhắn bảo mật hay không
    /// </summary>
    public const string Safe = Prefix + "safe";
    /// <summary>
    /// Có bật chuyển đổi id hay không
    /// </summary>
    public const string EnableIdTrans = Prefix + "enable_id_trans";
    /// <summary>
    /// Có bật kiểm tra tin nhắn trùng lặp hay không
    /// </summary>
    public const string EnableDuplicateCheck = Prefix + "enable_duplicate_check";
    /// <summary>
    /// Khoảng thời gian kiểm tra tin nhắn trùng lặp
    /// </summary>
    public const string DuplicateCheckInterval = Prefix + "duplicate_check_interval";

    public const string MiniProgramMessage = Prefix + "mini_program_message";
    public const string MpNewMessage = Prefix + "mp_new_message";
    public const string TemplateCardMessage = Prefix + "template_card_message";
    public const string TextCardMessage = Prefix + "text_card_message";
    public const string VideoMessage = Prefix + "video_message";
    public const string VoiceMessage = Prefix + "voice_message";
    public const string FileMessage = Prefix + "file_message";
}
