using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Contacts.Members.Response;
/// <summary>
/// Tham số phản hồi khi lấy userid
/// </summary>
public class WeChatWorkGetUserIdResponse : WeChatWorkResponse
{
    /// <summary>
    /// 	UserID của thành viên. Tương ứng với tài khoản ở phía quản trị, trong doanh nghiệp phải là duy nhất. Không phân biệt chữ hoa/thường, độ dài 1~64 byte. Lưu ý: giá trị mà ứng dụng bên thứ ba lấy được là userid đã mã hóa
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
}
