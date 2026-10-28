using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện hệ thống bật lên để gửi ảnh
/// </summary>
public abstract class PicturePushEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("SendPicsInfo")]
    public PictureInfo SendPicsInfo { get; set; } = default!;
}

public class PictureInfo
{
    /// <summary>
    /// Số lượng ảnh đã gửi
    /// </summary>
    [XmlElement("Count")]
    public int Count { get; set; }
    /// <summary>
    /// Số lượng ảnh đã gửi
    /// </summary>
    [XmlArrayItem("Item")]
    public Picture? Picture { get; set; }
}

[XmlRoot("PicList")]
public class Picture
{
    /// <summary>
    /// Giá trị MD5 của ảnh, nhà phát triển nếu cần có thể dùng để xác minh ảnh đã nhận
    /// </summary>
    [XmlElement("PicMd5Sum")]
    public string PicMd5Sum { get; set; } = default!;
}
