using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.ExternalContact.MsgAudits.Request;
/// <summary>
/// Tham Số yêu cầu lấy danh sách thành viên đã bật lưu trữ nội dung phiên
/// </summary>
/// <remarks>
/// Chi tiết xem: <see href="https://developer.work.weixin.qq.com/document/path/91614" />
/// </remarks>
public class WeChatWorkGetPermitUserListRequest : WeChatWorkRequest
{
    /// <summary>
    /// Lấy danh sách thành viên đã bật của phiên bản tương ứng. 1 là bản văn phòng; 2 là bản dịch vụ; 3 là bản doanh nghiệp. Không bắt buộc, khi không điền sẽ trả về toàn bộ danh sách thành viên
    /// </summary>
    [CanBeNull]
    [JsonProperty("cursor")]
    [JsonPropertyName("cursor")]
    public int? Type { get; }
    private WeChatWorkGetPermitUserListRequest(int? type = null)
    {
        Type = type; 
    }
    /// <summary>
    /// Mặc định
    /// </summary>
    /// <returns></returns>
    public static WeChatWorkGetPermitUserListRequest Default()
    {
        return new WeChatWorkGetPermitUserListRequest();
    }
    /// <summary>
    /// Bản văn phòng
    /// </summary>
    /// <returns></returns>
    public static WeChatWorkGetPermitUserListRequest Office()
    {
        return new WeChatWorkGetPermitUserListRequest(1);
    }
    /// <summary>
    /// Bản dịch vụ
    /// </summary>
    /// <returns></returns>
    public static WeChatWorkGetPermitUserListRequest Service()
    {
        return new WeChatWorkGetPermitUserListRequest(2);
    }
    /// <summary>
    /// Bản doanh nghiệp
    /// </summary>
    /// <returns></returns>
    public static WeChatWorkGetPermitUserListRequest Enterprise()
    {
        return new WeChatWorkGetPermitUserListRequest(3);
    }
}
