using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.PushPlus.User;

public class PushPlusUserProfile
{
    /// <summary>
    /// openId WeChat của người dùng
    /// </summary>
    [JsonProperty("openId")]
    public string? OpenId { get; set; }
    /// <summary>
    /// unionId WeChat của người dùng
    /// </summary>
    [JsonProperty("unionId")]
    public string? UnionId { get; set; }
    /// <summary>
    /// Biệt danh
    /// </summary>
    [JsonProperty("nickName")]
    public string? NickName { get; set; }
    /// <summary>
    /// Ảnh đại diện
    /// </summary>
    [JsonProperty("headImgUrl")]
    public string? HeadImgUrl { get; set; }
    /// <summary>
    /// Giới tính;
    /// 0-Chưa thiết lập,
    /// 1-Nam,
    /// 2-Nữ
    /// </summary>
    [JsonProperty("userSex")]
    public PushPlusUserSex? Sex { get; set; }
    /// <summary>
    /// Mã token của người dùng
    /// </summary>
    [JsonProperty("token")]
    public string? Token { get; set; }
    /// <summary>
    /// Số điện thoại di động
    /// </summary>
    [JsonProperty("phoneNumber")]
    public string? PhoneNumber { get; set; }
    /// <summary>
    /// Email
    /// </summary>
    [JsonProperty("email")]
    public string? Email { get; set; }
    /// <summary>
    /// Trạng thái xác minh email;
    /// 0-Chưa xác minh,
    /// 1-Chờ xác minh,
    /// 2-Đã xác minh
    /// </summary>
    [JsonProperty("emailStatus")]
    public PushPlusUserEmailStatus? EmailStatus { get; set; }
    /// <summary>
    /// Ngày sinh
    /// </summary>
    [JsonProperty("birthday")]
    public DateTime? Birthday { get; set; }
    /// <summary>
    /// Điểm tích lũy của người dùng
    /// </summary>
    [JsonProperty("points")]
    public int? Points { get; set; }
}
