using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Work.Common.Messages.Models;
/// <summary>
/// Tin nhắn vị trí địa lý
/// </summary>
[EventName("geo_location")]
public class GeoLocationMessage : WeChatWorkGeneralMessage
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
    public string? Label { get; set; }
    /// <summary>
    /// Loại app, trong WeChat Work luôn trả về wxwork, trong WeChat thì không trả về trường này
    /// </summary>
    [XmlElement("AppType")]
    public string? AppType { get; set; }
    public override WeChatMessageEto ToEto()
    {
        return new WeChatWorkGeneralMessageEto<GeoLocationMessage>(this);
    }
}
