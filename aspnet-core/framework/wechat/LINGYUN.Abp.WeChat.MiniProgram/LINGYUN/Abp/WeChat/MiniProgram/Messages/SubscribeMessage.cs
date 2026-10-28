using Newtonsoft.Json;
using System.Collections.Generic;

namespace LINGYUN.Abp.WeChat.MiniProgram.Messages;

public class SubscribeMessage
{
    /// <summary>
    /// openid của người nhận (người dùng)
    /// </summary>
    [JsonProperty("touser")]
    public string ToUser { get; set; } = default!;
    /// <summary>
    /// Id của mẫu đăng ký cần gửi
    /// </summary>
    [JsonProperty("template_id")]
    public string TemplateId { get; set; } = default!;
    /// <summary>
    /// Trang chuyển hướng sau khi nhấn vào thẻ mẫu, chỉ giới hạn trong các trang của Mini Program này.
    /// Hỗ trợ kèm tham số (ví dụ index?foo=bar).
    /// Nếu không điền trường này thì mẫu không có chuyển hướng
    /// </summary>
    [JsonProperty("page")]
    public string? Page { get; set; }
    /// <summary>
    /// Loại Mini Program chuyển hướng:
    /// developer là bản phát triển; trial là bản dùng thử; formal là bản chính thức;
    /// Mặc định là bản chính thức
    /// </summary>
    [JsonProperty("miniprogram_state")]
    public string? MiniProgramState { get; set; }
    /// <summary>
    /// Loại ngôn ngữ khi vào Mini Program để xem,
    /// hỗ trợ zh_CN (tiếng Trung giản thể), en_US (tiếng Anh), zh_HK (tiếng Trung phồn thể), zh_TW (tiếng Trung phồn thể),
    /// mặc định là zh_CN
    /// </summary>
    [JsonProperty("lang")]
    public string? Lang { get; set; } = "zh_CN";
    /// <summary>
    /// Nội dung mẫu,
    /// định dạng dạng { "key1": { "value": any }, "key2": { "value": any } }
    /// </summary>
    [JsonProperty("data")]
    public Dictionary<string, MessageData> Data { get; set; } = new Dictionary<string, MessageData>();

    public SubscribeMessage() { }
    public SubscribeMessage(
        string openId,
        string templateId,
        string? redirectPage = "",
        string? state = "formal",
        string? miniLang = "zh_CN")
    {
        ToUser = openId;
        TemplateId = templateId;
        Page = redirectPage;
        MiniProgramState = state;
        Lang = miniLang;
    }

    public SubscribeMessage WriteData(string prefix, string key, object value)
    {
        // Chỉ lấy dữ liệu khớp với tiền tố
        if (key.StartsWith(prefix))
        {
            key = key.Replace(prefix, "");
            if (!Data.ContainsKey(key))
            {
                Data.Add(key, new MessageData(value));
            }
        }
        return this;
    }

    public SubscribeMessage WriteData(string prefix, IDictionary<string, object?>? setData)
    {
        if (setData != null)
        {
            foreach (var kv in setData)
            {
                WriteData(prefix, kv.Key, kv.Value ?? "");
            }
        } 
        return this;
    }

    public SubscribeMessage WriteData(IDictionary<string, object?>? setData)
    {
        if (setData != null)
        {
            foreach (var kv in setData)
            {
                if (!Data.ContainsKey(kv.Key))
                {
                    Data.Add(kv.Key, new MessageData(kv.Value ?? ""));
                }
            }
        }
        return this;
    }
}

public class MessageData
{
    [JsonProperty("value")]
    public object Value { get; }

    public MessageData(object value)
    {
        Value = value;
    }
}
