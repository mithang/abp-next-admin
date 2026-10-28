namespace LINGYUN.Abp.IM.Messages;

public enum MessageType
{
    /// <summary>
    /// Tin nhắn văn bản
    /// </summary>
    Text = 0,
    /// <summary>
    /// Tin nhắn hình ảnh
    /// </summary>
    Image = 10,
    /// <summary>
    /// Liên kết
    /// </summary>
    Link = 20,
    /// <summary>
    /// Video
    /// </summary>
    Video = 30,
    /// <summary>
    /// Âm thanh
    /// </summary>
    Voice = 40,
    /// <summary>
    /// Tệp
    /// </summary>
    File = 50,
    /// <summary>
    /// Thông báo
    /// Thường dùng cho xử lý lỗi
    /// </summary>
    Notifier = 100,
}
