using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.WxPusher.User;

[Serializable]
public class UserProfile
{
    /// <summary>
    /// Uid người dùng
    /// </summary>
    [JsonProperty("uid")]
    public string Uid { get; set; } = default!;
    /// <summary>
    /// Id ứng dụng hoặc chủ đề mà người dùng theo dõi, phân biệt theo type
    /// </summary>
    [JsonProperty("appOrTopicId")]
    public long? AppOrTopicId { get; set; }
    /// <summary>
    /// WeChat không còn trả về đối với người dùng mới, bắt buộc trả về rỗng
    /// </summary>
    [JsonProperty("headImg")]
    public string? HeadImg { get; set; }
    /// <summary>
    /// Thời gian tạo
    /// </summary>
    [JsonProperty("createTime")]
    public long CreateTime { get; set; }
    /// <summary>
    /// WeChat không còn trả về đối với người dùng mới, bắt buộc trả về rỗng
    /// </summary>
    [JsonProperty("nickName")]
    public string? NickName { get; set; }
    /// <summary>
    /// Có bị chặn hay không
    /// </summary>
    [JsonProperty("reject")]
    public bool Reject { get; set; }
    /// <summary>
    /// Nếu gọi giao diện xóa hoặc chặn thì cần id này
    /// </summary>
    [JsonProperty("id")]
    public int Id { get; set; }
    /// <summary>
    /// Loại theo dõi,
    /// 0: theo dõi ứng dụng,
    /// 1: theo dõi topic
    /// </summary>
    [JsonProperty("type")]
    public FlowType Type { get; set; }
    /// <summary>
    /// Tên ứng dụng hoặc chủ đề đã theo dõi
    /// </summary>
    [JsonProperty("target")]
    public string? Target { get; set; }
    /// <summary>
    /// 0 nghĩa là người dùng không phải người dùng trả phí, lớn hơn 0 nghĩa là thời gian hết hạn đăng ký trả phí của người dùng, dấu thời gian ở mức mili giây
    /// </summary>
    [JsonProperty("payEndTime")]
    public long PayEndTime { get; set; }
}
