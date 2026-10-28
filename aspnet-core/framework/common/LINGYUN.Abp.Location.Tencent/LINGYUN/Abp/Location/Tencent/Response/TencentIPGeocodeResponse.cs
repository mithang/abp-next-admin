using LINGYUN.Abp.Location.Tencent.Model;
using Newtonsoft.Json;

namespace LINGYUN.Abp.Location.Tencent.Response;

public class TencentIPGeocodeResponse : TencentLocationResponse
{
    /// <summary>
    /// Kết quả định vị IP
    /// </summary>
    [JsonProperty("result")]
    public TencentIPGeocode Result { get; set; } = new TencentIPGeocode();
}
