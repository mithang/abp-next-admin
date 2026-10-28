using LINGYUN.Abp.Location.Tencent.Model;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Response;

public class TencentGeocodeResponse : TencentLocationResponse
{
    /// <summary>
    /// Kết quả phân tích địa chỉ
    /// </summary>
    [JsonProperty("result")]
    public TencentGeocode Result { get; set; } = new TencentGeocode();
}
