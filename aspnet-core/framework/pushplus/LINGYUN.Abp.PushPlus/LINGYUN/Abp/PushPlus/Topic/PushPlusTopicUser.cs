using LINGYUN.Abp.PushPlus.User;
using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Topic;

public class PushPlusTopicUser
{
    /// <summary>
    /// Mã số người dùng; có thể dùng để xóa người dùng
    /// </summary>
    [JsonProperty("id")]
    public int Id { get; set; }
    /// <summary>
    /// Biệt danh
    /// </summary>
    [JsonProperty("nickName")]
    public string? NickName { get; set; }
    /// <summary>
    /// openId WeChat của người dùng
    /// </summary>
    [JsonProperty("openId")]
    public string? OpenId { get; set; }
    /// <summary>
    /// Địa chỉ url ảnh đại diện
    /// </summary>
    [JsonProperty("headImgUrl")]
    public string? HeadImgUrl { get; set; }
    /// <summary>
    /// Địa chỉ url ảnh đại diện
    /// </summary>
    [JsonProperty("userSex")]
    public PushPlusUserSex? UserSex { get; set; }
    /// <summary>
    /// Đã liên kết điện thoại hay chưa; 0-chưa liên kết, 1-đã liên kết
    /// </summary>
    [JsonProperty("havePhone")]
    public PushPlusUserPhoneBindStatus? HavePhone { get; set; }
    /// <summary>
    /// Đã theo dõi tài khoản chính thức WeChat hay chưa; 0-chưa theo dõi, 1-đã theo dõi
    /// </summary>
    [JsonProperty("isFollow")]
    public PushPlusUserFollowStatus? IsFollow { get; set; }
    /// <summary>
    /// Trạng thái xác minh email; 0-chưa xác minh, 1-đang chờ xác minh, 2-đã xác minh
    /// </summary>
    [JsonProperty("emailStatus")]
    public PushPlusUserEmailStatus? EmailStatus { get; set; }
}
