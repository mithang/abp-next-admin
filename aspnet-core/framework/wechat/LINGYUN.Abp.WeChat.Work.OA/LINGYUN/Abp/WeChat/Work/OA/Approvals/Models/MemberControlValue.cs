using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Giá trị điều khiển thành viên
/// </summary>
public class MemberControlValue : ContactControlValue
{
    /// <summary>
    /// Nội dung thành viên đã chọn, tức thành viên mà người nộp đơn chọn trong điều khiển này, ở chế độ chọn nhiều có thể có nhiều thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("members")]
    [JsonPropertyName("members")]
    public List<MemberValue> Members { get; set; } = default!;
    public MemberControlValue()
    {

    }

    private MemberControlValue(List<MemberValue> members)
    {
        Members = members;
    }

    public static MemberControlValue Single(MemberValue member)
    {
        return new MemberControlValue(new List<MemberValue> { member });
    }

    public static MemberControlValue Multiple(List<MemberValue> members)
    {
        return new MemberControlValue(members);
    }
}

public class MemberValue
{
    /// <summary>
    /// userid của thành viên đã chọn
    /// </summary>
    [NotNull]
    [JsonProperty("userid")]
    [JsonPropertyName("userid")]
    public string UserId { get; set; } = default!;
    /// <summary>
    /// Tên thành viên
    /// </summary>
    [NotNull]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;
    public MemberValue()
    {

    }

    public MemberValue(string userId, string name)
    {
        UserId = userId;
        Name = name;
    }
}
