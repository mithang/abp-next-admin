using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace LINGYUN.Abp.WeChat.Official.Account.Models;
public class CreateTicketModel : WeChatRequest
{
    /// <summary>
    /// Thời gian hiệu lực của mã QR này, tính bằng giây. Tối đa không quá 2592000 (tức 30 ngày); nếu không điền trường này thì thời hạn hiệu lực mặc định là 60 giây.
    /// </summary>
    [JsonProperty("expire_seconds")]
    [JsonPropertyName("expire_seconds")]
    public int? ExpireSeconds { get; set; }
    /// <summary>
    /// Loại mã QR
    /// </summary>
    /// <remarks>
    ///     <list type="table">
    ///         <item>QR_SCENE là giá trị tham số dạng số nguyên tạm thời</item>
    ///         <item>QR_STR_SCENE là giá trị tham số dạng chuỗi tạm thời</item>
    ///         <item>QR_LIMIT_SCENE là giá trị tham số dạng số nguyên vĩnh viễn</item>
    ///         <item>QR_LIMIT_STR_SCENE là giá trị tham số dạng chuỗi vĩnh viễn</item>
    ///     </list>
    /// </remarks>
    [JsonProperty("action_name")]
    [JsonPropertyName("action_name")]
    public string ActionName { get; private set; } = default!;
    /// <summary>
    /// Thông tin chi tiết của mã QR
    /// </summary>
    [JsonProperty("action_info")]
    [JsonPropertyName("action_info")]
    public Scene SceneInfo { get; private set; } = default!;
    private CreateTicketModel()
    {

    }
    /// <summary>
    /// Tạo ticket mã QR tạm thời bằng tên giá trị scene
    /// </summary>
    /// <param name="sceneStr">Tên giá trị scene</param>
    /// <param name="expireSeconds">Thời gian hiệu lực của mã QR</param>
    /// <returns></returns>
    public static CreateTicketModel StringScene(
        string sceneStr,
        int expireSeconds = 60)
    {
        return new CreateTicketModel
        {
            ExpireSeconds = expireSeconds,
            ActionName = "QR_STR_SCENE",
            SceneInfo = new StringScene(sceneStr),
        };
    }
    /// <summary>
    /// Tạo ticket mã QR vĩnh viễn bằng tên giá trị scene
    /// </summary>
    /// <param name="sceneStr">Tên giá trị scene</param>
    /// <returns></returns>
    public static CreateTicketModel LimitStringScene(string sceneStr)
    {
        return new CreateTicketModel
        {
            ActionName = "QR_LIMIT_STR_SCENE",
            SceneInfo = new StringScene(sceneStr),
        };
    }
    /// <summary>
    /// Tạo ticket mã QR bằng định danh giá trị scene
    /// </summary>
    /// <param name="sceneId">Định danh giá trị scene</param>
    /// <param name="expireSeconds">Thời gian hiệu lực của mã QR</param>
    /// <returns></returns>
    public static CreateTicketModel EnumScene(
        int sceneId,
        int expireSeconds = 60)
    {
        return new CreateTicketModel
        {
            ExpireSeconds = expireSeconds,
            ActionName = "QR_SCENE",
            SceneInfo = new EnumScene(sceneId),
        };
    }
    /// <summary>
    /// Tạo ticket mã QR vĩnh viễn bằng định danh giá trị scene
    /// </summary>
    /// <param name="sceneId">Định danh giá trị scene</param>
    /// <returns></returns>
    public static CreateTicketModel LimitEnumScene(int sceneId)
    {
        return new CreateTicketModel
        {
            ActionName = "QR_LIMIT_SCENE",
            SceneInfo = new EnumScene(sceneId),
        };
    }
}
