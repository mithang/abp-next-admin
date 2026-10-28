using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Tin nhắn thoại
/// </summary>
[EventName("voice")]
public class VoiceMessage : WeChatOfficialGeneralMessage
{
    /// <summary>
    /// Định dạng thoại, ví dụ amr, speex, v.v.
    /// </summary>
    [XmlElement("Format")]
    public string Format { get; set; } = default!;
    /// <summary>
    /// Kết quả nhận dạng giọng nói, mã hoá UTF8
    /// </summary>
    /// <remarks>
    /// Sau khi bật nhận dạng giọng nói, mỗi khi người dùng gửi tin nhắn thoại cho tài khoản công khai, WeChat sẽ thêm trường Recognition vào gói dữ liệu XML của tin nhắn thoại được đẩy (
    /// Lưu ý: do bộ nhớ đệm phía máy khách, việc nhà phát triển bật hoặc tắt tính năng nhận dạng giọng nói có hiệu lực ngay với người theo dõi mới, nhưng với người đã theo dõi cần 24 giờ mới có hiệu lực. Nhà phát triển có thể theo dõi lại tài khoản này để kiểm tra).
    /// </remarks>
    [XmlElement("Recognition")]
    public string Recognition { get; set; } = default!;
    /// <summary>
    /// Id media của tin nhắn thoại, có thể gọi giao diện lấy tài nguyên tạm thời để tải media này
    /// </summary>
    [XmlElement("MediaId")]
    public string MediaId { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialGeneralMessageEto<VoiceMessage>(this);
    }
}
