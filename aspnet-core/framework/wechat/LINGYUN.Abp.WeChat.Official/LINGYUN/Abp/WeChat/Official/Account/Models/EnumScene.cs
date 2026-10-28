using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Account.Models;
public class EnumScene : Scene
{
    /// <summary>
    /// ID giá trị scene, với mã QR tạm thời là số nguyên khác 0 có 32 bit, với mã QR vĩnh viễn giá trị lớn nhất là 100000 (hiện tại tham số chỉ hỗ trợ 1--100000)
    /// </summary>
    [JsonProperty("scene_id")]
    [JsonPropertyName("scene_id")]
    public int SceneId { get; }
    public EnumScene(int sceneId)
    {
        SceneId = sceneId;
    }

    public override string GetKey()
    {
        return SceneId.ToString();
    }
}
