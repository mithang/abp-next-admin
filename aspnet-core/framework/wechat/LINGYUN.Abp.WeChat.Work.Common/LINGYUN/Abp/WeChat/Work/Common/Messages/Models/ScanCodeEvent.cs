using System.Xml.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Sự kiện người dùng quét mã
/// </summary>
public abstract class ScanCodeEvent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// Thông tin quét
    /// </summary>
    [XmlElement("ScanCodeInfo")]
    public ScanCodeInfo ScanCodeInfo { get; set; } = default!;
}

public class ScanCodeInfo
{
    /// <summary>
    /// Loại quét, thường là qrcode
    /// </summary>
    [XmlElement("ScanType")]
    public string ScanType { get; set; } = default!;
    /// <summary>
    /// Kết quả quét, tức là thông tin chuỗi tương ứng với mã QR
    /// </summary>
    [XmlElement("ScanResult")]
    public string ScanResult { get; set; } = default!;
}
