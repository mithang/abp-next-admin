using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Đẩy sự kiện mở bộ chọn vị trí địa lý
/// </summary>
[EventName("location_select")]
public class GeoLocationSelectPushEevent : WeChatWorkEventMessage
{
    /// <summary>
    /// Giá trị KEY của sự kiện
    /// </summary>
    [XmlElement("EventKey")]
    public string EventKey { get; set; } = default!;
    /// <summary>
    /// Thông tin vị trí đã gửi
    /// </summary>
    [XmlElement("SendLocationInfo")]
    public LocationInfo SendLocationInfo { get; set; } = default!;
    /// <summary>
    /// Loại app, trong WeChat Doanh nghiệp luôn trả về wxwork, trong WeChat thì không trả về trường này
    /// </summary>
    [XmlElement("AppType")]
    public string? AppType { get; set; }

    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkEventMessageEto<GeoLocationSelectPushEevent>(this);
    }
}

public class LocationInfo
{
    /// <summary>
    /// Vĩ độ của vị trí địa lý
    /// </summary>
    [XmlElement("Location_X")]
    public double Latitude { get; set; }
    /// <summary>
    /// Kinh độ của vị trí địa lý
    /// </summary>
    [XmlElement("Location_Y")]
    public double Longitude { get; set; }
    /// <summary>
    /// Mức thu phóng bản đồ
    /// </summary>
    [XmlElement("Scale")]
    public double Scale { get; set; }
    /// <summary>
    /// Thông tin vị trí địa lý
    /// </summary>
    [XmlElement("Label")]
    public string? Label { get; set; }
    /// <summary>
    /// Tên của POI, có thể để trống
    /// </summary>
    [XmlElement("Poiname")]
    public string? PoiName { get; set; }
}
