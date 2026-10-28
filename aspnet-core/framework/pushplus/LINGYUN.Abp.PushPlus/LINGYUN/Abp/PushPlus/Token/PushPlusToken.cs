using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Token;

public class PushPlusToken
{
    /// <summary>
    /// Token truy cập, các yêu cầu tiếp theo cần thêm vào header
    /// </summary>
    [JsonProperty("accessKey")]
    public string AccessKey { get; set; } = default!;
    /// <summary>
    /// Thời gian hết hạn, sau khi hết hạn cần lấy lại
    /// </summary>
    [JsonProperty("expiresIn")]
    public int ExpiresIn { get; set; }

    public PushPlusToken()
    {

    }

    public PushPlusToken(string accessKey, int expiresIn)
    {
        AccessKey = accessKey;
        ExpiresIn = expiresIn;
    }
}
