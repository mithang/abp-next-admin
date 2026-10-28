using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Tin nhắn vị trí địa lý
/// </summary>
[EventName("geo_location")]
public class GeoLocationMessage : WeChatOfficialGeneralMessage
{
    /// <summary>
    /// Vĩ độ vị trí địa lý
    /// </summary>
    [XmlElement("Location_X")]
    public double Latitude { get; set; }
    /// <summary>
    /// Kinh độ vị trí địa lý
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
    public string Label { get; set; } = default!;
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialGeneralMessageEto<GeoLocationMessage>(this);
    }
}
