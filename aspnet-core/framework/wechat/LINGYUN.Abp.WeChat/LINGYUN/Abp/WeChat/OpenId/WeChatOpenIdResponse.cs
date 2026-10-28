using LINGYUN.Abp.WeChat.Common;
using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.WeChat.OpenId;

/// <summary>
/// Đối tượng trả về OpenId của WeChat
/// </summary>
public class WeChatOpenIdResponse
{
    /// <summary>
    /// Mã lỗi
    /// </summary>
    [JsonProperty("errcode")]
    public string ErrorCode { get; set; } = default!;
    /// <summary>
    /// Khóa phiên
    /// </summary>
    [JsonProperty("session_key")]
    public string SessionKey { get; set; } = default!;
    /// <summary>
    /// Định danh duy nhất của người dùng
    /// </summary>
    [JsonProperty("openid")]
    public string OpenId { get; set; } = default!;
    /// <summary>
    /// Định danh duy nhất của người dùng trên nền tảng mở, được trả về khi thỏa mãn điều kiện cấp phát UnionID
    /// </summary>
    [JsonProperty("unionid")]
    public string? UnionId { get; set; }
    /// <summary>
    /// Thông báo lỗi
    /// </summary>
    public string ErrorMessage
    {
        get
        {
            return ErrorCode switch
            {
                "-1" => "Hệ thống đang bận, nhà phát triển vui lòng thử lại sau",
                "0" => string.Empty,
                "40029" => "code không hợp lệ",
                "45011" => "Giới hạn tần suất, mỗi người dùng 100 lần mỗi phút",
                _ => $"Mã ngoại lệ chưa được định nghĩa: {ErrorCode}, vui lòng thử lại",
            };
            ;
        }
    }
    /// <summary>
    /// Xác thực WeChat thành công khi không có errorcode hoặc errorcode bằng 0
    /// </summary>
    public bool IsError => !ErrorCode.IsNullOrWhiteSpace() && !"0".Equals(ErrorCode);

    public WeChatOpenId ToWeChatOpenId()
    {
        if(IsError)
        {
            throw new AbpWeChatException(ErrorCode, ErrorMessage);
        }
        return new WeChatOpenId(OpenId, SessionKey, UnionId);
    }
}
