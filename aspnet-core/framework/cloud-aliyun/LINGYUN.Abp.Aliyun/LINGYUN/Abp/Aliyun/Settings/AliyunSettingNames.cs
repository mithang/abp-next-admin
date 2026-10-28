namespace LINGYUN.Abp.Aliyun.Settings;

public static class AliyunSettingNames
{
    public const string Prefix = "Abp.Aliyun";

    /// <summary>
    /// Phương thức xác thực
    /// </summary>
    public class Authorization
    {
        public const string Prefix = AliyunSettingNames.Prefix + ".Authorization";
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
    /// Dịch vụ SMS
    /// </summary>
    public class Sms
    {
        public const string Prefix = AliyunSettingNames.Prefix + ".Sms";
        /// <summary>
        /// Tên miền dịch vụ sms của Alibaba Cloud
        /// </summary>
        public const string Domain = Prefix + ".Domain";
        /// <summary>
        /// Tên phương thức gọi
        /// </summary>
        public const string ActionName = Prefix + ".ActionName";
        /// <summary>
        /// Phiên bản mặc định
        /// </summary>
        public const string Version = Prefix + ".Version";
        /// <summary>
        /// Chữ ký mặc định
        /// </summary>
        public const string DefaultSignName = Prefix + ".DefaultSignName";
        /// <summary>
        /// Mã mẫu SMS mặc định
        /// </summary>
        public const string DefaultTemplateCode = Prefix + ".DefaultTemplateCode";
        /// <summary>
        /// Số điện thoại mặc định
        /// </summary>
        public const string DefaultPhoneNumber = Prefix + ".DefaultPhoneNumber";
        /// <summary>
        /// Hiển thị lỗi cho client
        /// </summary>
        public const string VisableErrorToClient = Prefix + ".VisableErrorToClient";
    }

    /// <summary>
    /// Dịch vụ xác thực số điện thoại đám mây
    /// </summary>
    public class SmsVerifyCode
    {
        public const string Prefix = AliyunSettingNames.Prefix + ".SmsVerifyCode";
        /// <summary>
        /// Tên miền dịch vụ xác thực số điện thoại của Alibaba Cloud
        /// </summary>
        public const string Domain = Prefix + ".Domain";
        /// <summary>
        /// Chữ ký mặc định
        /// </summary>
        public const string DefaultSignName = Prefix + ".DefaultSignName";
        /// <summary>
        /// Mã mẫu SMS mặc định
        /// </summary>
        public const string DefaultTemplateCode = Prefix + ".DefaultTemplateCode";
    }
}
