using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.User;

public class PushPlusUserLimitTime
{
    /// <summary>
    /// Trạng thái giới hạn gửi;
    /// 1-Không giới hạn,
    /// 2-Giới hạn ngắn hạn,
    /// 3-Giới hạn vĩnh viễn
    /// </summary>
    [JsonProperty("sendLimit")]
    public PushPlusUserSendLimit SendLimit { get; set; }
    /// <summary>
    /// Thời gian gỡ chặn
    /// </summary>
    [JsonProperty("userLimitTime")]
    public string? UserLimitTime { get; set; }
}
