using Newtonsoft.Json;

namespace LINGYUN.Abp.PushPlus.Topic;

public class PushPlusTopicQrCode
{
    /// <summary>
    /// Đường dẫn hình ảnh mã QR của nhóm
    /// </summary>
    [JsonProperty("qrCodeImgUrl")]
    public string QrCodeImgUrl { get; set; } = default!;
    /// <summary>
    /// Loại mã QR;
    /// 0 - Mã QR tạm thời,
    /// 1 - Mã QR vĩnh viễn
    /// </summary>
    [JsonProperty("forever")]
    public PushPlusTopicQrCodeType Forever { get; set; }
}
