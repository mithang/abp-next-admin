namespace LINGYUN.Abp.Gdpr;

public static class GdprErrorCodes
{
    public const string Namespace = "Gdpr";
    /// <summary>
    /// Bạn đã gửi một yêu cầu tải xuống dữ liệu cá nhân, vui lòng thử lại sau {RequestTimeInterval}.
    /// </summary>
    public const string PersonalDataRequestAlreadyDays = Namespace + ":010001";
    /// <summary>
    /// Dữ liệu cá nhân của bạn đang được chuẩn bị, vui lòng thử tải xuống lại sau {ReadyTime}.
    /// </summary>
    public const string DataNotPreparedYet = Namespace + ":010002";
}
