using JetBrains.Annotations;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Work.OA.Approvals.Models;
/// <summary>
/// Cấu hình điều khiển tệp đính kèm
/// </summary>
public class FileControlConfig : ControlConfig
{
    /// <summary>
    /// Điều khiển tệp đính kèm
    /// </summary>
    [NotNull]
    [JsonProperty("file")]
    [JsonPropertyName("file")]
    public FileConfig File { get; set; } = default!;
    public FileControlConfig()
    {

    }

    public FileControlConfig(FileConfig file)
    {
        File = file;
    }
}

public class FileConfig
{
    /// <summary>
    /// Có chỉ cho phép chụp ảnh hay không, 1 - có, 0 - không
    /// </summary>
    [NotNull]
    [JsonProperty("is_only_photo")]
    [JsonPropertyName("is_only_photo")]
    public byte IsOnlyPhoto { get; set; }
    public FileConfig()
    {

    }

    public FileConfig(byte isOnlyPhoto)
    {
        IsOnlyPhoto = isOnlyPhoto;
    }
}
