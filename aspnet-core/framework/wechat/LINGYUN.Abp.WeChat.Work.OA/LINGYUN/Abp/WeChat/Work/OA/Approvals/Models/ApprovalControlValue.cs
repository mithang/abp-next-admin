using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Dữ liệu đơn xin phê duyệt
/// </summary>
public class ApprovalControlValue
{
    /// <summary>
    /// Nội dung văn bản, tức nội dung văn bản mà người nộp đơn đã điền vào control này
    /// </summary>
    [CanBeNull]
    [JsonProperty("text")]
    [JsonPropertyName("text")]
    public string? Text { get; set; }
    /// <summary>
    /// Nội dung số, tức nội dung số mà người nộp đơn đã điền vào control này
    /// </summary>
    [CanBeNull]
    [JsonProperty("new_number")]
    [JsonPropertyName("new_number")]
    public decimal? NewNumber { get; set; }
    /// <summary>
    /// Nội dung số tiền, tức nội dung số tiền mà người nộp đơn đã điền vào control này
    /// </summary>
    [CanBeNull]
    [JsonProperty("new_money")]
    [JsonPropertyName("new_money")]
    public decimal? NewMoney { get; set; }
    /// <summary>
    /// Nội dung thành viên đã chọn, tức thành viên mà người nộp đơn đã chọn trong control này, ở chế độ chọn nhiều có thể có nhiều thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("members")]
    [JsonPropertyName("members")]
    public List<MemberValue> Members { get; set; } = default!;
    /// <summary>
    /// Nội dung phòng ban đã chọn, tức phòng ban mà người nộp đơn đã chọn trong control này, ở chế độ chọn nhiều có thể có nhiều phòng ban
    /// </summary>
    [NotNull]
    [JsonProperty("departments")]
    [JsonPropertyName("departments")]
    public List<DepartmentValue> Departments { get; set; } = default!;
    /// <summary>
    /// Danh sách tệp đính kèm
    /// </summary>
    [NotNull]
    [JsonProperty("files")]
    [JsonPropertyName("files")]
    public List<FileValue> Files { get; set; } = default!;
    /// <summary>
    /// Nội dung chi tiết, một control chi tiết có thể chứa nhiều chi tiết con
    /// </summary>
    [NotNull]
    [JsonProperty("children")]
    [JsonPropertyName("children")]
    public List<ApprovalDataChildrenValue> Children { get; set; } = default!;
    /// <summary>
    /// Nội dung đã chọn
    /// </summary>
    [CanBeNull]
    [JsonProperty("selector")]
    [JsonPropertyName("selector")]
    public SelectorValue? Selector { get; set; }
    /// <summary>
    /// Đơn phê duyệt liên quan
    /// </summary>
    [NotNull]
    [JsonProperty("related_approval")]
    [JsonPropertyName("related_approval")]
    public List<RelatedApprovalValue> RelatedApproval { get; set; } = default!;
}

public class ApprovalDataChildrenValue
{
    /// <summary>
    /// Nội dung chi tiết, một control chi tiết có thể chứa nhiều chi tiết con
    /// </summary>
    [NotNull]
    [JsonProperty("list")]
    [JsonPropertyName("list")]
    public List<ApprovalControlData> List { get; set; } = default!;
}