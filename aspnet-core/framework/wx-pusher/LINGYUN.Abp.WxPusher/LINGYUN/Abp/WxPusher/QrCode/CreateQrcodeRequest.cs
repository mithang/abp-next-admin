using JetBrains.Annotations;
using Newtonsoft.Json;
using System;
using Volo.Abp;

namespace LINGYUN.Abp.WxPusher.QrCode;

[Serializable]
public class CreateQrcodeRequest
{
    /// <summary>
    /// Dấu hiệu của ứng dụng
    /// </summary>
    [JsonProperty("appToken")]
    public string AppToken { get; }
    /// <summary>
    /// Tham số mà mã QR mang theo, tối đa 64 bit
    /// </summary>
    [JsonProperty("extra")]
    public string Extra { get; }
    /// <summary>
    /// Thời gian hiệu lực của mã QR, tính bằng giây (s), tối đa 30 ngày.
    /// </summary>
    [JsonProperty("validTime")]
    public int ValidTime { get; }

    public CreateQrcodeRequest(
        [NotNull] string appToken,
        [NotNull] string extra, 
        int validTime = 1800)
    {
        Check.NotNullOrWhiteSpace(appToken, nameof(appToken));
        Check.NotNullOrWhiteSpace(extra, nameof(extra), 64);

        AppToken = appToken;
        Extra = extra;
        ValidTime = validTime;
    }
}
