using LINGYUN.Abp.Location.Tencent.Localization;
using Newtonsoft.Json;
using Volo.Abp;
using Volo.Abp.Localization;

namespace LINGYUN.Abp.Location.Tencent.Response;

public abstract class TencentLocationResponse
{
    /// <summary>
    /// Mã trạng thái, 0 là bình thường,
    /// 310 thông tin tham số yêu cầu có lỗi,
    /// 311 định dạng Key bị lỗi,
    /// 306 thông tin của yêu cầu có vấn đề, vui lòng kiểm tra chuỗi,
    /// 110 nguồn yêu cầu chưa được cấp quyền
    /// </summary>
    [JsonProperty("status")]
    public int Status { get; set; }
    /// <summary>
    /// Mô tả trạng thái
    /// </summary>
    [JsonProperty("message")]
    public string Message { get; set; } = default!;
    /// <summary>
    /// Định danh duy nhất của yêu cầu lần này
    /// </summary>
    [JsonProperty("request_id")]
    public string RequestId { get; set; } = default!;
    /// <summary>
    /// Yêu cầu có thành công hay không
    /// </summary>
    public bool IsSuccessed => Status.Equals(0);

    public ILocalizableString GetErrorMessage(bool throwToClient = false)
    {
        switch (Status)
        {
            case 0:
                return LocalizableString.Create<TencentLocationResource>("Message:RETURN_0");
            case 110:
                return LocalizableString.Create<TencentLocationResource>("Message:RETURN_110");
            case 306:
                return LocalizableString.Create<TencentLocationResource>("Message:RETURN_306");
            case 310:
                return LocalizableString.Create<TencentLocationResource>("Message:RETURN_310");
            case 311:
                return LocalizableString.Create<TencentLocationResource>("Message:RETURN_311");
            default:
                if (throwToClient)
                {
                    throw new LocationResolveException(Message);
                }
                throw new AbpException(Message);
        }
    }
}
