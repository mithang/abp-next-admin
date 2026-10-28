using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển tệp đính kèm
/// </summary>
public class FileControlValue : ControlValue
{
    /// <summary>
    /// Danh sách tệp đính kèm
    /// </summary>
    [NotNull]
    [JsonProperty("files")]
    [JsonPropertyName("files")]
    public List<FileValue> Files { get; set; } = default!;
    public FileControlValue()
    {

    }

    public FileControlValue(List<FileValue> files)
    {
        Files = files;
    }
}

public class FileValue
{
    /// <summary>
    /// id tệp, id này là media_id do giao diện tải lên tài liệu tạm thời trả về, lưu ý: sau khi nộp đơn sẽ được chuyển thành nội dung chứng từ và lưu trữ dưới dạng tệp dài hạn; hiện tại mỗi đơn xin phê duyệt, toàn cục chỉ hỗ trợ tải lên tối đa 6 tệp đính kèm, nếu không sẽ thất bại.
    /// </summary>
    [NotNull]
    [JsonProperty("file_id")]
    [JsonPropertyName("file_id")]
    public string FileId { get; set; } = default!;
    /// <summary>
    /// Tên tệp, kiểu string, nếu không có có thể điền chuỗi rỗng.
    /// </summary>
    [CanBeNull]
    [JsonProperty("file_name")]
    [JsonPropertyName("file_name")]
    public string? FileName { get; set; }
    /// <summary>
    /// Kích thước tệp, kiểu number, nếu không có có thể điền chuỗi rỗng.
    /// </summary>
    [CanBeNull]
    [JsonProperty("file_size")]
    [JsonPropertyName("file_size")]
    public long? FileSize { get; set; }
    /// <summary>
    /// Loại tệp, kiểu string, nếu không có có thể điền chuỗi rỗng.
    /// </summary>
    [CanBeNull]
    [JsonProperty("file_type")]
    [JsonPropertyName("file_type")]
    public string? FileType { get; set; }
    /// <summary>
    /// Địa chỉ tệp, kiểu string, nếu không có có thể điền chuỗi rỗng.
    /// </summary>
    [CanBeNull]
    [JsonProperty("file_url")]
    [JsonPropertyName("file_url")]
    public string? FileUrl { get; set; }
    public FileValue()
    {

    }

    public FileValue(string fileId)
    {
        FileId = fileId;
    }
}
