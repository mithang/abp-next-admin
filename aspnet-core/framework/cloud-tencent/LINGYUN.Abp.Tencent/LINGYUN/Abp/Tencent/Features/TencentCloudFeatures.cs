namespace LINGYUN.Abp.Tencent.Features;

public static class TencentCloudFeatures
{
    public const string GroupName = "Abp.TencentCloud";

    public static class Sms
    {
        public const string GroupName = TencentCloudFeatures.GroupName + ".Sms";
        /// <summary>
        /// Bật SMS
        /// </summary>
        public const string Enable = GroupName + ".Enable";
    }

    public static class BlobStoring
    {
        public const string GroupName = TencentCloudFeatures.GroupName + ".BlobStoring";
        /// <summary>
        /// Bật lưu trữ đối tượng
        /// </summary>
        public const string Enable = GroupName + ".Enable";
        /// <summary>
        /// Giới hạn kích thước luồng tối đa, nhỏ hơn hoặc bằng 0 thì không hợp lệ, đơn vị (MB)
        /// Mặc định: 0
        /// </summary>
        public const string MaximumStreamSize = GroupName + ".MaximumStreamSize";
    }
}
