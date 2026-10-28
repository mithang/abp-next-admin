namespace LINGYUN.Abp.WeChat.Work.Security.Claims;
public static class AbpWeChatWorkClaimTypes
{
    /// <summary>
    /// Định danh duy nhất
    /// </summary>
    public static string UserId { get; set; } = "wecom_userid";
    /// <summary>
    /// Danh thiếp mã QR
    /// </summary>
    public static string QrCode { get; set; } = "wecom_qr_code";
    /// <summary>
    /// Email doanh nghiệp
    /// </summary>
    public static string BizMail { get; set; } = "wecom_biz_mail";
    /// <summary>
    /// Địa chỉ
    /// </summary>
    public static string Address { get; set; } = "wecom_address";
}
