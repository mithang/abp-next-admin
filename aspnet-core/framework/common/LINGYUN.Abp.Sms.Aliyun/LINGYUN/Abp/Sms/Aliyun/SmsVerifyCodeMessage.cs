namespace LINGYUN.Abp.Sms.Aliyun;
public class SmsVerifyCodeMessage
{
    /// <summary>
    /// Tên phương án, nếu không điền thì là “phương án mặc định”. Tối đa không quá 20 ký tự.
    /// </summary>
    public string? SchemeName { get; set; }
    /// <summary>
    /// Mã quốc gia của số điện thoại. Mặc định là 86, hiện tại cũng chỉ hỗ trợ gửi tới số điện thoại trong nước Trung Quốc.
    /// </summary>
    public string? CountryCode { get; set; }
    /// <summary>
    /// Mã mở rộng SMS chiều lên. SMS chiều lên là SMS gửi tới nhà cung cấp dịch vụ viễn thông, dùng để tùy chỉnh một loại dịch vụ, hoàn thành tra cứu hoặc xử lý một loại nghiệp vụ, có tính phí, trừ phí theo cước SMS thông thường của nhà mạng.
    /// </summary>
    public string? SmsUpExtendCode { get; set; }
    /// <summary>
    /// Mã giao dịch bên ngoài.
    /// </summary>
    public string? OutId { get; set; }
    /// <summary>
    /// Độ dài mã xác minh hỗ trợ từ 4 đến 8 ký tự, mặc định là 4 ký tự.
    /// </summary>
    public long? CodeLength { get; set; }
    /// <summary>
    /// Thời hạn hiệu lực của mã xác minh, đơn vị giây, mặc định là 300 giây.
    /// </summary>
    public long? ValidTime { get; set; }
    /// <summary>
    /// Quy tắc kiểm tra, khi gửi lặp mã xác minh tới cùng một số điện thoại trong cùng một ngữ cảnh trong thời gian hiệu lực thì mã xác minh cũ được xử lý như thế nào.
    /// </summary>
    /// <remarks>
    /// 1 - Xử lý ghi đè (mặc định), tức mã xác minh cũ sẽ hết hiệu lực.<br />
    /// 2 - Giữ lại, tức nhiều mã xác minh đều có thể được xác thực thành công trong thời gian hiệu lực.
    /// </remarks>
    public long? DuplicatePolicy { get; set; }
    /// <summary>
    /// Khoảng thời gian, đơn vị: giây. Tức sau bao lâu thì có thể gửi một lần mã xác minh, dùng để kiểm soát tần suất, mặc định 60 giây.
    /// </summary>
    public long? Interval { get; set; }
    /// <summary>
    /// Loại mã xác minh được tạo. Khi tham số TemplateParam truyền vào placeholder thì tham số này là bắt buộc, hệ thống sẽ tạo mã xác minh theo quy tắc đã chỉ định.
    /// </summary>
    /// <remarks>
    /// 1 - Chỉ chữ số (mặc định).
    /// 2 - Chỉ chữ hoa.
    /// 3 - Chỉ chữ thường.
    /// 4 - Chữ hoa và chữ thường trộn lẫn.
    /// 5 - Chữ số + chữ hoa trộn lẫn.
    /// 6 - Chữ số + chữ thường trộn lẫn.
    /// 7 - Chữ số + chữ hoa và chữ thường trộn lẫn.
    /// </remarks>
    public long? CodeType { get; set; }
    /// <summary>
    /// Có trả về mã xác minh hay không.
    /// </summary>
    public bool? ReturnVerifyCode { get; set; }
    /// <summary>
    /// Có tự động thay thế chữ ký để thử lại hay không (mặc định bật.
    /// </summary>
    public bool? AutoRetry { get; set; }
    /// <summary>
    /// Số điện thoại di động của bên nhận SMS.
    /// </summary>
    public string PhoneNumber { get; }
    /// <summary>
    /// Tên chữ ký. Tạm thời chưa hỗ trợ dùng chữ ký tùy chỉnh, vui lòng dùng chữ ký do hệ thống tặng.
    /// </summary>
    public string? SignName { get; }
    /// <summary>
    /// CODE mẫu SMS. Khi tham số SignName chọn chữ ký được tặng thì bắt buộc phải dùng kèm mẫu được tặng để gửi SMS. Bạn có thể chọn mẫu phù hợp với ngữ cảnh nghiệp vụ của mình tại trang cấu hình mẫu được tặng.
    /// </summary>
    public string? TemplateCode { get; }
    /// <summary>
    /// Tham số mẫu SMS.
    /// </summary>
    public SmsVerifyCodeMessageParam TemplateParam { get; }
    public SmsVerifyCodeMessage(
        string phoneNumber, 
        SmsVerifyCodeMessageParam templateParam,
        string? signName = null,
        string? templateCode = null)
    {
        PhoneNumber = phoneNumber;
        TemplateParam = templateParam;
        SignName = signName;
        TemplateCode = templateCode;
    }
}
