using Newtonsoft.Json;
using System;

namespace LINGYUN.Abp.WxPusher.Messages;

[Serializable]
public class SendMessageResult
{
    /// <summary>
    /// Mã trạng thái
    /// </summary>
    [JsonProperty("code")]
    public int Code { get; set; } = default!;
    /// <summary>
    /// Định danh tin nhắn
    /// </summary>
    [JsonProperty("messageId")]
    [Obsolete("Đã lỗi thời, vui lòng không sử dụng nữa, trường này sẽ bị xóa sau, see: https://wxpusher.dingliqc.com/docs/#/?id=%e5%8f%91%e9%80%81%e6%b6%88%e6%81%af")]
    public long? MessageId { get; set; }
    /// <summary>
    /// Định danh nội dung tin nhắn
    /// </summary>
    /// <remarks>
    /// Mỗi lần gọi giao diện sẽ tạo một id, bạn có thể dùng id này để gọi giao diện xóa tin nhắn và xóa tin nhắn.
    /// Tất cả người dùng trong lần gửi này cùng dùng chung nội dung tin nhắn này.
    /// </remarks>
    [JsonProperty("messageContentId")]
    public long ContentId { get; set; }
    /// <summary>
    /// Định danh gửi tin nhắn
    /// </summary>
    /// <remarks>
    /// Mỗi người dùng uid hoặc topicId sẽ tạo một id, có thể dùng id này để truy vấn trạng thái gửi tới một người dùng nào đó
    /// </remarks>
    [JsonProperty("sendRecordId")]
    public long RecordId { get; set; }
    /// <summary>
    /// Trạng thái
    /// </summary>
    [JsonProperty("status")]
    public string Status { get; set; } = default!;
    /// <summary>
    /// Định danh người dùng
    /// </summary>
    [JsonProperty("uid")]
    public string Uid { get; set; } = default!;
    /// <summary>
    /// Định danh nhóm
    /// </summary>
    [JsonProperty("topicId")]
    public long? TopicId { get; set; }
    /// <summary>
    /// Có gọi thành công hay không
    /// </summary>
    public bool IsSuccessed => Code == 1000;
}
