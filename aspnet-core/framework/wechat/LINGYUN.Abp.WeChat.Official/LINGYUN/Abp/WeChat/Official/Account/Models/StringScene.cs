using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Account.Models;
public class StringScene : Scene
{
    /// <summary>
    /// ID giá trị scene (ID dạng chuỗi), kiểu chuỗi, giới hạn độ dài từ 1 đến 64
    /// </summary>
    [JsonProperty("scene_str")]
    [JsonPropertyName("scene_str")]
    public string SceneStr { get; }
    public StringScene(string sceneStr)
    {
        SceneStr = sceneStr;
    }

    public override string GetKey()
    {
        return SceneStr;
    }
}
