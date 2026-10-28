namespace LINGYUN.Abp.Sms.Aliyun;
public class AliyunSmsVerifyCodeResponse
{
    /// <summary>
    /// Mã trạng thái yêu cầu, OK nghĩa là yêu cầu thành công
    /// </summary>
    public string Code { get; set; } = default!;
    /// <summary>
    /// Mô tả của mã trạng thái
    /// </summary>
    public string Message { get; set; } = default!;
    /// <summary>
    /// Yêu cầu có thành công hay không
    /// </summary>
    public bool Success { get; set; }
    /// <summary>
    /// Dữ liệu kết quả yêu cầu
    /// </summary>
    public AliyunSmsVerifyCodeModel Model { get; set; } = default!;
}

public class AliyunSmsVerifyCodeModel
{
    /// <summary>
    /// Id yêu cầu
    /// </summary>
    public string RequestId { get; set; } = default!;
    /// <summary>
    /// Id nghiệp vụ
    /// </summary>
    public string? BizId { get; set; }
    /// <summary>
    /// Số giao dịch bên ngoài
    /// </summary>
    public string? OutId { get; set; }
    /// <summary>
    /// Mã xác minh, chỉ kèm theo khi dùng dịch vụ tạo mã xác minh qua SMS của Alibaba Cloud
    /// </summary>
    public string? VerifyCode { get; set; }
}
