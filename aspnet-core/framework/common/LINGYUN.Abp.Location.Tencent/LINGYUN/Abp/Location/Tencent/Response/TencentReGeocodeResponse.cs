using LINGYUN.Abp.Location.Tencent.Model;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Response;

public class TencentReGeocodeResponse : TencentLocationResponse
{
    /// <summary>
    /// Kết quả phân tích địa chỉ ngược
    /// </summary>
    [JsonProperty("result")]
    public TencentReGeocode Result { get; set; } = new TencentReGeocode();
}
