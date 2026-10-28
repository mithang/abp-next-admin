namespace LINGYUN.Abp.Tencent.Settings;

public static class TencentCloudSettingNames
{
    public const string Prefix = "Abp.TencentCloud";
    /// <summary>
    /// SecretId
    /// </summary>
    public const string SecretId = Prefix + ".SecretId";
    /// <summary>
    /// SecretKey
    /// </summary>
    public const string SecretKey = Prefix + ".SecretKey";
    /// <summary>
    /// Kết nối khu vực
    /// </summary>
    public const string EndPoint = Prefix + ".EndPoint";
    /// <summary>
    /// Thời lượng phiên
    /// </summary>
    public const string DurationSecond = Prefix + ".DurationSecond";
    /// <summary>
    /// Phương thức xác thực
    /// </summary>
    public class Authorization
    {
        public const string Prefix = TencentCloudSettingNames.Prefix + ".Authorization";
        /// <summary>
        /// ID khu vực
        /// </summary>
        public const string RegionId = Prefix + ".RegionId";
        /// <summary>
        /// AccessKey ID của tài khoản RAM
        /// </summary>
        public const string AccessKeyId = Prefix + ".AccessKeyId";
        /// <summary>
        /// AccessKey Secret của tài khoản RAM
        /// </summary>
        public const string AccessKeySecret = Prefix + ".AccessKeySecret";
        /// <summary>
        /// Truy cập bằng STS Token
        /// </summary>
        public const string UseSecurityTokenService = Prefix + ".UseSecurityTokenService";
        /// <summary>
        /// Truy cập bằng phương thức AssumeRole của tài khoản con RAM
        /// </summary>
        public const string RamRoleArn = Prefix + ".RamRoleArn";
        /// <summary>
        /// Tham số tùy chỉnh của người dùng. Tham số này dùng để phân biệt các token khác nhau, có thể dùng cho kiểm toán truy cập cấp người dùng
        /// </summary>
        public const string RoleSessionName = Prefix + ".RoleSessionName";
        /// <summary>
        /// Thời gian hết hạn, đơn vị là giây.
        /// </summary>
        public const string DurationSeconds = Prefix + ".DurationSeconds";
        /// <summary>
        /// Chính sách quyền.
        /// </summary>
        public const string Policy = Prefix + ".Policy";
    }
    /// <summary>
    /// Cài đặt kết nối
    /// </summary>
    public class Connection
    {
        public const string Prefix = TencentCloudSettingNames.Prefix + ".Connection";
        /// <summary>
        /// Máy chủ proxy
        /// </summary>
        public const string WebProxy = Prefix + ".WebProxy";
        /// <summary>
        /// Kết nối khu vực
        /// Theo tài liệu Tencent Cloud, đối với dịch vụ khu vực tài chính cần chỉ định tên miền
        /// </summary>
        public const string EndPoint = Prefix + ".EndPoint";
        /// <summary>
        /// Phương thức Http, theo tài liệu Tencent Cloud, các phương thức khác nhau có giới hạn về kích thước yêu cầu
        /// Mặc định: POST
        /// </summary>
        public const string HttpMethod = Prefix + ".HttpMethod";
        /// <summary>
        /// Thời gian chờ
        /// </summary>
        public const string Timeout = Prefix + ".Timeout";
    }

    public static class Sms
    {
        private const string Prefix = TencentCloudSettingNames.Prefix + ".Sms";
        /// <summary>
        /// SdkAppId SMS
        /// SdkAppId thực tế được tạo sau khi thêm ứng dụng trong Bảng điều khiển SMS, ví dụ 1400006666.
        /// </summary>
        public const string AppId = Prefix + ".AppId";
        /// <summary>
        /// Nội dung chữ ký SMS
        /// </summary>
        public const string DefaultSignName = Prefix + ".DefaultSignName";
        /// <summary>
        /// ID mẫu SMS mặc định
        /// </summary>
        public const string DefaultTemplateId = Prefix + ".DefaultTemplateId";
    }
}
