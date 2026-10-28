using LINGYUN.Abp.WeChat.Common.Messages;
using System.Xml.Serialization;
using Volo.Abp.EventBus;

namespace LINGYUN.Abp.WeChat.Official.Messages.Models;
/// <summary>
/// Sự kiện báo cáo vị trí địa lý
/// </summary>
[EventName("reporting_geo_location")]
public class ReportingGeoLocationEvent : WeChatEventMessage
{
    /// <summary>
    /// Vĩ độ vị trí địa lý
    /// </summary>
    [XmlElement("Latitude")]
    public double Latitude { get; set; }
    /// <summary>
    /// Kinh độ vị trí địa lý
    /// </summary>
    [XmlElement("Longitude")]
    public double Longitude { get; set; }
    /// <summary>
    /// Độ chính xác vị trí địa lý
    /// </summary>
    [XmlElement("Precision")]
    public double Precision { get; set; }
    public override WeChatMessageEto ToEto()
    {
        return new WeChatOfficialEventMessageEto<ReportingGeoLocationEvent>(this);
    }
}
