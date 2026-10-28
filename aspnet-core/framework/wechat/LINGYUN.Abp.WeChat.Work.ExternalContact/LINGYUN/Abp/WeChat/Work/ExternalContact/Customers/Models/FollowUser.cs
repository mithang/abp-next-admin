using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.Customers.Models;
/// <summary>
/// Thành viên doanh nghiệp đã thêm liên hệ bên ngoài
/// </summary>
public class FollowUser
{
    /// <summary>
    /// userid của thành viên doanh nghiệp đã thêm liên hệ bên ngoài này
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// userid khởi tạo việc thêm<br />
    /// Nếu thành viên chủ động thêm, là userid của thành viên;<br />
    /// Nếu khách hàng chủ động thêm, là userid liên hệ bên ngoài của khách hàng;<br />
    /// Nếu là chia sẻ nội bộ/quản trị viên phân công, là userid của thành viên/quản trị viên tương ứng
    /// </summary>
    [NotNull]
    [JsonProperty("oper_userid")]
    [JsonPropertyName("oper_userid")]
    public string OperUserId { get; set; } = default!;
    /// <summary>
    /// Tham số state tùy chỉnh của doanh nghiệp, dùng để phân biệt khách hàng cụ thể được thêm qua liên kết “Liên hệ tôi” hay liên kết thu hút khách hàng nào
    /// </summary>
    [CanBeNull]
    [JsonProperty("state")]
    [JsonPropertyName("state")]
    public string? State { get; set; }
    /// <summary>
    /// Ghi chú của thành viên này đối với liên hệ bên ngoài này
    /// </summary>
    [CanBeNull]
    [JsonProperty("remark")]
    [JsonPropertyName("remark")]
    public string? Remark { get; set; }
    /// <summary>
    /// Mô tả của thành viên này đối với liên hệ bên ngoài này
    /// </summary>
    [CanBeNull]
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    /// <summary>
    /// Thời gian thành viên này thêm liên hệ bên ngoài này
    /// </summary>
    [NotNull]
    [JsonProperty("createtime")]
    [JsonPropertyName("createtime")]
    public long Createtime { get; set; }
    /// <summary>
    /// Danh sách nhãn đã gắn cho liên hệ bên ngoài
    /// </summary>
    [CanBeNull]
    [JsonProperty("tags")]
    [JsonPropertyName("tags")]
    public List<FollowUserTag>? Tags { get; set; }
    /// <summary>
    /// Tên doanh nghiệp mà thành viên này ghi chú cho khách hàng WeChat này (chỉ khách hàng WeChat mới có trường này)
    /// </summary>
    [CanBeNull]
    [JsonProperty("remark_corp_name")]
    [JsonPropertyName("remark_corp_name")]
    public string? RemarkCorpName { get; set; }
    /// <summary>
    /// Số điện thoại mà thành viên này ghi chú cho khách hàng này; ứng dụng tự xây dựng phát triển thay cần quản trị viên ủy quyền mới lấy được
    /// </summary>
    [CanBeNull]
    [JsonProperty("remark_mobiles")]
    [JsonPropertyName("remark_mobiles")]
    public List<string>? RemarkMobiles { get; set; }
    /// <summary>
    /// Nguồn mà thành viên này thêm khách hàng này
    /// </summary>
    [NotNull]
    [JsonProperty("add_way")]
    [JsonPropertyName("add_way")]
    public FollowUserAddWay AddWay { get; set; }
    /// <summary>
    /// Thông tin tài khoản Video Channels tương ứng khi nguồn thêm khách hàng này của thành viên có add_way bằng 10
    /// </summary>
    [CanBeNull]
    [JsonProperty("wechat_channels")]
    [JsonPropertyName("wechat_channels")]
    public FollowUserWechatChannel? WechatChannel { get; set; }
}
