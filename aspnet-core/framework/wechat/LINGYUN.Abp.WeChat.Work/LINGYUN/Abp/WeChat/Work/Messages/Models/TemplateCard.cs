using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.Messages.Models;

public abstract class TemplateCard
{
    /// <summary>
    /// Loại thẻ mẫu
    /// </summary>
    [NotNull]
    [JsonProperty("card_type")]
    [JsonPropertyName("card_type")]
    public string Type { get; }
    /// <summary>
    /// id nhiệm vụ, id nhiệm vụ của cùng một ứng dụng không được trùng lặp, chỉ gồm chữ số, chữ cái và “_-@”, dài tối đa 128 byte
    /// </summary>
    [CanBeNull]
    [JsonProperty("task_id")]
    [JsonPropertyName("task_id")]
    public string TaskId { get; set; }
    protected TemplateCard(string type, string taskId = "")
    {
        Type = type;
        TaskId = taskId;
    }
}
